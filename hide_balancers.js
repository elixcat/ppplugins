(function () {
    'use strict';

    if (window.hide_balancers_v6_installed) return;
    window.hide_balancers_v6_installed = true;

    var manifest = {
        type: 'other',
        version: '2.0.0',
        name: 'Фільтр меню картки',
        description: 'Приховує непотрібні пункти з контекстного меню за ключовими словами',
        author: '@elixcat 🌚',
        component: 'hide_balancers'
    };

    Lampa.Manifest.plugins = manifest;

    // ==========================================
    // НАЛАШТУВАННЯ ЧОРНОГО СПИСКУ
    // ==========================================
    // Додавайте сюди слова (українською, російською або англійською), 
    // які треба приховати. Регістр не має значення (Онлайн == онлайн).
    var BLACKLIST_WORDS = [
        'онлайн',      // Приховає "Online (onli)", "Онлайн Мод" тощо
        'ualfilms',    // Приховає UAFilms
        'bandera',     // Приховає [Free] Bandera Online
        'z01',         // Приховає Z01
        'alpac',       // Приховає Alpac
        'статус',      // Приховає заголовок "Статус"
        'дивлюся',     // Приховує "Дивлюся"
        'переглянуто', // Приховує "Переглянуто"
        'заплановано', // Приховує "Заплановано"
        'далі буде',   // Приховує "Далі буде"
        'відкинуто',   // Приховує "Відкинуто"
        'подобається', // Приховує "Подобається"
        'пізніше',     // Приховує "Пізніше"
        'закладки'
        // ДОДАВАЙТЕ СВОЇ СЛОВА ТУТ, через кому в лапках
    ];

    function processMenu() {
        // Шукаємо всі меню на сторінці
        var selectboxes = document.querySelectorAll('.selectbox');
        
        selectboxes.forEach(function(menu) {
            // Знаходимо всі пункти меню (і балансери, і закладки, і кнопки)
            var items = menu.querySelectorAll('.selectbox-item, .settings-param-title');
            
            items.forEach(function(item) {
                // Отримуємо весь текст пункту (разом з описом, якщо він є)
                var textContent = item.textContent.trim().toLowerCase();
                
                // Перевіряємо, чи є в тексті хоча б одне заборонене слово
                var shouldHide = false;
                for (var i = 0; i < BLACKLIST_WORDS.length; i++) {
                    if (textContent.indexOf(BLACKLIST_WORDS[i].toLowerCase()) !== -1) {
                        shouldHide = true;
                        break; // Знайшли збіг — далі не перевіряємо
                    }
                }

                // Якщо знайшли заборонене слово — ховаємо весь блок
                if (shouldHide) {
                    item.style.setProperty('display', 'none', 'important');
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
            // Даємо час Lampa домалювати меню і застосовуємо фільтр
            setTimeout(processMenu, 50);
            setTimeout(processMenu, 150);
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
