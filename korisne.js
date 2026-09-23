'use strict';

(function () {
    // === ПОЧАТОК: Перевірка наявності Lampa ===
    if (typeof Lampa === 'undefined') {
        console.error('Lampa не знайдена!');
        return;
    }

    // === ПОЧАТОК: Додавання компонента налаштувань ===
    Lampa.SettingsApi.addComponent({
        component: 'Multi_Menu_Component',
        name: 'Tweaks & Tricks',
        icon: ''
    });

    // === ПОЧАТОК: Відключення невикористовуваної розкладки клавіатури ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'KeyboardSwitchOff',
            type: 'select',
            values: {
                SwitchOff_None: 'Не отключать',
                SwitchOff_UA: 'Українська',
                SwitchOff_RU: 'Русский',
                SwitchOff_EN: 'English',
            },
            default: 'SwitchOff_None'
        },
        field: {
            name: 'Неиспользуемая клавиатура',
            description: 'Выберите язык для отключения'
        },
        onChange: function (value) {
            if (Lampa.Storage.field('KeyboardSwitchOff') == 'SwitchOff_UA') {
                Lampa.Storage.set('keyboard_default_lang', 'default');
                var elementUA = $('.selectbox-item.selector > div:contains("Українська")');
                if (elementUA.length > 0) elementUA.parent('div').hide();
            }
            if (Lampa.Storage.field('KeyboardSwitchOff') == 'SwitchOff_RU') {
                Lampa.Storage.set('keyboard_default_lang', 'uk');
                var elementRU = $('.selectbox-item.selector > div:contains("Русский")');
                if (elementRU.length > 0) elementRU.parent('div').hide();
            }
            if ((Lampa.Storage.field('KeyboardSwitchOff') == 'SwitchOff_EN') & (Lampa.Storage.field('language') == 'uk')) {
                Lampa.Storage.set('keyboard_default_lang', 'uk');
                var elementEN = $('.selectbox-item.selector > div:contains("English")');
                if (elementEN.length > 0) elementEN.parent('div').hide();
            }
            if ((Lampa.Storage.field('KeyboardSwitchOff') == 'SwitchOff_EN') & (Lampa.Storage.field('language') == 'ru')) {
                Lampa.Storage.set('keyboard_default_lang', 'default');
                var elementEN = $('.selectbox-item.selector > div:contains("English")');
                if (elementEN.length > 0) elementEN.parent('div').hide();
            }
        }
    });
    // === КІНЕЦЬ: Відключення невикористовуваної розкладки ===

    // === ПОЧАТОК: Торренти ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'TORRENT_fix',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Контрастная рамка на торрентах',
            description: 'Улучшает восприятие при выборе торрента'
        },
        onChange: function (value) {
            var green1 = '<style id="green_style">.torrent-item.focus { border: 2px solid #00ff00 !important; }</style>';
            var green2 = '<style id="greenn_style">.torrent-item.focus .torrent-item__quality { color: #00ff00 !important; }</style>';
            var green3 = '<style id="greennn_style">.torrent-item.focus .torrent-item__info { color: #00ff00 !important; }</style>';
            var green4 = '<style id="greennnn_style">.torrent-item.focus .torrent-item__size { color: #00ff00 !important; }</style>';
            
            if (Lampa.Storage.field('TORRENT_fix') == true) {
                $('body').append(green1);
                $('body').append(green2);
                $('body').append(green3);
                $('body').append(green4);
            }
            if (Lampa.Storage.field('TORRENT_fix') == false) {
                $('#green_style').remove();
                $('#greenn_style').remove();
                $('#greennn_style').remove();
                $('#greennnn_style').remove();
            }
        }
    });
    // === КІНЕЦЬ: Торренти ===

    // === ПОЧАТОК: SpeedTest (відключений сегмент) ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'SpeedTest',
            type: 'static',
        },
        field: {
            name: 'SpeedTest',
            description: 'Замер скорости интернет-соединения для Skaz'
        },
        onRender: function (item) {
            item.on('hover:enter', function () {
                Lampa.Iframe.show({
                    url: 'http://62.84.100.7/speed.php',
                    onBack: function onBack() {
                        Lampa.Controller.toggle('settings_component');
                    }
                });
            });
        }
    });
    // === КІНЕЦЬ: SpeedTest (відключений сегмент) ===

    // === ПОЧАТОК: OpenSpeedTest ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'OpenSpeedTestParam',
            type: 'static',
        },
        field: {
            name: 'OpenSpeedTest',
            description: 'Замер скорости интернет-соединения'
        },
        onRender: function (item) {
            item.on('hover:enter', function () {
                var modal = $('<div id="openspeedtest-container" style="width:100%;height:100%;"><iframe src="https://openspeedtest.com/speedtest" style="width:100%;height:100%;border:none;"></iframe></div>');
                Lampa.Modal.open({
                    title: '',
                    html: modal,
                    size: 'medium',
                    mask: true,
                    onBack: function onBack() {
                        Lampa.Modal.close();
                        Lampa.Controller.toggle('settings_component');
                    },
                    onSelect: function () {}
                });
            });
        }
    });
    // === КІНЕЦЬ: OpenSpeedTest ===

    // === ПОЧАТОК: Anime ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'ANIME_fix',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Удалить "Аниме" в главном меню',
            description: ''
        },
        onChange: function (value) {
            if (Lampa.Storage.field('ANIME_fix') == true) $("[data-action=anime]").eq(0).hide();
            if (Lampa.Storage.field('ANIME_fix') == false) $("[data-action=anime]").eq(0).show();
        }
    });
    // === КІНЕЦЬ: Anime ===

    // === ПОЧАТОК: SISI ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'SISI_fix',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Удалить "Клубника" в главном меню',
            description: ''
        },
        onChange: function (value) {
            if (Lampa.Storage.field('SISI_fix') == false) {
                $('#app > div.wrap.layer--height.layer--width > div.wrap__left.layer--height > div > div > div > div > div:nth-child(1) > ul > li:contains("Клубничка")').show();
            }
            if (Lampa.Storage.field('SISI_fix') == true) {
                $('#app > div.wrap.layer--height.layer--width > div.wrap__left.layer--height > div > div > div > div > div:nth-child(1) > ul > li:contains("Клубничка")').hide();
            }
        }
    });
    // === КІНЕЦЬ: SISI ===

    // === ПОЧАТОК: СТИЛІЗАЦІЯ кнопок перегляду ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'BUTTONS_fix',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Стилизовать кнопки просмотра',
            description: 'Делает кнопки цветными'
        },
        onChange: function (value) {
            if (Lampa.Storage.field('BUTTONS_fix') == true) {
                updateT();
            }
            Lampa.Settings.update();
        },
        onRender: function (item) {
            if (Lampa.Storage.field('BUTTONS_fix') == true) {
                updateT();
            }
        }
    });
    // === КІНЕЦЬ: СТИЛІЗАЦІЯ кнопок ===

    if (Lampa.Storage.field('ANIME_fix') == true) $("[data-action=anime]").eq(0).hide();
    if (Lampa.Storage.field('SISI_fix') == true) $("[data-action=sisi]").eq(0).show();

    // === ПОЧАТОК: Кнопка Перезагрузки і Консолі ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'Reloadbutton',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Добавить кнопку перезагрузки',
            description: 'Иконка рядом с часами'
        },
        onChange: function (value) {
            if (Lampa.Storage.field('Reloadbutton') == false) {
                $('#RELOAD').addClass('hide');
                $('#CONSOLE').addClass('hide');
                $('#ExitButton').addClass('hide');
            }
            if (Lampa.Storage.field('Reloadbutton') == true) {
                $('#RELOAD').removeClass('hide');
                $('#CONSOLE').removeClass('hide');
                $('#ExitButton').removeClass('hide');
            }
        }
    });

    // Кнопка Перезагрузки
    var my_reload = '<div id="RELOAD" class="head__action"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/></svg></div>';
    $('#app > div.head > div > div.head__actions').append(my_reload);
    $('#RELOAD').on('hover:enter hover:click hover:touch', function () {
        location.reload();
    });

    // Кнопка Консолі
    var my_console = '<div id="CONSOLE" class="head__action"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" fill="currentColor"/></svg></div>';
    $('#app > div.head > div > div.head__actions').append(my_console);
    $('#CONSOLE').on('hover:enter hover:click hover:touch', function () {
        Lampa.Controller.toggle('console');
    });

    // Кнопка Вихода в верхньому барі
    var my_top_exit = '<div id="my_top_exit" class="head__action"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/></svg></div>';
    $('#app > div.head > div > div.head__actions').append(my_top_exit);
    $('#my_top_exit').on('hover:enter hover:click hover:touch', function () {
        Lampa.Activity.out();
        if (Lampa.Platform.is('tizen')) tizen.application.getCurrentApplication().exit();
        if (Lampa.Platform.is('webos')) window.close();
        if (Lampa.Platform.is('android')) Lampa.Android.exit();
        if (Lampa.Platform.is('orsay')) Lampa.Orsay.exit();
    });

    if (Lampa.Storage.field('Reloadbutton') == false) {
        $('#RELOAD').addClass('hide');
        $('#CONSOLE').addClass('hide');
        $('#my_top_exit').addClass('hide');
    }
    if (Lampa.Storage.field('Reloadbutton') == true) {
        $('#RELOAD').removeClass('hide');
        $('#CONSOLE').removeClass('hide');
        $('#my_top_exit').removeClass('hide');
    }
    // === КІНЕЦЬ: Кнопка Перезагрузки і Консолі ===

    // === ПОЧАТОК: Стиль в плеєрі - YouTube ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'YouTubeStyle',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Стилизация встроенного плеера',
            description: 'В стиле YouTube'
        },
        onChange: function (value) {
            if (Lampa.Storage.field('YouTubeStyle') == false) {
                $('#YOUTUBESTYLE').remove();
                $('#YOUTUBESTYLE-POSITION').remove();
                $('#YOUTUBESTYLE-POSITION-focus').remove();
            }
            if (Lampa.Storage.field('YouTubeStyle') == true) {
                $('body').append(Lampa.Template.get('YOUTUBESTYLE', {}, true));
                $('body').append(Lampa.Template.get('YOUTUBESTYLE-POSITION', {}, true));
                $('body').append(Lampa.Template.get('YOUTUBESTYLE-POSITION-focus', {}, true));
            }
        },
        onRender: function (item) {
            Lampa.Template.add('YOUTUBESTYLE', '<style id="YOUTUBESTYLE">.player-panel { background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%) !important; }</style>');
            Lampa.Template.add('YOUTUBESTYLE-POSITION', '<style id="YOUTUBESTYLE-POSITION">.player-panel__time { color: #fff !important; }</style>');
            Lampa.Template.add('YOUTUBESTYLE-POSITION-focus', '<style id="YOUTUBESTYLE-POSITION-focus">.player-panel__button.focus { background: rgba(255,255,255,0.2) !important; border-radius: 50% !important; }</style>');
        }
    });
    // === КІНЕЦЬ: Стиль в плеєрі - YouTube ===

    // === ПОЧАТОК: Часы в плеере - МЕНЮ ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'ClockInPlayer',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Часы во встроенном плеере',
            description: 'Через 5 секунд после включения плеера'
        },
        onChange: function (value) {
            // Дії при зміні
        }
    });

    Lampa.Template.add('CLOCKSTYLE', '<style id="clockstyle">#MyClockDiv { position: absolute; z-index: 9999; color: #fff; font-size: 1.5em; text-shadow: 1px 1px 2px #000; bottom: 90%!important; right: 90%!important; }</style>');
    $('body').append(Lampa.Template.get('CLOCKSTYLE', {}, true));

    if (Lampa.Storage.field('ClockInPlayerPosition') == 'Center_Up') {
        $('#clockstyle').remove();
        Lampa.Template.add('CLOCKSTYLE', '<style id="clockstyle">#MyClockDiv { position: absolute; z-index: 9999; color: #fff; font-size: 1.5em; text-shadow: 1px 1px 2px #000; bottom: 90%!important; left: 50%!important; transform: translateX(-50%) !important; }</style>');
        $('body').append(Lampa.Template.get('CLOCKSTYLE', {}, true));
    }

    // Функція оновлення годинника
    function updateClock() {
        var MyTime = document.querySelector("[class='head__time-now time--clock']");
        if (!MyTime) return;
        
        var timeText = MyTime.innerHTML;
        $("#MyClockDiv").remove();
        $("#MyLogoDiv").remove();

        var MyDiv = '<div id="MyClockDiv" class="">' + timeText + '</div>';
        $('.player').append(MyDiv);

        if (Lampa.Storage.field('ClockInPlayer') == true) {
            if (($('body > div.player > div.player-panel').hasClass("panel--visible") == false) ||
                ($('body > div.player > div.player-info').hasClass("info--visible") == false)) {
                $('#MyClockDiv').removeClass('hide');
            }
        }
    }

    Lampa.Template.add('clockcenter', '<style id="clockcenter"></style>');
    $('body').append(Lampa.Template.get('clockcenter', {}, true));
    setInterval(updateClock, 200);
    // === КІНЕЦЬ: Часы в плеере ===

    // === ПОЧАТОК: Положення годинника в плеєрі ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'ClockInPlayerPosition',
            type: 'select',
            values: {
                Left_Up: 'Слева сверху ',
                Left_Down: 'Слева снизу',
                Right_Up: 'Справа сверху',
                Right_Down: 'Справа снизу',
                Center_Up: 'В центре сверху',
            },
            default: 'Left_Up'
        },
        field: {
            name: 'Положение часов на экране',
            description: 'Выберите угол экрана'
        },
        onChange: function (value) {
            document.querySelector("#clockstyle").remove();
            if (Lampa.Storage.field('ClockInPlayerPosition') == 'Left_Up')
                Lampa.Storage.set('Clock_coordinates', 'bottom: 90%!important; right: 90%!important');
            if (Lampa.Storage.field('ClockInPlayerPosition') == 'Left_Down')
                Lampa.Storage.set('Clock_coordinates', 'bottom: 10%!important; right: 90%!important');
            if (Lampa.Storage.field('ClockInPlayerPosition') == 'Right_Up')
                Lampa.Storage.set('Clock_coordinates', 'bottom: 90%!important; right: 12%!important');
            if (Lampa.Storage.field('ClockInPlayerPosition') == 'Right_Down')
                Lampa.Storage.set('Clock_coordinates', 'bottom: 10%!important; right: 5%!important');

            Lampa.Template.add('CLOCKSTYLE', '<style id="clockstyle">#MyClockDiv { position: absolute; z-index: 9999; color: #fff; font-size: 1.5em; text-shadow: 1px 1px 2px #000; ' + (Lampa.Storage.field('Clock_coordinates') || '') + ' }</style>');
            $('body').append(Lampa.Template.get('CLOCKSTYLE', {}, true));

            if (Lampa.Storage.field('ClockInPlayerPosition') == 'Center_Up') {
                $('#clockstyle').remove();
                Lampa.Template.add('CLOCKSTYLE', '<style id="clockstyle">#MyClockDiv { position: absolute; z-index: 9999; color: #fff; font-size: 1.5em; text-shadow: 1px 1px 2px #000; bottom: 90%!important; left: 50%!important; transform: translateX(-50%) !important; }</style>');
                $('body').append(Lampa.Template.get('CLOCKSTYLE', {}, true));
            }
        }
    });
    // === КІНЕЦЬ: Положення годинника в плеєрі ===

    // === ПОЧАТОК: Кнопка YouTube ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'YouTube',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Раздел YouTube',
            description: 'Добавляет YouTube в главном меню'
        },
        onChange: function (value) {
            if (Lampa.Storage.field('YouTube') == false) {
                $('#YouTubeButton').addClass('hide');
            }
            if (Lampa.Storage.field('YouTube') == true) {
                $('#YouTubeButton').removeClass('hide');
            }
        }
    });
    // === КІНЕЦЬ: Кнопка YouTube ===

    // === ПОЧАТОК: Кнопка RuTube ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'RuTube',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Раздел RuTube',
            description: 'Добавляет RuTube в главном меню'
        },
        onChange: function (value) {
            if (Lampa.Storage.field('RuTube') == false) {
                $('#RuTubeButton').addClass('hide');
            }
            if (Lampa.Storage.field('RuTube') == true) {
                $('#RuTubeButton').removeClass('hide');
            }
        }
    });
    // === КІНЕЦЬ: Кнопка RuTube ===

    // === ПОЧАТОК: Кнопка Twitch ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'Twitch',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Раздел Twitch',
            description: 'Добавляет Twitch в главном меню'
        },
        onChange: function (value) {
            if (Lampa.Storage.field('Twitch') == false) {
                $('#TwitchButton').addClass('hide');
            }
            if (Lampa.Storage.field('Twitch') == true) {
                $('#TwitchButton').removeClass('hide');
            }
        }
    });
    // === КІНЕЦЬ: Кнопка Twitch ===

    // === ПОЧАТОК: ТоррСервер ===
    Lampa.SettingsApi.addParam({
        component: 'Multi_Menu_Component',
        param: {
            name: 'Tricks_TorrServer',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Использовать "народный" TorrServer',
            description: 'Работает после запроса доступа у @AndreyURL54'
        },
        onChange: function (value) {
            var tricks_usermail = Lampa.Storage.field('account_email').toLowerCase();
            Lampa.Storage.set('torrserver_use_link', (value == '0') ? 'one' : 'two');
            Lampa.Storage.set('torrserver_auth', true);
            Lampa.Storage.set('torrserver_login', tricks_usermail);
            Lampa.Storage.set('torrserver_password', tricks_usermail);
            if (Lampa.Storage.field('Tricks_TorrServer') == true)
                Lampa.Storage.set('torrserver_url_two', '95.215.8.180:9098');
            if (Lampa.Storage.field('Tricks_TorrServer') == false) {
                Lampa.Storage.set('torrserver_url_two', '');
                Lampa.Storage.set('torrserver_login', '');
                Lampa.Storage.set('torrserver_password', '');
            }
        }
    });
    // === КІНЕЦЬ: ТоррСервер ===

    // === ПОЧАТОК: METRIKA ===
    (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
        m[i].l = 1 * new Date();
        for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
        k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    ym(92135047, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true });

    var METRIKA = '<noscript><div><img src="https://mc.yandex.ru/watch/92135047" style="position:absolute; left:-9999px;" alt="" /></div></noscript>';
    $('body').append(METRIKA);
    // === КІНЕЦЬ: METRIKA ===

    // === ПОЧАТОК: ШАБЛОНИ ===

    // Скрываем баннер Трейлеров на Главной
    if (Lampa.Storage.field('NoTrailerMainPage') == true) {
        var intervalID;
        setTimeout(function () {
            intervalID = setInterval(function () {
                /* Мы на Главной? */
                if (Lampa.Activity.active().component == 'main' && Lampa.Activity.active().source == 'cub') {
                    $('#NoTrailerMainPage').remove();
                    var banner = 'div.activity__body > div > div > div > div > div:nth-child(1)';
                    Lampa.Template.add('NoTrailerMainPage', '<style id="NoTrailerMainPage">' + banner + ' { display: none !important; }</style>');
                    $('body').append(Lampa.Template.get('NoTrailerMainPage', {}, true));
                }
                /* Вышли из Главной */
                if (Lampa.Activity.active().component !== 'main') {
                    $('#NoTrailerMainPage').remove();
                }
                /* Мы в разделе Фильмы? */
                if (Lampa.Activity.active().component == 'category' && Lampa.Activity.active().url == 'movie' && Lampa.Activity.active().source == 'cub') {
                    $('#NoTrailerMainPage').remove();
                    var banner = 'div.activity__body > div > div > div > div > div:nth-child(2)';
                    Lampa.Template.add('NoTrailerMainPage', '<style id="NoTrailerMainPage">' + banner + ' { display: none !important; }</style>');
                    $('body').append(Lampa.Template.get('NoTrailerMainPage', {}, true));
                }
                if (Lampa.Storage.field('NoTrailerMainPage') == false) {
                    clearInterval(intervalID);
                }
            }, 500);
        }, 1000);
    }

    // Скрываем часы на заставке CUB и Chromecast
    if (Lampa.Storage.field('NoTimeNoDate') == true) {
        /* CUB */
        Lampa.Template.add('notimedatescreen', '<style id="notimedatescreen">.screensaver .time, .screensaver .date { display: none !important; }</style>');
        $('body').append(Lampa.Template.get('notimedatescreen', {}, true));

        /* Chromecast */
        var notimedatescreenInterval = setInterval(function () {
            var elementScreenSaver = $('.screensaver-chrome');
            if (elementScreenSaver.length > 0) {
                // Логіка для Chromecast
            }
        }, 1000);
    }

    // Стиль скрытия панели навигации при старте
    if (Lampa.Storage.field('NavyBar') == true) {
        $('.menu__item').on('click', function () {
            this.removeClass('focus');
            this.addClass('focus');
        });

        Lampa.Template.add('no_bar', '<style id="no_bar">.head__actions .open--search { display: none !important; }</style>');
        $('body').append(Lampa.Template.get('no_bar', {}, true));

        var searchReturnButton = '<div id="searchReturnButton" class="head__action"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/></svg></div>';
        $('#app > div.head > div > div.head__actions').append(searchReturnButton);
        $('#searchReturnButton').on('hover:enter hover:click hover:touch', function () {
            Lampa.Search.open();
        });
    }

    // Стиль в плеере - YouTube при старте
    if (Lampa.Storage.field('YouTubeStyle') == true) {
        Lampa.Template.add('YOUTUBESTYLE', '<style id="YOUTUBESTYLE">.player-panel { background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%) !important; }</style>');
        Lampa.Template.add('YOUTUBESTYLE-POSITION', '<style id="YOUTUBESTYLE-POSITION">.player-panel__time { color: #fff !important; }</style>');
        Lampa.Template.add('YOUTUBESTYLE-POSITION-focus', '<style id="YOUTUBESTYLE-POSITION-focus">.player-panel__button.focus { background: rgba(255,255,255,0.2) !important; border-radius: 50% !important; }</style>');
        $('body').append(Lampa.Template.get('YOUTUBESTYLE', {}, true));
        $('body').append(Lampa.Template.get('YOUTUBESTYLE-POSITION', {}, true));
        $('body').append(Lampa.Template.get('YOUTUBESTYLE-POSITION-focus', {}, true));
    }

    // Кнопка YouTube
    var TubeSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" fill="currentColor"/></svg>';

    // (Тут, ймовірно, був код для додавання кнопки YouTube в меню)
    // ...

})();
