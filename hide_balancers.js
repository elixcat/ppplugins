(functio () {
    'use strict';

    if (window.hide_balancers_v5_installed) return;
    window.hide_balancers_v5_installed = true;

    var manifest = {
        type: 'other',
        version: '1.0.4',
        name: 'Налаштування меню картки',
        description: 'Приховує балансери, змінює заголовок "Дія" та видаляє статус',
        author: '@elixcat 🌚',
        component: 'hide_balancers'
    };

    Lampa.Manifest.plugins = manifest;

    function processMenu() {
        var selectboxes = document.querySelectorAll('.selectbox');
        
        selectboxes.forEach(function(menu) {
            // --- 1. Приховування балансерів ---
            var items = menu.querySelectorAll('.selectbox-item');
            items.forEach(function(item) {
                if (item.classList.contains('selectbox-item--checkbox')) return;
                item.style.setProperty('display', 'none', 'important');
            });

            // --- 2. Зміна заголовка "Дія" в шапці меню ---
            var menuTitle = menu.querySelector('.selectbox__title');
            if (menuTitle) {
                var currentText = menuTitle.textContent.trim();
                if (currentText === 'Дія' || currentText === 'Действие' || currentText === 'Action') {
                    menuTitle.textContent = 'Схороняємо 🌚';
                }
            }

            // --- 3. Приховування пункту "Статус" ---
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
