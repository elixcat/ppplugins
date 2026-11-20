(function () {
    'use strict';

    if (window.FullDescExpanderLoaded) return;
    window.FullDescExpanderLoaded = true;

    // ============================================================
    // МАНІФЕСТ ПЛАГІНА
    // ============================================================
    var manifest = {
        type: 'video',
        version: '1.3.0',
        name: 'Full Desc Expander',
        description: 'Розширює вікно опису фільму, якщо текст довгий',
        author: '@elixcat',
        component: 'full_desc_expander'
    };

    // ============================================================
    // ЛОКАЛІЗАЦІЯ (укр, рос, біл, каз)
    // ============================================================
    var LANG = {
        name: {
            uk: 'Повний опис',
            ru: 'Полное описание',
            be: 'Поўнае апісанне',
            kk: 'Толық сипаттама',
            en: 'Full Description'
        },
        descr: {
            uk: 'Розширює вікно опису фільму, якщо текст довгий і обрізається',
            ru: 'Расширяет окно описания фильма, если текст длинный и обрезается',
            be: 'Пашырае акно апісання фільма, калі тэкст доўгі і абрэзаецца',
            kk: 'Мәтін ұзын болса және қиылып кетсе, фильм сипаттамасының терезесін кеңейтеді',
            en: 'Expands the movie description window when the text is long and truncated'
        },
        scaleName: {
            uk: 'Масштаб опису',
            ru: 'Масштаб описания',
            be: 'Маштаб апісання',
            kk: 'Сипаттама масштабы',
            en: 'Description Scale'
        },
        scaleDescr: {
            uk: 'Розмір тексту опису фільму',
            ru: 'Размер текста описания фильма',
            be: 'Памер тэксту апісання фільма',
            kk: 'Фильм сипаттамасы мәтінінің өлшемі',
            en: 'Movie description text size'
        }
    };

    var DEFAULT_SCALE = '1.4'; // 140%

    function getLang() {
        try {
            if (window.Lampa && Lampa.Storage) {
                var l = Lampa.Storage.get('language', 'uk');
                if (l && LANG.name[l]) return l;
                if (l === 'be' || l === 'by') return 'be';
                if (l === 'kk' || l === 'kz') return 'kk';
            }
        } catch (e) {}
        return 'uk';
    }

    function t(key) {
        var lang = getLang();
        return (LANG[key] && (LANG[key][lang] || LANG[key].uk)) || '';
    }

    // ============================================================
    // ОНОВЛЕННЯ МЕТАДАНИХ ПЛАГІНА В СПИСКУ
    // ============================================================
    function updatePluginMeta() {
        if (!window.Lampa || !Lampa.Plugins || !Lampa.Plugins.get) return;

        try {
            var plugins = Lampa.Plugins.get();
            var name = t('name');
            var descr = t('descr');
            var changed = false;

            for (var i = 0; i < plugins.length; i++) {
                var plugin = plugins[i];
                var url = String(plugin && plugin.url || '');

                if (/\/full-desc(?:\.v\d+)?\.js(?:[?#].*)?$/i.test(url)) {
                    if (plugin.name !== name) {
                        plugin.name = name;
                        changed = true;
                    }
                    if (plugin.descr !== descr) {
                        plugin.descr = descr;
                        changed = true;
                    }
                    if (plugin.author !== '@elixcat') {
                        plugin.author = '@elixcat';
                        changed = true;
                    }
                }
            }

            if (changed && Lampa.Plugins.save) Lampa.Plugins.save();
        } catch (e) {}
    }

    // ============================================================
    // ГРАДАЦІЇ МАСШТАБУ 70%–200% (крок 10%)
    // ============================================================
    function getScaleValues() {
        var vals = {};
        for (var i = 7; i <= 20; i++) {
            var val = (i / 10).toString(); // "0.7" ... "2"
            vals[val] = (i * 10) + "%";    // "70%" ... "200%"
        }
        return vals;
    }

    // ============================================================
    // CSS ДЛЯ РОЗШИРЕННЯ ОПИСУ
    // ============================================================
    function injectCSS() {
        if (document.getElementById('fde-style')) return;

        var style = document.createElement('style');
        style.id = 'fde-style';
        style.innerHTML = `
            .full-descr__text,
            .full-start__desc,
            .full-start-new__desc,
            .full-start__text,
            .info__desc {
                max-height: none !important;
                overflow: visible !important;
                display: block !important;
                -webkit-line-clamp: unset !important;
                line-clamp: unset !important;
            }

            .full-descr,
            .full-start__description,
            .full-start-new__description {
                max-height: none !important;
                overflow: visible !important;
            }

            .full-descr__more,
            .full-start__more,
            [class*="descr"][class*="more"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================================
    // ЗАСТОСУВАННЯ МАСШТАБУ ДО ОПИСУ
    // ============================================================
    function applyScale(html) {
        var scale = 1.4;
        try {
            scale = parseFloat(Lampa.Storage.get('full_desc_scale', DEFAULT_SCALE)) || 1.4;
        } catch (e) {}

        var $html = $(html);

        var $descriptions = $html.find(
            '.full-descr__text, .full-start__desc, .full-start-new__desc, .full-start__text, .info__desc'
        );

        $descriptions.each(function () {
            $(this).css('font-size', (scale * 100) + '%');
        });
    }

    // ============================================================
    // ОБРОБКА ВІКНА ФІЛЬМУ
    // ============================================================
    function expandDescription(html) {
        if (!html) return;

        var $html = $(html);

        var $descriptions = $html.find(
            '.full-descr__text, .full-start__desc, .full-start-new__desc, .full-start__text, .info__desc'
        );

        $descriptions.each(function () {
            var $el = $(this);
            var el = $el[0];
            if (!el) return;

            $el.css({
                'max-height': 'none',
                'overflow': 'visible',
                'display': 'block',
                '-webkit-line-clamp': 'unset',
                'line-clamp': 'unset'
            });

            var $parent = $el.parent();
            if ($parent.length) {
                $parent.css({
                    'max-height': 'none',
                    'overflow': 'visible'
                });
            }
        });

        $html.find('[style*="line-clamp"], [style*="max-height"]').each(function () {
            var $el = $(this);
            if ($el.hasClass('full-descr__text') ||
                $el.hasClass('full-start__desc') ||
                $el.hasClass('full-start-new__desc') ||
                $el.hasClass('full-start__text') ||
                $el.hasClass('info__desc')) {
                $el.css({
                    'max-height': 'none',
                    'overflow': 'visible',
                    '-webkit-line-clamp': 'unset',
                    'line-clamp': 'unset'
                });
            }
        });

        // Застосовуємо масштаб
        applyScale($html);
    }

    // ============================================================
    // НАЛАШТУВАННЯ В КОМПОНЕНТІ "ІНТЕРФЕЙС"
    // ============================================================
    function addSettings() {
        if (!window.Lampa || !Lampa.SettingsApi) return;
        if (window.fde_settings_added) return;
        window.fde_settings_added = true;

        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'full_desc_scale',
                type: 'select',
                values: getScaleValues(),
                default: DEFAULT_SCALE
            },
            field: {
                name: t('scaleName'),
                description: t('scaleDescr')
            },
            onChange: function () {
                // Одразу застосовуємо новий масштаб до відкритого вікна фільму
                var $active = $('.activity--active');
                if ($active.length) {
                    applyScale($active);
                }
            }
        });
    }

    // ============================================================
    // ІНІЦІАЛІЗАЦІЯ
    // ============================================================
    function init() {
        if (window.Lampa && Lampa.Manifest) {
            Lampa.Manifest.plugins = manifest;
        }

        updatePluginMeta();
        injectCSS();
        addSettings();

        setTimeout(updatePluginMeta, 1000);
        setTimeout(updatePluginMeta, 3000);

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'build') {
                var html = e.html;

                expandDescription(html);

                setTimeout(function () {
                    expandDescription(html);
                    var $active = $('.activity--active');
                    if ($active.length) {
                        expandDescription($active);
                    }
                }, 300);

                setTimeout(function () {
                    expandDescription(html);
                    var $active = $('.activity--active');
                    if ($active.length) {
                        expandDescription($active);
                    }
                }, 800);
            }
        });

        var observer = new MutationObserver(function (mutations) {
            var shouldExpand = false;

            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];

                if (m.addedNodes && m.addedNodes.length > 0) {
                    for (var j = 0; j < m.addedNodes.length; j++) {
                        var node = m.addedNodes[j];
                        if (node.nodeType === 1) {
                            if (node.classList && (
                                node.classList.contains('full-descr__text') ||
                                node.classList.contains('full-start__desc') ||
                                node.classList.contains('full-start-new__desc') ||
                                node.classList.contains('full-start__text') ||
                                node.classList.contains('info__desc')
                            )) {
                                shouldExpand = true;
                                break;
                            }
                            if (node.querySelector && node.querySelector(
                                '.full-descr__text, .full-start__desc, .full-start-new__desc, .full-start__text, .info__desc'
                            )) {
                                shouldExpand = true;
                                break;
                            }
                        }
                    }
                }

                if (shouldExpand) break;
            }

            if (shouldExpand) {
                var $active = $('.activity--active');
                if ($active.length) {
                    expandDescription($active);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('FullDescExpander: Plugin loaded');
    }

    // ============================================================
    // ЗАПУСК
    // ============================================================
    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    }

})();
