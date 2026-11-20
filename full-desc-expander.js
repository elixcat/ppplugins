(function () {
    'use strict';

    // Захист від повторного завантаження
    if (window.FullDescExpanderLoaded) return;
    window.FullDescExpanderLoaded = true;

    // ============================================================
    // МАНІФЕСТ ПЛАГІНА
    // ============================================================
    var manifest = {
        type: 'video',
        version: '1.0.0',
        name: 'Full Desc Expander',
        description: 'Розширює вікно опису фільму, якщо текст довгий',
        component: 'full_desc_expander'
    };

    // ============================================================
    // CSS ДЛЯ РОЗШИРЕННЯ ОПИСУ
    // ============================================================
    function injectCSS() {
        if (document.getElementById('fde-style')) return;

        var style = document.createElement('style');
        style.id = 'fde-style';
        style.innerHTML = `
            /* Основні селектори опису в Lampa */
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

            /* Контейнер опису — знімаємо обмеження висоти */
            .full-descr,
            .full-start__description,
            .full-start-new__description {
                max-height: none !important;
                overflow: visible !important;
            }

            /* Кнопка "Читати далі" — приховуємо, бо вона більше не потрібна */
            .full-descr__more,
            .full-start__more,
            [class*="descr"][class*="more"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================================
    // ОБРОБКА ВІКНА ФІЛЬМУ
    // ============================================================
    function expandDescription(html) {
        if (!html) return;

        var $html = $(html);

        // Знаходимо всі можливі елементи опису
        var $descriptions = $html.find(
            '.full-descr__text, .full-start__desc, .full-start-new__desc, .full-start__text, .info__desc'
        );

        $descriptions.each(function () {
            var $el = $(this);

            // Перевіряємо, чи є обмеження висоти
            var el = $el[0];
            if (!el) return;

            // Знімаємо всі inline-обмеження
            $el.css({
                'max-height': 'none',
                'overflow': 'visible',
                'display': 'block',
                '-webkit-line-clamp': 'unset',
                'line-clamp': 'unset'
            });

            // Також обробляємо батьківський контейнер, якщо він має обмеження
            var $parent = $el.parent();
            if ($parent.length) {
                $parent.css({
                    'max-height': 'none',
                    'overflow': 'visible'
                });
            }
        });

        // Додатково: шукаємо елементи з inline style, що містять line-clamp або max-height
        $html.find('[style*="line-clamp"], [style*="max-height"]').each(function () {
            var $el = $(this);
            // Перевіряємо, чи це схоже на опис
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
    }

    // ============================================================
    // ІНІЦІАЛІЗАЦІЯ
    // ============================================================
    function init() {
        // Реєструємо маніфест
        if (window.Lampa && Lampa.Manifest) {
            Lampa.Manifest.plugins = manifest;
        }

        injectCSS();

        // Слухаємо подію побудови вікна фільму
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'build') {
                var html = e.html;

                // Обробляємо одразу
                expandDescription(html);

                // І ще раз з невеликою затримкою — на випадок, якщо Lampa
                // застосовує обмеження після нашої обробки
                setTimeout(function () {
                    expandDescription(html);

                    // Також обробляємо активний DOM
                    var $active = $('.activity--active');
                    if ($active.length) {
                        expandDescription($active);
                    }
                }, 300);

                // І ще одна перевірка після повного рендеру
                setTimeout(function () {
                    expandDescription(html);
                    var $active = $('.activity--active');
                    if ($active.length) {
                        expandDescription($active);
                    }
                }, 800);
            }
        });

        // Додатково: спостерігаємо за DOM-змінами, щоб перехопити динамічно
        // додані елементи опису
        var observer = new MutationObserver(function (mutations) {
            var shouldExpand = false;

            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];

                // Перевіряємо додані вузли
                if (m.addedNodes && m.addedNodes.length > 0) {
                    for (var j = 0; j < m.addedNodes.length; j++) {
                        var node = m.addedNodes[j];
                        if (node.nodeType === 1) {
                            // Перевіряємо, чи це або містить елемент опису
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
                            // Або контейнер з описом
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
