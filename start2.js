(function () {
    'use strict';

    function initializePlugin() {
        // Підписка на подію успішного запиту
        Lampa.Listener.follow('request_secuses', function (event) {
            if (event.data.blocked) {
                var activeActivity = Lampa.Activity.active();

                // Перемикання джерела на TMDB
                activeActivity.source = 'tmdb';
                Lampa.Storage.set('source', 'tmdb', true);

                // Оновлення інтерфейсу та фіксація на CUB
                Lampa.Activity.replace(activeActivity);
                Lampa.Storage.set('source', 'cub', true);
            }
        });

        // Таймер для вимкнення 'fixdcma'/'dcma'
        var settingsCheckInterval = setInterval(function () {
            if (typeof window.lampa_settings !== 'undefined' &&
                (window.lampa_settings.fixdcma || window.lampa_settings.dcma)) {
                clearInterval(settingsCheckInterval);

                if (window.lampa_settings.dcma) {
                    window.lampa_settings.dcma = false;
                }
            }
        }, 100);
    }

    // Запуск плагіна
    if (window.appready) {
        initializePlugin();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                initializePlugin();
            }
        });
    }
})();
