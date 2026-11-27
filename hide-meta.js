(function () {
    'use strict';

    if (window.hide_meta_mood_ready) return;
    window.hide_meta_mood_ready = true;

    function start() {
        // Событие приходит до того, как Lampa собирает ряды карточки.
        // Убираем данные, и ряды «Метаданные» и «Настроения» не создаются.
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'start' && e.data) delete e.data.metadata;
        });
    }

    function wait() {
        if (window.Lampa && Lampa.Listener) start();
        else setTimeout(wait, 200);
    }

    wait();
})();
