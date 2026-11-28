(function () {
    'use strict';

    if (window.hide_balancers_v3_installed) return;
    window.hide_balancers_v3_installed = true;

    var manifest = {
        type: 'other',
        version: '1.0.2',
        name: 'Приховування балансерів',
        description: 'Видаляє зайві балансери з контекстного меню карток, залишаючи лише закладки',
        author: '@elixcat 🌚',
        component: 'hide_balancers'
    };

    Lampa.Manifest.plugins = manifest;

    function hideUnwantedItems() {
        // Шукаємо всі елементи меню
        var items = document.querySelectorAll('.selectbox-item, .settings-param-title');
        
        items.forEach(function(item) {
            // 1. Залишаємо чекбокси (папки закладок)
            if (item.classList.contains('selectbox-item--checkbox')) return;

            // 2. Залишаємо заголовки
            if (item.classList.contains('settings-param-title')) return;

            // 3. Ховаємо все інше (балансери)
            item.style.setProperty('display', 'none', 'important');
        });
    }

    var observer = new MutationObserver(function (mutations) {
        var shouldHide = false;
        
        mutations.forEach(function (mutation) {
            // Перевіряємо, чи додалися нові вузли
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) { // Якщо це елемент
                        // Якщо додався контейнер меню або сам пункт
                        if (node.matches && (node.matches('.selectbox') || node.matches('.selectbox-item') || node.querySelector('.selectbox'))) {
                            shouldHide = true;
                        }
                    }
                });
            }
        });

        if (shouldHide) {
            // Робимо кілька спроб з різною затримкою, щоб наздогнати рендеринг
            setTimeout(hideUnwantedItems, 10);
            setTimeout(hideUnwantedItems, 100);
            setTimeout(hideUnwantedItems, 300);
        }
    });

    function start() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        // Початкова перевірка
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
