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
        bookmarks: { ru: 'Закладки', en: 'Bookmarks', uk: 'Закладки', zh: '书签' },
        fullscreen: { ru: 'Полноэкранный режим', en: 'Fullscreen mode', uk: 'Повноекранний режим', zh: '全屏模式' },
        reload: { ru: 'Обновление страницы', en: 'Page reload', uk: 'Оновлення сторінки', zh: '页面重新加载' },
        blackfriday: { ru: 'Черная пятница', en: 'Black Friday', uk: 'Чорна п’ятниця', zh: '黑色星期五' },
        split: { ru: 'Разделитель', en: 'Divider', uk: 'Розділювач', zh: '分隔符' },
        time: { ru: 'Время', en: 'Time', uk: 'Годинник', zh: '时间' },
        name_menu: { ru: 'Отображать в шапке', en: 'Display in header', uk: 'Відображати у шапці', zh: '在标题中显示' },
        name_plugin: { ru: 'Настройка шапки', en: 'Header Settings', uk: 'Налаштування шапки', zh: '头部设置' },
        plugin_description: { ru: 'Плагин для настройки шапки (v2)', en: 'Header settings plugin (v2)', uk: 'Плагін для налаштування шапки (v2)', zh: '头部设置插件 (v2)' }
    });

    // ==========================================
    // 2. ОНОВЛЕННЯ МЕТАДАНИХ (як у Frames)
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
        var name = Lampa.Lang.translate('name_plugin');
        var descr = Lampa.Lang.translate('plugin_description');
        
        // Якщо переклад не знайдено, використовуємо fallback
        if (!name || name === 'name_plugin') {
            name = (lang === 'en') ? 'Header Settings'
                 : (lang === 'ru') ? 'Настройка шапки'
                 : 'Налаштування шапки';
        }
        if (!descr || descr === 'plugin_description') {
            descr = (lang === 'en') ? 'Plugin for customizing the header'
                  : (lang === 'ru') ? 'Плагин для настройки шапки'
                  : 'Плагін для налаштування шапки';
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
                if (plugin.component === 'head_filter_v2' || /\/head_filter_v2(?:\.v\d+)?\.js(?:[?#].*)?$/i.test(url)) {
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

    function startPlugin() {
        // ==========================================
        // 3. МАНІФЕСТ
        // ==========================================
        var manifest = {
            type: 'other',
            version: '1.1.2',
            name: Lampa.Lang.translate('name_plugin'),
            description: Lampa.Lang.translate('plugin_description'),
            author: '@elixcat 🌚',
            component: 'head_filter_v2',
        };
        Lampa.Manifest.plugins = manifest;

        // ==========================================
        // 4. СПИСОК ЕЛЕМЕНТІВ
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
            'v2_show_bookmarks': {name: Lampa.Lang.translate('bookmarks'), element: '.open--bookmarks'},
            'v2_show_fullscreen': {name: Lampa.Lang.translate('fullscreen'), element: '.full-screen'}, 
            'v2_show_reload': {name: Lampa.Lang.translate('reload'), element: '.m-reload-screen'},
            'v2_show_blackfriday': {name: Lampa.Lang.translate('blackfriday'), element: '.black-friday__button'}, 
            'v2_show_split': {name: Lampa.Lang.translate('split'), element: '.head__split'}, 
            'v2_show_time': {name: Lampa.Lang.translate('time'), element: '.head__time'}, 
        };

        // ==========================================
        // 5. ЛОГІКА (З ВИКОРИСТАННЯМ JQUERY)
        // ==========================================
        function applyVisibility() {
            Object.keys(head).forEach(function(key) {
                var show_element = Lampa.Storage.get(key, true); 
                if (show_element) {
                    $(head[key].element).show();
                } else {
                    $(head[key].element).hide();
                }
            });
        }

        // ==========================================
        // 6. СТВОРЕННЯ КНОПКИ "ЗАКЛАДКИ" (З ЕМОДЗІ)
        // ==========================================
        function addBookmarksButton() {
            // Перевіряємо, чи вже створена кнопка
            if ($('.open--bookmarks').length) return;

            // Створюємо кнопку з емодзі замість SVG
            var btn = $('<div class="head__action selector open--bookmarks" style="font-size: 1.2em; display: flex; align-items: center; justify-content: center;">⭐</div>');

            // Додаємо обробник кліку для переходу до закладок
            btn.on('click', function() {
                Lampa.Activity.push({
                    url: 'bookmarks',
                    title: Lampa.Lang.translate('bookmarks'),
                    component: 'bookmarks',
                    page: 1
                });
            });

            // Вставляємо кнопку відразу ПІСЛЯ кнопки пошуку
            var $search = $('.head__action.open--search');
            if ($search.length) {
                $search.after(btn);
            } else {
                $('.head__actions').prepend(btn);
            }
        }

        // ==========================================
        // 7. СЛУХАЧІ ПОДІЙ
        // ==========================================
        
        Lampa.Storage.listener.follow('change', function(event) {
            if (event.name in head) {
                applyVisibility();
            }
        });

        Lampa.Storage.listener.follow('change', function(event) {
            if (event.name == 'activity') {
                setTimeout(function() {
                    addBookmarksButton();
                    applyVisibility();
                }, 100);
                setTimeout(function() {
                    addBookmarksButton();
                    applyVisibility();
                }, 500);
            }
        });

        // ==========================================
        // 8. ІНТЕРФЕЙС НАЛАШТУВАНЬ
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
                Lampa.Settings.create('head_filter_v2',{
                    onBack: ()=>{ Lampa.Settings.create('interface') }
                })
            }
        });   

        Lampa.SettingsApi.addParam({
            component: 'head_filter_v2',
            param: { type: 'title' },
            field: { name: Lampa.Lang.translate('name_menu') } 
        });   

        Object.keys(head).forEach(function(key) {
            Lampa.SettingsApi.addParam({
                component: 'head_filter_v2',
                param: { 
                    name: key, 
                    type: 'trigger', 
                    default: true 
                },
                field: { name: head[key].name }        
            });
        });

        // ==========================================
        // 9. СТАРТ
        // ==========================================
        setTimeout(function() {
            addBookmarksButton();
            applyVisibility();
        }, 500);

        // Оновлення метаданих
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

    // ==========================================
    // 10. ІНІЦІАЛІЗАЦІЯ
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
