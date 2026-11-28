(function () {
    'use strict';

    if (window.hide_balancers_v9_installed) return;
    window.hide_balancers_v9_installed = true;

    // ==========================================
    // 1. БАГАТОМОВНІСТЬ
    // ==========================================
    Lampa.Lang.add({
        hide_balancers_title: {
            uk: 'Фільтр меню картки',
            ru: 'Фильтр меню карточки',
            en: 'Card Menu Filter'
        },
        hide_balancers_descr: {
            uk: 'Приховує непотрібні пункти з контекстного меню за ключовими словами',
            ru: 'Скрывает ненужные пункты из контекстного меню по ключевым словам',
            en: 'Hides unwanted items from the context menu by keywords'
        }
    });

    // ==========================================
    // 2. ОНОВЛЕННЯ МЕТАДАНИХ
    // ==========================================
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
                 : 'Фільтр меню картки';
        }
        if (!descr || descr === 'hide_balancers_descr') {
            descr = (lang === 'en') ? 'Hides unwanted items from the context menu by keywords'
                  : (lang === 'ru') ? 'Скрывает ненужные пункты из контекстного меню по ключевым словам'
                  : 'Приховує непотрібні пункти з контекстного меню за ключовими словами';
        }
        return { name: name, descr: descr, author: '@elixcat 🌚' };
    }

    function updatePluginMeta() {
        if (!window.Lampa || !Lampa.Plugins || !Lampa.Plugins.get) return;
        try {
            var plugins = Lampa.Plugins.get();
            var meta = getLocalizedMeta();
            var changed = false;
            for (var i = 0; i < plugins.length; i++) {
                var plugin = plugins[i];
                var url = String(plugin && plugin.url || '');
                
                // Шукаємо наш плагін за компонентом
                if (plugin.component === 'hide_balancers' || /\/hide_balancers(?:\.v\d+)?\.js(?:[?#].*)?$/i.test(url)) {
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
    // 3. ОСНОВНА ЛОГІКА
    // ==========================================
    function startPlugin() {
        // МАНІФЕСТ
        var manifest = {
            type: 'other',
            version: '2.2.1',
            name: Lampa.Lang.translate('hide_balancers_title'),
            description: Lampa.Lang.translate('hide_balancers_descr'),
            author: '@elixcat 🌚',
            component: 'hide_balancers'
        };
        Lampa.Manifest.plugins = manifest;

        // ЧОРНИЙ СПИСОК
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
        }

        // ЗАПУСК
        start();

        // ==========================================
        // 4. ОНОВЛЕННЯ МЕТАДАНИХ (ТЕПЕР ВСЕРЕДИНІ START PLUGIN)
        // ==========================================
        updatePluginMeta();
        setTimeout(updatePluginMeta, 1000);
        setTimeout(updatePluginMeta, 3000);

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

    // ==========================================
    // 5. ІНІЦІАЛІЗАЦІЯ
    // ==========================================
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }

})();
