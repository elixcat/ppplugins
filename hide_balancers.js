(function () {
    'use strict';

    // Захист від повторного запуску
    if (window.hide_balancers_plugin_installed) return;
    window.hide_balancers_plugin_installed = true;

    // ==========================================
    // 1. МАНІФЕСТ ТА ПЕРЕКЛАДИ
    // ==========================================
    var manifest = {
        type: 'other',
        version: '1.0.0',
        name: 'Приховування балансерів',
        description: 'Видаляє зайві балансери з контекстного меню карток, залишаючи лише закладки',
        author: '@elixcat 🌚',
        component: 'hide_balancers'
    };

    Lampa.Manifest.plugins = manifest;

    // ==========================================
    // 2. ЛОГІКА ПРИХОВУВАННЯ
    // ==========================================
    function hideUnwantedItems() {
        // Знаходимо всі пункти меню
        var items = document.querySelectorAll('.selectbox-item');
        
        items.forEach(function(item) {
            // 1. Якщо це чекбокс (папки закладок) — залишаємо
            if (item.classList.contains('selectbox-item--checkbox')) return;

            // 2. Якщо це заголовок (наприклад "Оберіть джерело") — залишаємо
            if (item.classList.contains('settings-param-title')) return;

            // 3. Головна ознака балансера — наявність підзаголовка (субтитрів)
            var hasSubtitle = item.querySelector('.selectbox-item__subtitle');
            
            // Якщо у пункту є підзаголовок — це балансер. Ховаємо.
            if (hasSubtitle) {
                item.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 3. СПОСТЕРІГАЧ ЗА ПОЯВОЮ МЕНЮ
    // ==========================================
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function (node) {
                    // Якщо додався контейнер меню (selectbox)
                    if (node.nodeType === 1 && (node.matches('.selectbox') || node.querySelector('.selectbox'))) {
                        // Даємо Lampa час домалювати всі пункти
                        setTimeout(hideUnwantedItems, 50);
                        setTimeout(hideUnwantedItems, 150); 
                    }
                });
            }
        });
    });

    // Запускаємо спостерігач
    function start() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Додаткова перевірка, якщо меню вже відкрите
        setTimeout(hideUnwantedItems, 500);
    }

    // ==========================================
    // 4. ІНІЦІАЛІЗАЦІЯ
    // ==========================================
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
