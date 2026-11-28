(function () {
    'use strict';

    if (window.hide_balancers_v8_installed) return;
    window.hide_balancers_v8_installed = true;

    var manifest = {
        type: 'other',
        version: '2.2.0',
        name: 'Фільтр меню картки',
        description: 'Приховує непотрібні пункти з контекстного меню за ключовими словами',
        author: '@elixcat 🌚',
        component: 'hide_balancers'
    };

    Lampa.Manifest.plugins = manifest;

    // ==========================================
    // 1. БАГАТОМОВНІСТЬ
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
            name = (lang === 'en') ? 'Card Menu Filter' : 'Фільтр меню картки';
        }
        if (!descr || descr === 'hide_balancers_descr') {
            descr = (lang === 'en') ? 'Hides unwanted items...' : 'Приховує непотрібні пункти...';
        }
        return { name: name, descr: descr };
    }

    // ==========================================
    // 2. ВІЗУАЛЬНЕ ОНОВЛЕННЯ (Робота з DOM)
    // ==========================================
    function updatePluginVisuals() {
        var meta = getLocalizedMeta();
        
        // Шукаємо всі елементи, які можуть містити назву плагіна в списку
        // Зазвичай це блоки з класами, що містять 'plugin' або 'extension'
        var elements = document.querySelectorAll('.settings-param, .plugin-item, .extension-item, .card');
        
        elements.forEach(function(el) {
            // Перевіряємо, чи є в цьому блоці текст, схожий на нашу стару назву
            var text = el.textContent || '';
            
            // Якщо знайшли згадку нашого компонента або старої назви
            if (text.indexOf('Фільтр меню картки') !== -1 || text.indexOf('hide_balancers') !== -1) {
                // Знаходимо заголовок всередині
                var titleEl = el.querySelector('.settings-param__name, .card__title, .plugin-name');
                if (titleEl && titleEl.textContent.trim() !== meta.name) {
                    titleEl.textContent = meta.name;
                }
                
                // Знаходимо опис
                var descrEl = el.querySelector('.settings-param__descr, .card__descr, .plugin-descr');
                if (descrEl && descrEl.textContent.trim() !== meta.descr) {
                    descrEl.textContent = meta.descr;
                }
            }
        });
    }

    // ==========================================
    // 3. НАЛАШТУВАННЯ ЧОРНОГО СПИСКУ (Без змін)
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

    // ==========================================
    // 4. СПОСТЕРІГАЧ
    // ==========================================
    var observer = new MutationObserver(function (mutations) {
        var shouldProcessMenu = false;
        var shouldProcessVisuals = false;
        
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) { 
                        // Для меню картки
                        if (node.matches && (node.matches('.selectbox') || node.matches('.selectbox-item') || node.querySelector('.selectbox'))) {
                            shouldProcessMenu = true;
                        }
                        // Для списку плагінів
                        if (node.matches && (node.matches('.settings-param') || node.matches('.card') || node.querySelector('.settings-param'))) {
                            shouldProcessVisuals = true;
                        }
                    }
                });
            }
        });

        if (shouldProcessMenu) {
            setTimeout(processMenu, 50);
            setTimeout(processMenu, 150);
            setTimeout(processMenu, 300);
        }
        if (shouldProcessVisuals) {
            setTimeout(updatePluginVisuals, 100);
            setTimeout(updatePluginVisuals, 500);
        }
    });

    function start() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Початкові перевірки
        setTimeout(processMenu, 500);
        setTimeout(updatePluginVisuals, 1000);
        setTimeout(updatePluginVisuals, 3000);

        // Слухаємо зміну мови для оновлення візуалу
        if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
            try {
                Lampa.Storage.listener.follow('change', function (e) {
                    if (e && e.name === 'language') {
                        setTimeout(updatePluginVisuals, 500);
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
