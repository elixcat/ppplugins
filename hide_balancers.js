(function () {
    'use strict';

    if (window.hide_balancers_v2_installed) return;
    window.hide_balancers_v2_installed = true;

    var manifest = {
        type: 'other',
        version: '1.0.1',
        name: 'Приховування балансерів',
        description: 'Видаляє зайві балансери з контекстного меню карток, залишаючи лише закладки',
        author: '@elixcat 🌚',
        component: 'hide_balancers'
    };

    Lampa.Manifest.plugins = manifest;

    function hideUnwantedItems() {
        // Знаходимо всі елементи всередині меню
        var items = document.querySelectorAll('.selectbox-item, .settings-param-title');
        
        items.forEach(function(item) {
            // 1. Якщо це папка закладок (має чекбокс) — залишаємо
            if (item.classList.contains('selectbox-item--checkbox')) return;

            // 2. Якщо це заголовок "Вибране" — залишаємо
            if (item.classList.contains('settings-param-title')) return;

            // 3. Все інше (балансери) — ховаємо
            item.style.display = 'none';
        });
    }

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1 && (node.matches('.selectbox') || node.querySelector('.selectbox'))) {
                        // Даємо час Lampa домалювати меню, а потім ховаємо
                        setTimeout(hideUnwantedItems, 50);
                        setTimeout(hideUnwantedItems, 200); 
                    }
                });
            }
        });
    });

    function start() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        setTimeout(hideUnwantedItems, 500);
    }

    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                start();
            }
        });
    }

})();
