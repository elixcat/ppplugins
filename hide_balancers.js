(function () {
    'use strict';

    if (window.hide_balancers_v4_installed) return;
    window.hide_balancers_v4_installed = true;

    var manifest = {
        type: 'other',
        version: '1.0.3',
        name: 'Налаштування меню картки',
        description: 'Приховує балансери, змінює заголовок "Дія" та видаляє статус',
        author: '@elixcat 🌚',
        component: 'hide_balancers'
    };

    Lampa.Manifest.plugins = manifest;

    function processMenu() {
        // Знаходимо всі меню на сторінці (щоб не чіпати те, що поза меню)
        var selectboxes = document.querySelectorAll('.selectbox');
        
        selectboxes.forEach(function(menu) {
            // --- 1. Приховування балансерів ---
            var items = menu.querySelectorAll('.selectbox-item');
            items.forEach(function(item) {
                if (item.classList.contains('selectbox-item--checkbox')) return; // Залишаємо чекбокси
                item.style.setProperty('display', 'none', 'important'); // Ховаємо балансери
            });

            // --- 2. Зміна заголовка "Дія" на "Схороняємо" ---
            var titles = menu.querySelectorAll('.settings-param-title');
            titles.forEach(function(title) {
                var span = title.querySelector('span');
                // Перевіряємо, чи це заголовок "Дія" (враховуємо можливі переклади)
                if (span && (span.textContent.trim() === 'Дія' || span.textContent.trim() === 'Действие' || span.textContent.trim() === 'Action')) {
                    span.textContent = 'Схороняємо 🌚';
                }
            });

            // --- 3. Приховування пункту "Статус" ---
            // Шукаємо всі елементи всередині меню, які можуть бути цим пунктом
            var allElements = menu.querySelectorAll('.selectbox-item, .settings-param-title');
            allElements.forEach(function(el) {
                var textEl = el.querySelector('.selectbox-item__title') || el.querySelector('span');
                if (textEl && textEl.textContent.trim().toLowerCase() === 'статус') {
                    el.style.setProperty('display', 'none', 'important');
                }
            });
        });
    }

    var observer = new MutationObserver(function (mutations) {
        var shouldProcess = false;
        
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) { 
                        if (node.matches && (node.matches('.selectbox') || node.matches('.selectbox-item') || node.querySelector('.selectbox'))) {
                            shouldProcess = true;
                        }
                    }
                });
            }
        });

        if (shouldProcess) {
            // Кілька спроб, щоб встигнути за рендерингом
            setTimeout(processMenu, 10);
            setTimeout(processMenu, 100);
            setTimeout(processMenu, 300);
        }
    });

    function start() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        setTimeout(processMenu, 500);
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
