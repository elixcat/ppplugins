(function () {
    'use strict';

    if (window.hide_meta_mood_ready) return;
    window.hide_meta_mood_ready = true;

    var TITLES = ['метаданные', 'настроения', 'метадані', 'настрої'];
    var HIDDEN = 'hmm-hidden';
    var timer = null;
    var direction = 'down';
    var skips = 0;
    var pending = null;
    var calls = 0;
    var noteTimer = null;

    function text(el) {
        return (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    // защита: не прячем крупные части карточки, иначе можно получить пустой экран
    function isSafe(el) {
        var big = '.activity, .scroll, .full-start, .full-start-new';
        if (el === document.body || el.matches(big) || el.querySelector(big)) return false;
        return el.querySelectorAll('.items-line').length === 0;
    }

    function hide(el) {
        if (!isSafe(el)) return;
        el.classList.add(HIDDEN);
        // убираем фокус пульта с элементов внутри скрытого блока
        var items = el.querySelectorAll('.selector');
        for (var i = 0; i < items.length; i++) items[i].classList.remove('selector');
    }

    // только собственный текст элемента, без значков и вложенных элементов
    function ownText(el) {
        var out = '';
        for (var i = 0; i < el.childNodes.length; i++) {
            if (el.childNodes[i].nodeType === 3) out += el.childNodes[i].nodeValue;
        }
        return out.toLowerCase().replace(/[^a-zа-яёіїє]/g, '');
    }

    // ищем блок, к которому относится заголовок: сам заголовок и то, что под ним
    function process(title) {
        var node = title;
        // поднимаемся, пока внутри нет ничего, кроме заголовка
        while (node.parentElement && text(node.parentElement) === text(title)) {
            node = node.parentElement;
        }

        var parent = node.parentElement;
        var next = node.nextElementSibling;

        // под заголовком ничего нет: данные могли ещё не загрузиться
        if (!parent || !next) return;

        hide(node);
        hide(next);

        if (!node.classList.contains(HIDDEN)) return;

        // если в контейнере не осталось ничего видимого, прячем и его
        for (var i = 0; i < parent.children.length; i++) {
            if (!parent.children[i].classList.contains(HIDDEN)) return notify();
        }
        hide(parent);
        notify();
    }

    function message(str) {
        if (window.Lampa && Lampa.Noty) Lampa.Noty.show(str);
    }

    function notify() {
        clearTimeout(noteTimer);
        noteTimer = setTimeout(function () {
            message('Скрытие v2: блок найден и скрыт');
        }, 500);
    }

    function scan() {
        timer = null;
        var all = document.body.getElementsByTagName('*');

        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            if (TITLES.indexOf(ownText(el)) === -1) continue;
            if (!el.closest('.' + HIDDEN)) process(el);
        }
    }

    function schedule() {
        if (!timer) timer = setTimeout(scan, 100);
    }

    // защита от залипания: если фокус пришёл на скрытый блок, идём дальше
    function guard() {
        var controller = window.Lampa && Lampa.Controller;
        if (!controller || !controller.collectionSet || !controller.move) return false;

        var original = controller.collectionSet;

        controller.collectionSet = function (html) {
            var result = original.apply(this, arguments);
            var el = html && (html.nodeType ? html : html[0]);

            calls++;
            clearTimeout(pending);

            if (!el || !el.closest || !el.closest('.' + HIDDEN)) {
                skips = 0;
                return result;
            }

            pending = setTimeout(function () {
                skips++;
                if (skips > 6) return; // не даём зациклиться

                // дальше идти некуда (край списка): разворачиваемся
                if (skips === 4) direction = direction === 'down' ? 'up' : 'down';

                var before = calls;
                controller.move(direction);

                // если перехода не было, пробуем ещё раз
                if (calls !== before) return;

                pending = setTimeout(function () {
                    controller.collectionSet(el);
                }, 60);
            }, 30);

            return result;
        };

        return true;
    }

    function waitLampa(attempt) {
        if (!guard() && attempt < 50) {
            setTimeout(function () { waitLampa(attempt + 1); }, 200);
        }
    }

    // запоминаем, куда нажали на пульте
    window.addEventListener('keydown', function (e) {
        var code = e.keyCode;
        if (code === 38 || code === 29460) direction = 'up';
        else if (code === 40 || code === 29461) direction = 'down';
        else return;
        skips = 0;
    }, true);

    function start() {
        waitLampa(0);

        var style = document.createElement('style');
        style.textContent = '.' + HIDDEN + '{display:none !important;}';
        document.head.appendChild(style);

        new MutationObserver(schedule).observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        scan();

        // чтобы было видно, что Lampa вообще загрузила плагин
        setTimeout(function () {
            message('Скрытие v2: плагин загружен');
        }, 4000);
    }

    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
})();
