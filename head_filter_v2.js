(function() {
    'use strict';

    // ==========================================
    // 1. БАГАТОМОВНІСТЬ
    // ==========================================
    Lampa.Lang.add({
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
        plugin_description: { ru: 'Плагин для настройки шапки (v2)', en: 'Header settings plugin (v2)', uk: 'Плагін для налаштування шапки (v2)', zh: '头部设置插件 (v2)' }
    });

    function startPlugin() {
        // ==========================================
        // 2. МАНІФЕСТ (ЗМІНЕНО КОМПОНЕНТ)
        // ==========================================
        var manifest = {
            type: 'other',
            version: '1.0.0',
            name: Lampa.Lang.translate('name_plugin'),
            description: Lampa.Lang.translate('plugin_description'),
            author: '@elixcat 🌚',
            component: 'head_filter_v2', // <--- НОВА НАЗВА, щоб уникнути конфліктів
        };
        Lampa.Manifest.plugins = manifest;

        // ==========================================
        // 3. СПИСОК ЕЛЕМЕНТІВ
        // ==========================================
        var head = {
            'v2_show_search': {name: Lampa.Lang.translate('search'), element: '.open--search'},
            'v2_show_settings': {name: Lampa.Lang.translate('settings'), element: '.open--settings'}, 
            'v2_show_premium': {name: Lampa.Lang.translate('premium'), element: '.open--premium'}, 
            'v2_show_profile': {name: Lampa.Lang.translate('profile'), element: '.open--profile'}, 
            'v2_show_feed': {name: Lampa.Lang.translate('feed'), element: '.open--feed'}, 
            'v2_show_notice': {name: Lampa.Lang.translate('notice'), element: '.notice--icon'},
            'v2_show_broadcast': {name: Lampa.Lang.translate('broadcast'), element: '.open--broadcast'},
            'v2_show_friends': {name: Lampa.Lang.translate('friends'), element: '.open--friends'},
            'v2_show_fullscreen': {name: Lampa.Lang.translate('fullscreen'), element: '.full-screen'}, 
            'v2_show_reload': {name: Lampa.Lang.translate('reload'), element: '.m-reload-screen'},
            'v2_show_blackfriday': {name: Lampa.Lang.translate('blackfriday'), element: '.black-friday__button'}, 
            'v2_show_split': {name: Lampa.Lang.translate('split'), element: '.head__split'}, 
            'v2_show_time': {name: Lampa.Lang.translate('time'), element: '.head__time'}, 
        };

        // ==========================================
        // 4. ЛОГІКА (З ВИКОРИСТАННЯМ JQUERY)
        // ==========================================
        function applyVisibility() {
            Object.keys(head).forEach(function(key) {
                var show_element = Lampa.Storage.get(key, true); 
                // Повертаємось до jQuery, як в оригіналі
                if (show_element) {
                    $(head[key].element).show();
                } else {
                    $(head[key].element).hide();
                }
            });
        }

        // ==========================================
        // 5. СЛУХАЧІ ПОДІЙ
        // ==========================================
        
        // Слухаємо зміну налаштувань (перемикачі в меню)
        Lampa.Storage.listener.follow('change', function(event) {
            if (event.name in head) {
                applyVisibility();
            }
        });

        // Слухаємо зміну активності (перехід між сторінками)
        Lampa.Storage.listener.follow('change', function(event) {
            if (event.name == 'activity') {
                // Робимо кілька спроб з різною затримкою, щоб наздогнати перемальовку
                setTimeout(applyVisibility, 50);
                setTimeout(applyVisibility, 300);
                setTimeout(applyVisibility, 800); 
            }
        });

        // ==========================================
        // 6. ІНТЕРФЕЙС НАЛАШТУВАНЬ
        // ==========================================
        Lampa.Template.add('settings_head_filter_v2',`<div></div>`);

        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: { type: 'button' },
            field: {
                name: Lampa.Lang.translate('name_plugin'),
                description: Lampa.Lang.translate('plugin_description')
            },
            onChange: ()=>{
                Lampa.Settings.create('head_filter_v2',{ // Вказуємо новий компонент
                    onBack: ()=>{ Lampa.Settings.create('interface') }
                })
            }
        });   

        Lampa.SettingsApi.addParam({
            component: 'head_filter_v2', // Новий компонент
            param: { type: 'title' },
            field: { name: Lampa.Lang.translate('name_menu') } 
        });   

        Object.keys(head).forEach(function(key) {
            Lampa.SettingsApi.addParam({
                component: 'head_filter_v2', // Новий компонент
                param: { 
                    name: key, 
                    type: 'trigger', 
                    default: true 
                },
                field: { name: head[key].name }        
            });
        });

        // ==========================================
        // 7. СТАРТ
        // ==========================================
        // Застосовуємо налаштування при старті з невеликою затримкою
        setTimeout(applyVisibility, 500);
    }

    // ==========================================
    // 8. ІНІЦІАЛІЗАЦІЯ
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
