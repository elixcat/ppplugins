(function () {
    'use strict';

    if (window.hide_balancers_fixed_ready) return;
    window.hide_balancers_fixed_ready = true;

    function hideUnwantedItems() {
        // Знаходимо всі пункти меню
        var items = document.querySelectorAll('.selectbox-item');
        
        items.forEach(function(item) {
            // Якщо це чекбокс (твої закладки, папки) — залишаємо як є
            if (item.classList.contains('selectbox-item--checkbox')) return;

            // Якщо це заголовок (наприклад "Оберіть джерело") — залишаємо
            if (item.classList.contains('settings-param-title')) return;

            // Перевіряємо, чи це балансер. 
            // Головна ознака балансера — наявність підзаголовка (субтитрів).
            // Або якщо в тексті є слово "онлайн" (хоча це менш надійно).
            var hasSubtitle = item.querySelector('.selectbox-item__subtitle');
            
            // Якщо у пункту є підзаголовок — це майже 100% балансер. Ховаємо.
            if (hasSubtitle) {
                item.style.display = 'none';
            }
        });
    }

    // Створюємо спостерігач за появою меню
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

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Додаткова перевірка, якщо меню вже відкрите
    setTimeout(hideUnwantedItems, 500);

})();
