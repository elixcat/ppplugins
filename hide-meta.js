(function () {
    'use strict';

    if (window.hide_meta_mood_ready) return;
    window.hide_meta_mood_ready = true;

    var TITLES = ['метаданные', 'настроения'];
    var HIDDEN = 'hmm-hidden';
    var timer = null;
    var direction = 'down';
    var skips = 0;
    var pending = null;
    var calls = 0;

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

    // ищем блок, к которому относится заголовок
    function process(title) {
        var line = title.closest('.items-line');
        if (line) return hide(line);

        var node = title;
        // поднимаемся, пока внутри нет ничего, кроме заголовка
        while (node.parentElement && text(node.parentElement) === text(title)) {
            node = node.parentElement;
        }

        var parent = node.parentElement;
        if (!parent) return;

        // общий контейнер только этого блока: заголовок + содержимое
        if (parent.firstElementChild === node && parent.children.length === 2) return hide(parent);

        // иначе прячем заголовок и следующий за ним элемент
        var next = node.nextElementSibling;
        hide(node);
        if (next) hide(next);
    }

    function scan() {
        timer = null;
        var all = document.querySelectorAll('.activity div, .activity span');

        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            if (el.children.length || el.closest('.' + HIDDEN)) continue;
            if (TITLES.indexOf(text(el)) !== -1) process(el);
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
    }

    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
})();
