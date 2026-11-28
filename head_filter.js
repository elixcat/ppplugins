(function() {
    'use strict';

    // ==========================================
    // 1. БАГАТОМОВНІСТЬ
    // ==========================================
    Lampa.Lang.add({
        // ... (ваш блок перекладів без змін) ...
        search: { ru: 'Поиск', en: 'Search', uk: 'Пошук', zh: '搜索' },
        settings: { ru: 'Настройки', en: 'Settings', uk: 'Налаштування', zh: '设置' },
        premium: { ru: 'Премиум', en: 'Premium', uk: 'Преміум', zh: '高级' },
        profile: { ru: 'Профиль', en: 'Profile', uk: 'Профіль', zh: '个人资料' },
        feed: { ru: 'Новости', en: 'Feed', uk: 'Новини', zh: '动态' },
        notice: { ru: 'Уведомления', en: 'Notifications', uk: 'Сповіщення', zh: '通知' },
        broadcast: { ru: 'Вещание', en: 'Broadcast', uk: 'Мовлення', zh: '直播' },
        friends: { ru: 'Друзья', en: 'Friends', uk: 'Друзі', zh: '朋友' },
        fullscreen: { ru: 'Полноэкранный режим', en: 'Fullscreen mode', uk: 'Повноекранний режим', zh: '全屏模式' },
        reload: { ru: 'Обновление страницы', en: 'Page reload', uk: 'Оновлення сторінки', zh: '页面重新加载' },
        blackfriday: { ru: 'Черная пятница', en: 'Black Friday', uk: 'Чорна п’ятниця', zh: '黑色星期五' },
        split: { ru: 'Разделитель', en: 'Divider', uk: 'Розділювач', zh: '分隔符' },
        time: { ru: 'Время', en: 'Time', uk: 'Годинник', zh: '时间' },
        name_menu: { ru: 'Отображать в шапке', en: 'Display in header', uk: 'Відображати у шапці', zh: '在标题中显示' },
        name_plugin: { ru: 'Настройка шапки', en: 'Header Settings', uk: 'Налаштування шапки', zh: '头部设置' },
        plugin_description: { ru: 'Плагин для настройки шапки', en: 'Plugin for customizing the header', uk: 'Плагін для налаштування шапки', zh: '用于配置头部的插件' }
    });

    function startPlugin() {
        // ==========================================
        // 2. МАНІФЕСТ
        // ==========================================
        var manifest = {
            type: 'other',
            version: '0.2.6', // Підняв версію
            name: Lampa.Lang.translate('name_plugin'),
            description: Lampa.Lang.translate('plugin_description'),
            author: '@elixcat 🌚',
            component: 'head_filter',
        };
        Lampa.Manifest.plugins = manifest;

        // ==========================================
        // 3. СПИСОК ЕЛЕМЕНТІВ
        // ==========================================
        var head = {
            'head_filter_show_search': {name: Lampa.Lang.translate('search'), element: '.open--search'},
            'head_filter_show_settings': {name: Lampa.Lang.translate('settings'), element: '.open--settings'}, 
            'head_filter_show_premium': {name: Lampa.Lang.translate('premium'), element: '.open--premium'}, 
            'head_filter_show_profile': {name: Lampa.Lang.translate('profile'), element: '.open--profile'}, 
            'head_filter_show_feed': {name: Lampa.Lang.translate('feed'), element: '.open--feed'}, 
            'head_filter_show_notice': {name: Lampa.Lang.translate('notice'), element: '.notice--icon'},
            'head_filter_show_broadcast': {name: Lampa.Lang.translate('broadcast'), element: '.open--broadcast'},
            'head_filter_show_friends': {name: Lampa.Lang.translate('friends'), element: '.open--friends'},
            'head_filter_show_fullscreen': {name: Lampa.Lang.translate('fullscreen'), element: '.full-screen'}, 
            'head_filter_show_reload': {name: Lampa.Lang.translate('reload'), element: '.m-reload-screen'},
            'head_filter_show_blackfriday': {name: Lampa.Lang.translate('blackfriday'), element: '.black-friday__button'}, 
            'head_filter_show_split': {name: Lampa.Lang.translate('split'), element: '.head__split'}, 
            'head_filter_show_time': {name: Lampa.Lang.translate('time'), element: '.head__time'}, 
        };

        // ==========================================
        // 4. ЛОГІКА ПРИХОВУВАННЯ
        // ==========================================
        var isInitialized = false; // Флаг, щоб не спрацьовувати передчасно

        function applyVisibility() {
            Object.keys(head).forEach(function(key) {
                var show_element = Lampa.Storage.get(key, true);
                var el = document.querySelector(head[key].element);
                if (el) {
                    // Використовуємо visibility або display, залежно від того, що краще для Lampa
                    el.style.display = show_element ? '' : 'none';
                }
            });
        }

        var allSelectors = Object.values(head).map(function(h) { return h.element; }).join(',');

        var observer = new MutationObserver(function(mutations) {
            if (!isInitialized) return; // Ігноруємо зміни, поки не готові

            var shouldUpdate = false;
            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];
                if (m.addedNodes.length > 0) {
                    for (var j = 0; j < m.addedNodes.length; j++) {
                        var node = m.addedNodes[j];
                        if (node.nodeType === 1) {
                            if (node.matches(allSelectors) || (node.querySelector && node.querySelector(allSelectors))) {
                                shouldUpdate = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldUpdate) break;
            }
            if (shouldUpdate) {
                applyVisibility();
            }
        });

        // ==========================================
        // 5. СЛУХАЧ ЗМІНИ НАЛАШТУВАНЬ
        // ==========================================
        Lampa.Storage.listener.follow('change', function(event) {
            if (event.name == 'activity') {
                // Даємо Lampa час перемалювати шапку при переході
                setTimeout(applyVisibility, 100); 
            } else if (event.name in head) {
                applyVisibility();
            }
        });

        // ==========================================
        // 6. ІНТЕРФЕЙС НАЛАШТУВАНЬ (без змін)
        // ==========================================
        Lampa.Template.add('settings_head_filter',`<div></div>`);

        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: { type: 'button' },
            field: {
                name: Lampa.Lang.translate('name_plugin'),
                description: Lampa.Lang.translate('plugin_description')
            },
            onChange: ()=>{
                Lampa.Settings.create('head_filter',{
                    onBack: ()=>{ Lampa.Settings.create('interface') }
                })
            }
        });   

        Lampa.SettingsApi.addParam({
            component: 'head_filter',
            param: { type: 'title' },
            field: { name: Lampa.Lang.translate('name_menu') } 
        });   

        Object.keys(head).forEach(function(key) {
            Lampa.SettingsApi.addParam({
                component: 'head_filter',
                param: { name: key, type: 'trigger', default: true },
                field: { name: head[key].name }        
            });
        });

        // ==========================================
        // 7. ЗАПУСК СПОСТЕРІГАЧА ІЗ ЗАТРИМКОЮ
        // ==========================================
        // Чекаємо 1.5 секунди після старту плагіна, щоб Lampa повністю завантажила шапку
        setTimeout(function() {
            isInitialized = true;
            applyVisibility(); // Застосовуємо налаштування одразу
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }, 1500);
    }

    // ==========================================
    // 8. ІНІЦІАЛІЗАЦІЯ (без змін)
    // ==========================================
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type == 'ready') {
                startPlugin();
            }
        });
    }
})();
