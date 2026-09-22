(function () {
    'use strict';

    function initializePlugin() {
        // Підписка на подію успішного запиту
        Lampa.Listener.follow('request_secuses', function (event) {
            if (event.data.blocked) {
                var activeActivity = Lampa.Activity.active();
                
                // Перемикання джерела контенту на TMDB у поточній активності та сховищі
                activeActivity.source = 'tmdb';
                Lampa.Storage.set('source', 'tmdb', true);
                
                // Оновлення інтерфейсу та фіксація налаштувань CUB
                Lampa.Activity.replace(activeActivity);
                Lampa.Storage.set('source', 'cub', true);
            }
        });

        // Таймер для вимкнення функції 'fixdcma' або 'dcma' у налаштуваннях
        var settingsCheckInterval = setInterval(function () {
            if (typeof window.lampa_settings !== 'undefined' && (window.lampa_settings.fixdcma || window.lampa_settings.dcma)) {
                clearInterval(settingsCheckInterval);
                
                if (window.lampa_settings.dcma) {
                    window.lampa_settings.dcma = false;
                }
            }
        }, 100);
    }

    // Запуск плагіна: якщо додаток готовий — запускаємо одразу, інакше чекаємо на подію 'ready'
    if (window.appready) {
        initializePlugin();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type == 'ready') {
                initializePlugin();
            }
        });
    }
})();
