(function () {
    'use strict';

    // Чекаємо, поки додаток повністю завантажиться
    function startPlugin() {
        // Додаємо стиль, який ховає іконку "Друзі"
        var style = document.createElement('style');
        // Цей селектор потрібно уточнити, але часто він виглядає приблизно так
        style.innerHTML = '.head__action[data-action="friends"] { display: none !important; }';
        document.head.appendChild(style);
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                startPlugin();
            }
        });
    }
})();
