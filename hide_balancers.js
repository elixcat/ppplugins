(function () {
    'use strict';

    if (window.hide_balancers_v7_installed) return;
    window.hide_balancers_v7_installed = true;

    var manifest = {
        type: 'other',
        version: '2.1.0',
        name: 'Фільтр меню картки',
        description: 'Приховує непотрібні пункти з контекстного меню за ключовими словами',
        author: '@elixcat 🌚',
        component: 'hide_balancers'
    };

    Lampa.Manifest.plugins = manifest;

    // ==========================================
    // 1. БАГАТОМОВНІСТЬ ТА МЕТАДАНІ
    // ==========================================
    Lampa.Lang.add({
        hide_balancers_title: {
            uk: 'Фільтр меню картки',
            ru: 'Фильтр меню карточки',
            en: 'Card Menu Filter',
            be: 'Фільтр меню карткі'
        },
        hide_balancers_descr: {
            uk: 'Приховує непотрібні пункти з контекстного меню за ключовими словами',
            ru: 'Скрывает ненужные пункты из контекстного меню по ключевым словам',
            en: 'Hides unwanted items from the context menu by keywords',
            be: 'Скрывае непатрэбныя пункты з кантэкстнага меню па ключавых словах'
        }
    });

    function getCurrentLang() {
        try {
            return Lampa.Storage.get('language', 'uk') || 'uk';
        } catch (e) {
            return 'uk';
        }
    }

    function getLocalizedMeta() {
        var lang = getCurrentLang();
        var name = Lampa.Lang.translate('hide_balancers_title');
        var descr = Lampa.Lang.translate('hide_balancers_descr');
        
        if (!name || name === 'hide_balancers_title') {
            name = (lang === 'en') ? 'Card Menu Filter'
                 : (lang === 'ru') ? 'Фильтр меню карточки'
                 : (lang === 'be') ? 'Фільтр меню карткі'
                 : 'Фільтр меню картки';
        }
        if (!descr || descr === 'hide_balancers_descr') {
            descr = (lang === 'en') ? 'Hides unwanted items from the context menu by keywords'
                  : (lang === 'ru') ? 'Скрывает ненужные пункты из контекстного меню по ключевым словам'
                  : (lang === 'be') ? 'Скрывае непатрэбныя пункты з кантэкстнага меню па ключавых словах'
                  : 'Приховує непотрібні пункти з контекстного меню за ключовими словами';
        }
        return { name: name, descr: descr, author: manifest.author };
    }

    function updatePluginMeta() {
        if (!window.Lampa || !Lampa.Plugins || !Lampa.Plugins.get) return;
        try {
            var plugins = Lampa.Plugins.get();
            var meta = getLocalizedMeta();
            var changed = false;
            for (var i = 0; i < plugins.length; i++) {
                var plugin = plugins[i];
                // Шукаємо наш плагін за компонентом
                if (plugin.component === 'hide_balancers') {
                    if (plugin.name !== meta.name) {
                        plugin.name = meta.name;
                        changed = true;
                    }
                    if (plugin.descr !== meta.descr) {
                        plugin.descr = meta.descr;
                        changed = true;
                    }
                    if (plugin.author !== meta.author) {
                        plugin.author = meta.author;
                        changed = true;
                    }
                }
            }
            if (changed && Lampa.Plugins.save) Lampa.Plugins.save();
        } catch (e) {}
    }

    // ==========================================
    // 2. НАЛАШТУВАННЯ ЧОРНОГО СПИСКУ
    // ==========================================
    var BLACKLIST_WORDS = [
        'онлайн', 'ualfilms', 'bandera', 'z01', 'alpac', 
        'статус', 'дивлюся', 'переглянуто', 'заплановано', 
        'далі буде', 'відкинуто', 'подобається', 'закладки'
    ];

    function processMenu() {
        var selectboxes = document.querySelectorAll('.selectbox');
        
        selectboxes.forEach(function(menu) {
            var items = menu.querySelectorAll('.selectbox-item, .settings-param-title');
            
            items.forEach(function(item) {
                var textContent = item.textContent.trim().toLowerCase();
                var shouldHide = false;
                
                for (var i = 0; i < BLACKLIST_WORDS.length; i++) {
                    if (textContent.indexOf(BLACKLIST_WORDS[i].toLowerCase()) !== -1) {
                        shouldHide = true;
                        break;
                    }
                }

                if (shouldHide) {
                    item.style.setProperty('display', 'none', 'important');
                }
            });
        });
    }

    var observer = new MutationObserver(function (mutations) {
        var shouldProcess = false;
        
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) { 
                        if (node.matches && (node.matches('.selectbox') || node.matches('.selectbox-item') || node.querySelector('.selectbox'))) {
                            shouldProcess = true;
                        }
                    }
                });
            }
        });

        if (shouldProcess) {
            setTimeout(processMenu, 50);
            setTimeout(processMenu, 150);
            setTimeout(processMenu, 300);
        }
    });

    function start() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        setTimeout(processMenu, 500);

        // Оновлюємо метадані при старті
        updatePluginMeta();
        setTimeout(updatePluginMeta, 1000);
        setTimeout(updatePluginMeta, 3000);

        // Слухаємо зміну мови для оновлення метаданих
        if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
            try {
                Lampa.Storage.listener.follow('change', function (e) {
                    if (e && e.name === 'language') {
                        updatePluginMeta();
                        setTimeout(updatePluginMeta, 500);
                    }
                });
            } catch (err) {}
        }
    }

    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                start();
            }
        });
    }

})();
