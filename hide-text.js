(function () {
    'use strict';

    var TEXTS = [
        'немає історії перегляду',
        'нет истории просмотра'
    ];
    var CLASS = 'hhb-invisible';

    var style = document.createElement('style');
    style.textContent = '.' + CLASS + ' { display: none !important; }';
    document.head.appendChild(style);

    function refreshController() {
        try {
            if (window.Lampa && Lampa.Controller) {
                var current = Lampa.Controller.enabled && Lampa.Controller.enabled();
                if (current && current.name) Lampa.Controller.toggle(current.name);
            }
        } catch (e) {}
    }

    function matchesText(text) {
        if (!text || text.length > 80) return false;
        for (var j = 0; j < TEXTS.length; j++) {
            if (text.indexOf(TEXTS[j]) !== -1) return true;
        }
        return false;
    }

    function hideEl(el) {
        el.classList.remove('selector', 'focus', 'hover');
        el.classList.add(CLASS);
        return true;
    }

    function checkEl(el) {
        var cl = el.classList;
        if (!cl) return false;
        if (cl.contains(CLASS)) {
            if (cl.contains('selector')) {
                cl.remove('selector', 'focus', 'hover');
                return true;
            }
            return false;
        }
        if (!cl.contains('selector')) return false;

        var text = (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
        if (matchesText(text)) return hideEl(el);
        return false;
    }

    function checkTree(root) {
        if (!root || root.nodeType !== 1) return false;
        var hidden = checkEl(root);
        var nodes = root.querySelectorAll('.selector');
        for (var i = 0; i < nodes.length; i++) {
            if (checkEl(nodes[i])) hidden = true;
        }
        return hidden;
    }

    var observer = new MutationObserver(function (mutations) {
        var hidden = false;
        var roots = [], sels = [];

        for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];
            for (var k = 0; k < m.addedNodes.length; k++) {
                if (m.addedNodes[k].nodeType === 1) roots.push(m.addedNodes[k]);
            }
            var t = m.target && (m.target.nodeType === 1 ? m.target : m.target.parentElement);
            var s = t && t.closest ? t.closest('.selector') : null;
            if (s && !s._hhbQ) {
                s._hhbQ = true;
                sels.push(s);
            }
        }

        for (var r = 0; r < roots.length; r++) {
            if (checkTree(roots[r])) hidden = true;
        }
        for (r = 0; r < sels.length; r++) {
            sels[r]._hhbQ = false;
            if (checkEl(sels[r])) hidden = true;
        }

        if (hidden) refreshController();
    });

    function start() {
        if (checkTree(document.body)) refreshController();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (window.appready) start();
    else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') start();
        });
    } else {
        document.addEventListener('DOMContentLoaded', start);
    }
})();
