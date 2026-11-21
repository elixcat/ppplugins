(function() {
    'use strict';

    var PLUGIN_VERSION = '1.88';
    var EDIT_ORDER_BUTTON_ID = 'buttons_plugin_edit_order';
    var FULL_EVENT_TYPE = 'complite';
    var DELAY_AFTER_APPLY_MS = 100;
    var DELAY_FULL_CARD_READY_MS = 400;
    var DELAY_ICON_PICKER_MODAL_MS = 4000;
    var DEFAULT_ICONS_URL = 'https://amikdn.github.io/lampa-button-icons.json';
    var SYNC_POSTER_INTERVAL_MS = 3000;
    var STORAGE_KEYS = {
        custom_order: 'button_custom_order',
        hidden: 'button_hidden',
        custom_icons: 'button_custom_icons',
        custom_labels: 'button_custom_labels',
        viewmode: 'buttons_viewmode',
        editor_enabled: 'buttons_editor_enabled',
        plugin_version: 'buttons_plugin_version',
        folders: 'button_folders',
        item_order: 'button_item_order',
        icon_global_color: 'button_global_color',
        icon_colors: 'button_custom_colors',
        stable_map: 'button_stable_map'
    };

    var colorPickerPaletteHexes = ['#ef5350', '#f44336', '#e53935', '#c62828', '#ff9800', '#fb8c00', '#f57c00', '#e65100', '#ffeb3b', '#fdd835', '#fbc02d', '#f57f17', '#66bb6a', '#4caf50', '#43a047', '#2e7d32', '#3da18d', '#26c6da', '#00bcd4', '#00acc1', '#00838f', '#42a5f5', '#2196f3', '#1e88e5', '#1565c0', '#8b5cf6', '#ab47bc', '#9c27b0', '#8e24aa', '#6a1b9a', '#ec407a', '#e91e63', '#d81b60', '#ad1457', '#ffffff', '#e0e0e0', '#000000'];

    function escapeHtml(str) {
        if (str == null || typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function logDebug() {
        try {
            if (typeof console !== 'undefined' && console && typeof console.warn === 'function') {
                console.warn.apply(console, ['[buttons]'].concat([].slice.call(arguments)));
            }
        } catch (e) {  }
    }

    function definePolyfill(proto, name, fn) {
        if (proto[name]) return;
        try {
            Object.defineProperty(proto, name, { value: fn, configurable: true, writable: true, enumerable: false });
        } catch (e) {
            proto[name] = fn;
        }
    }

    definePolyfill(Array.prototype, 'forEach', function(callback, thisArg) {
        var T, k;
        if (this == null) throw new TypeError('this is null or not defined');
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
        if (arguments.length > 1) T = thisArg;
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    });

    definePolyfill(Array.prototype, 'filter', function(callback, thisArg) {
        if (this == null) throw new TypeError('this is null or not defined');
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
        var res = [];
        var T = thisArg;
        var k = 0;
        while (k < len) {
            if (k in O) {
                var kValue = O[k];
                if (callback.call(T, kValue, k, O)) res.push(kValue);
            }
            k++;
        }
        return res;
    });

    definePolyfill(Array.prototype, 'find', function(callback, thisArg) {
        if (this == null) throw new TypeError('this is null or not defined');
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
        var T = thisArg;
        var k = 0;
        while (k < len) {
            var kValue = O[k];
            if (callback.call(T, kValue, k, O)) return kValue;
            k++;
        }
        return undefined;
    });

    definePolyfill(Array.prototype, 'some', function(callback, thisArg) {
        if (this == null) throw new TypeError('this is null or not defined');
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
        var T = thisArg;
        var k = 0;
        while (k < len) {
            if (k in O && callback.call(T, O[k], k, O)) return true;
            k++;
        }
        return false;
    });

    definePolyfill(Array.prototype, 'indexOf', function(searchElement, fromIndex) {
        if (this == null) throw new TypeError('this is null or not defined');
        var O = Object(this);
        var len = O.length >>> 0;
        if (len === 0) return -1;
        var n = fromIndex | 0;
        if (n >= len) return -1;
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in O && O[k] === searchElement) return k;
            k++;
        }
        return -1;
    });

    var LAMPAC_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M20.331 14.644l-13.794-13.831 17.55 10.075zM2.938 0c-0.813 0.425-1.356 1.2-1.356 2.206v27.581c0 1.006 0.544 1.781 1.356 2.206l16.038-16zM29.512 14.1l-3.681-2.131-4.106 4.031 4.106 4.031 3.756-2.131c1.125-0.893 1.125-2.906-0.075-3.8zM6.538 31.188l17.55-10.075-3.756-3.756z" fill="currentColor"></path></svg>';
    var EXCLUDED_CLASSES = ['button--play', 'button--edit-order', 'button--folder'];
    var DEFAULT_GROUPS = [
        { name: 'online', patterns: ['online', 'lampac', 'modss', 'showy'], label: 'Онлайн' },
        { name: 'torrent', patterns: ['torrent'], label: 'Торренти' },
        { name: 'trailer', patterns: ['trailer', 'rutube'], label: 'Трейлери' },
        { name: 'favorite', patterns: ['favorite'], label: 'Обране' },
        { name: 'subscribe', patterns: ['subscribe'], label: 'Підписка' },
        { name: 'book', patterns: ['book'], label: 'Закладки' },
        { name: 'reaction', patterns: ['reaction'], label: 'Реакції' }
    ];
    var currentButtons = [];
    var allButtonsCache = [];
    var allButtonsOriginal = [];
    var currentContainer = null;

    function getStableMap() {
        var m = Lampa.Storage.get(STORAGE_KEYS.stable_map, {});
        return m && typeof m === 'object' ? m : {};
    }

    function setStableMap(m) {
        Lampa.Storage.set(STORAGE_KEYS.stable_map, m || {});
    }

    function baseIdOf(btnId) {
        if (!btnId || typeof btnId !== 'string') return '';
        var sepIdx = btnId.indexOf('___dup');
        return sepIdx === -1 ? btnId : btnId.substring(0, sepIdx);
    }

    function detectBalancerPluginKey(btn) {
        var classes = btn.attr('class') || '';
        var text = (btn.find('span').first().text() || '').trim().toLowerCase();
        var knownBalancers = [
            { key: 'modss', patterns: ['modss', 'mods'] },
            { key: 'showy', patterns: ['showy'] },
            { key: 'lampac', patterns: ['lampac'] },
            { key: 'btl', patterns: ['btl'] },
            { key: 'torrentio', patterns: ['torrentio'] },
            { key: 'jackett', patterns: ['jackett'] },
            { key: 'prowlarr', patterns: ['prowlarr'] },
            { key: 'btdig', patterns: ['btdig'] },
            { key: 'rutor', patterns: ['rutor'] },
            { key: 'nnmclub', patterns: ['nnmclub'] }
        ];
        for (var i = 0; i < knownBalancers.length; i++) {
            var b = knownBalancers[i];
            for (var j = 0; j < b.patterns.length; j++) {
                if (classes.toLowerCase().indexOf(b.patterns[j]) !== -1 || text.indexOf(b.patterns[j]) !== -1) {
                    return b.key;
                }
            }
        }
        if (classes.indexOf('online') !== -1) {
            try {
                var manifest = Lampa.Manifest && Lampa.Manifest.plugins;
                if (manifest && Array.isArray(manifest)) {
                    for (var k = 0; k < manifest.length; k++) {
                        var p = manifest[k];
                        if (p && p.name) {
                            var pName = String(p.name).toLowerCase().replace(/\s+/g, '');
                            if (classes.toLowerCase().indexOf(pName) !== -1 || text.indexOf(pName) !== -1) {
                                return pName;
                            }
                        }
                    }
                }
            } catch (e) { logDebug('detectBalancerPluginKey manifest', e); }
        }
        return null;
    }

    function getStableButtonKey(btn) {
        var rawId = getButtonId(btn);
        var base = baseIdOf(rawId);
        var map = getStableMap();
        if (map[base]) {
            if (rawId !== base && !map[rawId]) {
                map[rawId] = map[base];
                setStableMap(map);
            }
            return map[base];
        }
        var pluginKey = detectBalancerPluginKey(btn);
        var stableKey = pluginKey ? ('plugin:' + pluginKey) : ('btn:' + base);
        map[base] = stableKey;
        if (rawId !== base) map[rawId] = stableKey;
        setStableMap(map);
        return stableKey;
    }

    function getOrderKey(btn) {
        return getStableButtonKey(btn);
    }

    function isKnownButton(btn) {
        var btnId = getButtonId(btn);
        for (var i = 0; i < allButtonsCache.length; i++) {
            if (getButtonId(allButtonsCache[i]) === btnId && allButtonsCache[i][0] === btn[0]) return true;
        }
        return false;
    }

    function reconcileLateButtons(container) {
        if (!container || !container.length || !container.closest('html').length) return;
        var animationUntil = container.data('buttons-animation-until') || 0;
        var waitForAnimation = animationUntil - Date.now();
        if (waitForAnimation > 0) {
            setTimeout(function() { reconcileLateButtons(container); }, waitForAnimation + 30);
            return;
        }
        var hasUnknownButton = false;
        container.find('.full-start-new__buttons .full-start__button').each(function() {
            var btn = $(this);
            if (!isExcluded(btn) && !isKnownButton(btn)) {
                hasUnknownButton = true;
                return false;
            }
        });
        if (hasUnknownButton && reorderButtons(container, { animate: false })) refreshController();
    }

    function watchForLateButtons(container) {
        if (typeof MutationObserver === 'undefined' || !container || !container.length) return;
        var target = container.find('.full-start-new__buttons');
        if (!target.length || target.data('buttons-late-observer')) return;

        var refreshTimer = null;
        var observer = new MutationObserver(function(mutations) {
            var hasUnknownButton = false;
            for (var i = 0; i < mutations.length && !hasUnknownButton; i++) {
                var added = mutations[i].addedNodes || [];
                for (var j = 0; j < added.length; j++) {
                    var node = added[j];
                    if (!node || node.nodeType !== 1) continue;
                    var candidates = $(node).is('.full-start__button')
                        ? $(node)
                        : $(node).find('.full-start__button');
                    candidates.each(function() {
                        var btn = $(this);
                        if (!isExcluded(btn) && !isKnownButton(btn)) {
                            hasUnknownButton = true;
                            return false;
                        }
                    });
                    if (hasUnknownButton) break;
                }
            }
            if (!hasUnknownButton) return;

            clearTimeout(refreshTimer);
            var animationUntil = container.data('buttons-animation-until') || 0;
            var refreshDelay = Math.max(50, animationUntil - Date.now() + 30);
            refreshTimer = setTimeout(function() {
                container.data('buttons-processed', true);
                reconcileLateButtons(container);
            }, refreshDelay);
        });

        observer.observe(target[0], { childList: true, subtree: true });
        target.data('buttons-late-observer', observer);
    }

    function findButton(btnId) {
        var btn = allButtonsOriginal.find(function(b) { return getButtonId(b) === btnId; });
        if (!btn) {
            btn = allButtonsCache.find(function(b) { return getButtonId(b) === btnId; });
        }
        return btn;
    }

    function getCustomOrder() {
        return Lampa.Storage.get(STORAGE_KEYS.custom_order, []);
    }

    function setCustomOrder(order) {
        Lampa.Storage.set(STORAGE_KEYS.custom_order, order);
    }

    function getHiddenButtons() {
        return Lampa.Storage.get(STORAGE_KEYS.hidden, []);
    }

    function setHiddenButtons(hidden) {
        Lampa.Storage.set(STORAGE_KEYS.hidden, hidden);
    }

    function getCustomIcons() {
        return Lampa.Storage.get(STORAGE_KEYS.custom_icons, {});
    }

    function setCustomIcons(icons) {
        Lampa.Storage.set(STORAGE_KEYS.custom_icons, icons);
    }

    function getCustomLabels() {
        return Lampa.Storage.get(STORAGE_KEYS.custom_labels, {});
    }

    function setCustomLabels(labels) {
        Lampa.Storage.set(STORAGE_KEYS.custom_labels, labels);
    }

    function getFolders() {
        var raw = Lampa.Storage.get(STORAGE_KEYS.folders, []);
        if (!Array.isArray(raw)) return [];
        return raw.filter(function(f) { return f && typeof f === 'object'; }).map(function(f) {
            if (!Array.isArray(f.buttons)) f.buttons = [];
            return f;
        });
    }

    function setFolders(folders) {
        Lampa.Storage.set(STORAGE_KEYS.folders, folders);
    }

    function getItemOrder() {
        var raw = Lampa.Storage.get(STORAGE_KEYS.item_order, []);
        if (!Array.isArray(raw)) return [];
        return raw.filter(function(it) { return it && typeof it === 'object' && it.id != null; });
    }

    function setItemOrder(order) {
        Lampa.Storage.set(STORAGE_KEYS.item_order, order);
    }

    function getGlobalIconColor() {
        return Lampa.Storage.get(STORAGE_KEYS.icon_global_color, '') || '';
    }

    function setGlobalIconColor(hex) {
        Lampa.Storage.set(STORAGE_KEYS.icon_global_color, hex || '');
    }

    function getPerButtonIconColors() {
        var m = Lampa.Storage.get(STORAGE_KEYS.icon_colors, {});
        return m && typeof m === 'object' ? m : {};
    }

    function setPerButtonIconColors(map) {
        Lampa.Storage.set(STORAGE_KEYS.icon_colors, map || {});
    }

    function iconSvgPalette() {
        return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 10.5C8 11.3284 7.32843 12 6.5 12C5.67157 12 5 11.3284 5 10.5C5 9.67157 5.67157 9 6.5 9C7.32843 9 8 9.67157 8 10.5Z" fill="currentColor"></path><path d="M10.5 8C11.3284 8 12 7.32843 12 6.5C12 5.67157 11.3284 5 10.5 5C9.67157 5 9 5.67157 9 6.5C9 7.32843 9.67157 8 10.5 8Z" fill="currentColor"></path><path d="M17 6.5C17 7.32843 16.3284 8 15.5 8C14.6716 8 14 7.32843 14 6.5C14 5.67157 14.6716 5 15.5 5C16.3284 5 17 5.67157 17 6.5Z" fill="currentColor"></path><path d="M7.5 17C8.32843 17 9 16.3284 9 15.5C9 14.6716 8.32843 14 7.5 14C6.67157 14 6 14.6716 6 15.5C6 16.3284 6.67157 17 7.5 17Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C17.9712 1 23 5.34921 23 11V11.0146C23 11.543 23.0001 12.4458 22.6825 13.4987C21.8502 16.2575 18.8203 16.9964 16.4948 16.4024C16.011 16.2788 15.5243 16.145 15.0568 16.0107C14.2512 15.7791 13.5177 16.4897 13.6661 17.2315L13.9837 18.8197L14.0983 19.5068C14.3953 21.289 13.0019 23.1015 11.0165 22.8498C7.65019 22.423 5.11981 21.1007 3.43595 19.1329C1.75722 17.171 1 14.6613 1 12ZM12 3C7.02944 3 3 7.02944 3 12C3 14.2854 3.64673 16.303 4.95555 17.8326C6.25924 19.3561 8.3 20.4894 11.2681 20.8657C11.7347 20.9249 12.2348 20.4915 12.1255 19.8356L12.0163 19.1803L11.7049 17.6237C11.2467 15.3325 13.4423 13.4657 15.6093 14.0885C16.0619 14.2186 16.529 14.3469 16.9897 14.4646C18.7757 14.9208 20.3744 14.2249 20.7677 12.921C20.997 12.161 21 11.5059 21 11C21 6.65079 17.0745 3 12 3Z" fill="currentColor"></path></svg>';
    }

    function toolbarSvgViewModeDefault() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
    }

    function toolbarSvgViewModeIconsOnly() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="12" r="2.5"/><circle cx="12" cy="12" r="2.5"/><circle cx="17" cy="12" r="2.5"/></svg>';
    }

    function toolbarSvgViewModeWithText() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="5" height="5" rx="1"/><line x1="12" y1="7.5" x2="21" y2="7.5"/><rect x="3" y="14" width="5" height="5" rx="1"/><line x1="12" y1="16.5" x2="21" y2="16.5"/></svg>';
    }

    function getViewModeToolbarSvg(mode) {
        if (mode === 'icons') {
            return toolbarSvgViewModeIconsOnly();
        }
        if (mode === 'always') {
            return toolbarSvgViewModeWithText();
        }
        return toolbarSvgViewModeDefault();
    }

    function toolbarSvgIconColorGlobal() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="13.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>' +
            '<circle cx="17.5" cy="10.5" r="1" fill="currentColor" stroke="none"/>' +
            '<circle cx="8.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>' +
            '<circle cx="6.5" cy="12.5" r="1" fill="currentColor" stroke="none"/>' +
            '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.68-.75 1.68-1.68 0-.39-.15-.74-.4-1.01-.23-.26-.37-.6-.37-.98 0-.56.45-1.01 1.01-1.01H16c3.31 0 6-2.69 6-6 0-4.96-4.5-9.31-10-9.31z"/>' +
            '</svg>';
    }

    function toolbarSvgReset() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';
    }

    function toolbarSvgFolderConfirm() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><path d="m9 12 2 2 4-4"/></svg>';
    }

    function toolbarSvgCheck() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    }

    function folderPlaceholderSvgStr() {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.5em; height:1.5em;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="8" y1="11" x2="16" y2="11"></line><line x1="8" y1="15" x2="16" y2="15"></line></svg>';
    }

    function buildCustomIconsMapForApply() {
        var map = {};
        var stored = getCustomIcons();
        var k;
        for (k in stored) {
            if (stored.hasOwnProperty(k)) {
                map[k] = stored[k];
            }
        }
        getFolders().forEach(function(f) {
            if (f && f.id && f.customIcon) {
                map[f.id] = f.customIcon;
            }
        });
        return map;
    }

    function focusModalController() {
        setTimeout(function() {
            try {
                if (Lampa.Controller && typeof Lampa.Controller.toggle === 'function') {
                    Lampa.Controller.toggle('modal');
                }
            } catch (e) {
                logDebug('focusModalController', e);
            }
        }, 120);
    }

    var EDGE_SCROLL_PAD = 8;

    function openModalWithEdgeScroll(params) {
        Lampa.Modal.open(params);
        patchModalEdgeScroll();
    }

    function patchModalEdgeScroll() {
        try {
            if (!Lampa.Modal || typeof Lampa.Modal.scroll !== 'function') return;
            var scroll = Lampa.Modal.scroll();
            if (!scroll || scroll.__edgeScrollPatched) return;
            if (typeof scroll.update !== 'function' || typeof scroll.wheel !== 'function' ||
                typeof scroll.render !== 'function') return;
            scroll.__edgeScrollPatched = true;
            scroll.update = function(elem) {
                try {
                    var target = elem && elem.jquery ? elem[0] : elem;
                    if (!target || typeof target.getBoundingClientRect !== 'function') return;
                    var renderEl = scroll.render(true);
                    if (!renderEl) return;
                    var viewportEl = renderEl.querySelector('.scroll__content') || renderEl;
                    var er = target.getBoundingClientRect();
                    var vr = viewportEl.getBoundingClientRect();
                    if (!er.height || !vr.height) return;

                    if (er.bottom > vr.bottom - EDGE_SCROLL_PAD) {
                        scroll.wheel(er.bottom - vr.bottom + EDGE_SCROLL_PAD);

                    } else if (er.top < vr.top + EDGE_SCROLL_PAD) {
                        scroll.wheel(er.top - vr.top - EDGE_SCROLL_PAD);
                    }

                } catch (e) {
                    logDebug('edgeScroll.update', e);
                }
            };
        } catch (e) {
            logDebug('patchModalEdgeScroll', e);
        }
    }

    function syncModalFont() {
        try {
            var ref = document.querySelector('.settings-param') || document.querySelector('.settings');
            if (!ref) ref = document.body;
            var cs = window.getComputedStyle(ref);
            var modalRoot = document.querySelector('.modal__content') || document.querySelector('.modal .modal__body') || document.querySelector('.modal .modal__html');
            if (!modalRoot && typeof window.$ !== 'undefined' && window.$) {
                var $inner = $('.modal').last().find('.modal__body, .modal__content, .modal__html').first();
                if ($inner.length) modalRoot = $inner[0];
            }
            if (!modalRoot) return;
            if (cs.fontFamily) modalRoot.style.fontFamily = cs.fontFamily;
            if (cs.fontSize) modalRoot.style.fontSize = cs.fontSize;
        } catch (e) {
            logDebug('syncModalFont', e);
        }
    }

    function loadIconsFromUrlChain(urls, seen, callback) {
        var allResults = [];
        var idx = 0;
        function next() {
            if (idx >= urls.length) {
                callback(allResults, null);
                return;
            }
            var u = urls[idx++];
            if (!u || typeof u !== 'string') {
                next();
                return;
            }
            loadIconsFromUrl(u, seen, function(entries) {
                if (entries && entries.length) {
                    var r;
                    for (r = 0; r < entries.length; r++) {
                        allResults.push(entries[r]);
                    }
                }
                next();
            });
        }
        next();
    }

    function closeModalSafe() {
        try {
            if (typeof Lampa.Modal !== 'undefined' && Lampa.Modal.close) {
                Lampa.Modal.close();
            }
        } catch (e) {
            logDebug('closeModalSafe', e);
        }
    }

    function reopenButtonEditorAfterColorPicker(refreshLayoutFirst) {
        closeModalSafe();
        if (refreshLayoutFirst) {
            applyChanges();
        }
        setTimeout(function() {
            openEditDialog();
        }, 280);
    }

    function isLightPaletteHex(hex) {
        var h = String(hex || '').replace(/\s/g, '').toLowerCase();
        return h === '#ffffff' || h === '#fff' || h === '#e0e0e0';
    }

    function openColorPickerModal(targetId) {
        var isGlobal = !targetId;
        var perColors = getPerButtonIconColors();
        var currentHex = isGlobal ? getGlobalIconColor() : (perColors[targetId] || '');
        var wrap = $('<div class="ci-color-picker-wrap buttons-plugin-color-modal"></div>');
        var isUnset = !currentHex;
        var defaultRow = $('<div class="selector color-picker-default buttons-plugin-modal-row" tabindex="0">' +
            '<div class="color-picker-default-swatch"></div>' +
            '<span class="buttons-plugin-ui-text">Стандартний</span></div>');
        if (isUnset) {
            defaultRow.addClass('color-picker-default--ring');
        }
        defaultRow.on('hover:enter', function() {
            applyPickedColor(targetId, '');
        });
        wrap.append(defaultRow);

        var hexRow = $('<div class="selector color-picker-hex buttons-plugin-modal-row buttons-plugin-modal-row--between" tabindex="0">' +
            '<span class="buttons-plugin-ui-text">Код кольору (HEX)</span>' +
            '<span class="hex-value buttons-plugin-ui-text">' + escapeHtml(currentHex || '#') + '</span></div>');
        hexRow.on('hover:enter', function() {
            closeModalSafe();
            setTimeout(function() {
                if (typeof Lampa.Input !== 'undefined' && typeof Lampa.Input.edit === 'function') {
                    Lampa.Input.edit({
                        free: true,
                        title: 'Код кольору (HEX)',
                        nosave: true,
                        value: currentHex,
                        nomic: true
                    }, function(raw) {
                        var trimmedHex = (raw || '').trim();
                        if (trimmedHex && trimmedHex.charAt(0) !== '#') {
                            trimmedHex = '#' + trimmedHex;
                        }
                        applyPickedColor(targetId, trimmedHex);
                    });
                }
            }, 280);
        });
        wrap.append(hexRow);

        var swatchGrid = $('<div class="color-picker-tiles"></div>');
        colorPickerPaletteHexes.forEach(function(paletteHex) {
            var cell = $('<div class="selector color-picker-tile" tabindex="0"></div>');
            cell.css('background-color', paletteHex);
            if (isLightPaletteHex(paletteHex)) {
                cell.addClass('color-picker-tile--light');
            }
            if (currentHex && paletteHex.toLowerCase() === String(currentHex).toLowerCase()) {
                cell.addClass('ci-picker-selected');
            }
            cell.on('hover:enter', function() {
                applyPickedColor(targetId, paletteHex);
            });
            swatchGrid.append(cell);
        });
        wrap.append(swatchGrid);

        function applyPickedColor(buttonId, hex) {
            if (isGlobal) {
                setGlobalIconColor(hex);
            } else {
                var colors = getPerButtonIconColors();
                if (hex) {
                    colors[buttonId] = hex;
                } else {
                    delete colors[buttonId];
                }
                setPerButtonIconColors(colors);
            }
            if (currentContainer) {
                currentContainer.find('.full-start__button').each(function() {
                    $(this).data('ci_force_reset', true);
                });
            }
            closeModalSafe();
            reopenButtonEditorAfterColorPicker(true);
        }

        closeModalSafe();
        setTimeout(function() {
            openModalWithEdgeScroll({
                title: 'Колір іконок',
                html: wrap,
                size: 'medium',
                scroll_to_center: false,
                onBack: function() {
                    closeModalSafe();
                    setTimeout(function() {
                        reopenButtonEditorAfterColorPicker(false);
                    }, 200);
                }
            });
            focusModalController();
        }, 250);
    }

    function isNeutralTone(hexOrName) {
        if (!hexOrName) {
            return false;
        }
        var compactLower = String(hexOrName).replace(/\s/g, '').toLowerCase();
        return compactLower === '#fff' || compactLower === '#ffffff' || compactLower === 'white' ||
            compactLower === '#000' || compactLower === '#000000' || compactLower === 'black' ||
            compactLower === '#ccc' || compactLower === '#cccccc' || compactLower === 'gray' ||
            compactLower === 'grey' || compactLower === '#fff7f7';
    }

    function paintSvgWithColor($svg, resolvedColor) {
        if (!$svg || !$svg.length) {
            return $svg;
        }
        $svg.attr('data-ci-color', resolvedColor || '');
        $svg.find('*').addBack().each(function() {
            var el = this;
            var tag = el.tagName.toLowerCase();
            var fillAttr = (el.getAttribute('fill') || '').trim();
            var strokeAttr = (el.getAttribute('stroke') || '').trim();
            el.style.removeProperty('fill');
            el.style.removeProperty('stroke');
            el.style.removeProperty('color');
            if (resolvedColor) {
                if (tag === 'svg') {
                    el.style.setProperty('color', resolvedColor, 'important');
                    if (fillAttr && fillAttr.toLowerCase() !== 'none' && fillAttr.toLowerCase() !== 'transparent') {
                        el.style.setProperty('fill', resolvedColor, 'important');
                    }
                } else {
                    var ownerSvg = $(el).closest('svg');
                    var svgFill = (ownerSvg.attr('fill') || '').trim().toLowerCase();
                    var svgStroke = (ownerSvg.attr('stroke') || '').trim().toLowerCase();
                    if (fillAttr) {
                        if (fillAttr.toLowerCase() === 'none' || fillAttr.toLowerCase() === 'transparent') {
                            el.style.setProperty('fill', 'none', 'important');
                        } else if (isNeutralTone(fillAttr)) {
                            el.style.setProperty('fill', fillAttr, 'important');
                        } else {
                            el.style.setProperty('fill', resolvedColor, 'important');
                        }
                    } else if (svgFill === 'none' || svgFill === 'transparent') {
                        el.style.setProperty('fill', 'none', 'important');
                    } else {
                        el.style.setProperty('fill', resolvedColor, 'important');
                    }
                    if (strokeAttr) {
                        if (strokeAttr.toLowerCase() === 'none' || strokeAttr.toLowerCase() === 'transparent') {
                            el.style.setProperty('stroke', 'none', 'important');
                        } else if (isNeutralTone(strokeAttr)) {
                            el.style.setProperty('stroke', strokeAttr, 'important');
                        } else {
                            el.style.setProperty('stroke', resolvedColor, 'important');
                        }
                    } else if (svgStroke && svgStroke !== 'none' && svgStroke !== 'transparent') {
                        el.style.setProperty('stroke', resolvedColor, 'important');
                    } else {
                        el.style.setProperty('stroke', 'none', 'important');
                    }
                }
            } else {
                if (fillAttr) {
                    el.style.setProperty('fill', fillAttr, 'important');
                }
                if (strokeAttr) {
                    el.style.setProperty('stroke', strokeAttr, 'important');
                }
            }
        });
        return $svg;
    }

    function applyIconsAndColorsToButtons(nodes) {
        if (!nodes) {
            return;
        }
        var customIconsMap = buildCustomIconsMapForApply();
        var perButtonColors = getPerButtonIconColors();
        var globalColor = getGlobalIconColor();
        if (nodes.jquery) {
            nodes = nodes.toArray();
        }
        nodes.forEach(function(rawEl) {
            var btn = $(rawEl);
            if (!btn || !btn.length) {
                return;
            }
            var isFolder = btn.hasClass('button--folder');
            var isEditOrder = btn.hasClass('button--edit-order');
            var targetId;
            if (isFolder) {
                targetId = btn.attr('data-folder-id');
            } else if (isEditOrder) {
                targetId = EDIT_ORDER_BUTTON_ID;
            } else {
                targetId = getButtonId(btn);
            }
            if (!targetId) {
                return;
            }
            var resolvedColor = perButtonColors[targetId] || globalColor || '';
            var fallbackSvg = null;
            if (isFolder) {
                fallbackSvg = $(folderPlaceholderSvgStr());
            } else if (isEditOrder) {
                fallbackSvg = getDefaultEditButtonSvg();
            } else {
                var cloneBtn = allButtonsOriginal.find(function(candidate) {
                    return getButtonId(candidate) === targetId;
                });
                if (cloneBtn && cloneBtn.length) {
                    fallbackSvg = cloneBtn.find('svg').first();
                }
            }
            var currentSvg = btn.find('svg').first();
            var customMarkupAttr = currentSvg.attr('data-ci-custom');
            var storedColorAttr = currentSvg.attr('data-ci-color') || '';
            var needsRebuild = false;
            if (customIconsMap[targetId] && customMarkupAttr !== customIconsMap[targetId]) {
                needsRebuild = true;
            }
            if (!customIconsMap[targetId] && currentSvg.hasClass('ci-enforced') && customMarkupAttr) {
                needsRebuild = true;
            }
            if (storedColorAttr !== resolvedColor) {
                needsRebuild = true;
            }
            if (btn.data('ci_force_reset')) {
                needsRebuild = true;
            }
            if (needsRebuild) {
                var newSvg = null;
                if (customIconsMap[targetId]) {
                    newSvg = $(customIconsMap[targetId]).clone();
                    newSvg.addClass('ci-enforced').attr('data-ci-custom', customIconsMap[targetId]);
                } else {
                    if (customMarkupAttr || btn.data('ci_force_reset')) {
                        if (fallbackSvg && fallbackSvg.length) {
                            newSvg = fallbackSvg.clone();
                        }
                    } else if (currentSvg.length) {
                        newSvg = currentSvg.clone();
                    } else if (fallbackSvg && fallbackSvg.length) {
                        newSvg = fallbackSvg.clone();
                    }
                    if (newSvg) {
                        newSvg.addClass('ci-enforced');
                        newSvg.removeAttr('data-ci-custom');
                    }
                }
                if (newSvg) {
                    paintSvgWithColor(newSvg, resolvedColor);
                    if (currentSvg.length) {
                        currentSvg.replaceWith(newSvg);
                    } else {
                        btn.prepend(newSvg);
                        btn.removeClass('no-icon');
                    }
                } else {
                    if (currentSvg.length) {
                        currentSvg.remove();
                    }
                    btn.addClass('no-icon');
                }
                btn.removeData('ci_force_reset');
            } else if (resolvedColor && currentSvg.length) {
                currentSvg[0].style.setProperty('color', resolvedColor, 'important');
                currentSvg[0].style.setProperty('fill', resolvedColor, 'important');
            }
        });
    }

    function getButtonsInFolders() {
        var folders = getFolders();
        var buttonsInFolders = [];
        folders.forEach(function(folder) {
            if (Array.isArray(folder.buttons)) {
                buttonsInFolders = buttonsInFolders.concat(folder.buttons);
            }
        });
        return buttonsInFolders;
    }

    function normalizeSvgString(str) {
        if (!str || typeof str !== 'string') return '';
        return str.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    }

    function sanitizeSvgMarkup(raw) {
        if (!raw || typeof raw !== 'string') return '';

        var match = raw.match(/<svg[\s\S]*?<\s*\/\s*svg\s*>/i);
        var svg = match ? match[0] : '';
        if (!svg) return '';

        svg = svg.replace(/<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi, '');
        svg = svg.replace(/<\s*script\b[^>]*>/gi, '');

        svg = svg.replace(/<\s*foreignObject[\s\S]*?<\s*\/\s*foreignObject\s*>/gi, '');

        svg = svg.replace(/\son[a-z0-9_-]+\s*=\s*"[^"]*"/gi, '');
        svg = svg.replace(/\son[a-z0-9_-]+\s*=\s*'[^']*'/gi, '');
        svg = svg.replace(/\son[a-z0-9_-]+\s*=\s*[^\s>]+/gi, '');

        svg = svg.replace(/(href|xlink:href|src)\s*=\s*"\s*javascript:[^"]*"/gi, '$1="#"');
        svg = svg.replace(/(href|xlink:href|src)\s*=\s*'\s*javascript:[^']*'/gi, "$1='#'");
        return svg;
    }

    function svgFingerprint(html) {
        var s = normalizeSvgString(html);
        var useMatch = s.match(/xlink:href\s*=\s*["']?#([^"'\s>]+)/);
        if (useMatch) return 'use:' + useMatch[1];
        var vb = s.match(/viewBox\s*=\s*["']([^"']+)["']/);
        var viewBox = vb ? vb[1].replace(/\s+/g, ' ').trim() : '';
        var pathMatch = s.match(/<path[^>]*\bd\s*=\s*["']([^"']+)["']/g);
        var pathParts = pathMatch ? pathMatch.map(function(p) {
            var d = p.match(/\bd\s*=\s*["']([^"']+)["']/);
            return d ? d[1].replace(/\s+/g, ' ').trim() : '';
        }) : [];
        pathParts.sort();
        return 'inline:' + viewBox + '|' + pathParts.join('|');
    }

    function collectAllIcons(preloadSeen) {
        var seen = {};
        var pk;
        if (preloadSeen) {
            for (pk in preloadSeen) {
                if (preloadSeen.hasOwnProperty(pk)) {
                    seen[pk] = true;
                }
            }
        }
        var result = [];
        function addIcon(html, id) {
            if (!html) return;
            var key = svgFingerprint(html);
            if (seen[key]) return;
            seen[key] = true;
            result.push({ id: id || key.substring(0, 80), html: html });
        }
        addIcon(LAMPAC_ICON, 'lampac-online');
        var symbols = document.querySelectorAll('symbol[id]');
        for (var i = 0; i < symbols.length; i++) {
            var sym = symbols[i];
            var sid = sym.getAttribute('id') || '';
            var viewBox = sym.getAttribute('viewBox') || '0 0 24 24';
            var svgHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" fill="currentColor"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#' + sid + '"></use></svg>';
            addIcon(svgHtml, 'sprite-' + sid);
        }
        var buttonArrays = [currentButtons, allButtonsCache, allButtonsOriginal];
        for (var a = 0; a < buttonArrays.length; a++) {
            var arr = buttonArrays[a];
            if (!arr || !arr.length) continue;
            for (var j = 0; j < arr.length; j++) {
                var b = arr[j];
                var $b = b && (b.jquery ? b : $(b));
                if (!$b || !$b.length) continue;
                var svgEl = $b.find('svg').first();
                if (svgEl.length) {
                    try {
                        var raw = svgEl.get(0).outerHTML;
                        addIcon(raw, 'list-' + a + '-' + j);
                    } catch (err) { logDebug('collectAllIcons: button svg', err); }
                }
            }
        }
        var allButtonEls = document.querySelectorAll('.full-start__button');
        for (var k = 0; k < allButtonEls.length; k++) {
            var el = allButtonEls[k];
            if (el.classList && (el.classList.contains('button--edit-order') || el.classList.contains('button--play'))) continue;
            var svg = el.querySelector && el.querySelector('svg');
            if (svg) {
                try {
                    var colorAttr = svg.getAttribute && svg.getAttribute('data-ci-color');
                    if (colorAttr) {
                        continue;
                    }
                    var raw = svg.outerHTML;
                    addIcon(raw, 'dom-' + k);
                } catch (err) { logDebug('collectAllIcons: dom button svg', err); }
            }
        }
        var buttonsContainers = document.querySelectorAll('.full-start-new__buttons');
        for (var c = 0; c < buttonsContainers.length; c++) {
            var container = buttonsContainers[c];
            var children = container.children || container.childNodes;
            for (var n = 0; n < children.length; n++) {
                var child = children[n];
                if (!child || child.nodeType !== 1) continue;
                if (child.classList && (child.classList.contains('button--edit-order') || child.classList.contains('button--play'))) continue;
                var childSvg = child.querySelector && child.querySelector('svg');
                if (childSvg) {
                    try {
                        if (childSvg.getAttribute && childSvg.getAttribute('data-ci-color')) {
                            continue;
                        }
                        var rawChild = childSvg.outerHTML;
                        addIcon(rawChild, 'plugin-' + c + '-' + n);
                    } catch (err) { logDebug('collectAllIcons: container svg', err); }
                }
            }
        }
        var menuIcos = document.querySelectorAll('.menu .menu__ico svg');
        for (var m = 0; m < menuIcos.length; m++) {
            try {
                var menuSvg = menuIcos[m];
                var menuRaw = menuSvg.outerHTML;
                addIcon(menuRaw, 'menu-' + m);
            } catch (err) { logDebug('collectAllIcons: menu svg', err); }
        }
        return result;
    }

    function getDefaultIconForButton(btnId) {
        var orig = allButtonsOriginal.find(function(b) { return getButtonId(b) === btnId; });
        if (!orig || !orig.length) return '';
        var svg = orig.find('svg').first();
        return svg.length ? svg.get(0).outerHTML : '';
    }

    function loadIconsFromUrl(url, seen, originalCallback) {
        if (!url || typeof url !== 'string') {
            originalCallback(null, 'Введіть посилання на файл');
            return;
        }

        var settled = false;
        function callback(res, err) {
            if (settled) return;
            settled = true;
            originalCallback(res, err);
        }
        var xhr = new XMLHttpRequest();
        xhr.timeout = 15000;
        xhr.ontimeout = function() {
            callback(null, 'Тайм-аут завантаження');
        };
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            if (xhr.status !== 200) {
                callback(null, 'Помилка завантаження: ' + (xhr.status || 'мережа'));
                return;
            }
            var text = (xhr.responseText || '').replace(/^\uFEFF/, '').trim();
            if (!text) {
                callback(null, 'Порожня відповідь');
                return;
            }
            if (text.indexOf('<!') === 0 || text.indexOf('<html') !== -1) {
                callback(null, 'За посиланням віддається не JSON (перевірте файл на сайті)');
                return;
            }
            text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            text = text.replace(/,(\s*)\]/g, '$1]').replace(/,(\s*)\}/g, '$1}');
            var arr;
            try {
                arr = JSON.parse(text);
            } catch (e) {
                try {
                    arr = JSON.parse(text.replace(/[\u0000-\u001F]+/g, ' '));
                } catch (e2) {

                    var svgList = text.match(/<svg[\s\S]*?<\s*\/\s*svg\s*>/gi);
                    if (svgList && svgList.length > 0) {
                        arr = svgList;
                    } else {
                        callback(null, 'Невірний формат файлу');
                        return;
                    }
                }
            }
            if (!Array.isArray(arr)) {
                callback(null, 'Файл має містити масив');
                return;
            }
            var result = [];
            var urlsToFetch = [];
            var i, item, html, key;
            for (i = 0; i < arr.length; i++) {
                item = arr[i];
                if (typeof item === 'string') {
                    html = item.trim();
                    if (html.indexOf('<svg') !== -1) {
                        html = sanitizeSvgMarkup(html);
                        if (html) {
                            key = svgFingerprint(html);
                            if (!seen[key]) {
                                seen[key] = true;
                                result.push({ id: 'icon-' + i, html: html });
                            }
                        }
                    } else if (html.indexOf('http://') === 0 || html.indexOf('https://') === 0) {
                        urlsToFetch.push({ url: html, index: i });
                    }
                } else if (item && item.html != null) {
                    html = String(item.html).trim();
                    if (html && html.indexOf('<svg') !== -1) {
                        html = sanitizeSvgMarkup(html);
                        if (html) {
                            key = svgFingerprint(html);
                            if (!seen[key]) {
                                seen[key] = true;
                                result.push({ id: (item.id && String(item.id)) || key.substring(0, 80), html: html });
                            }
                        }
                    }
                }
            }
            if (urlsToFetch.length === 0) {
                callback(result, null);
                return;
            }
            var fetched = 0;
            urlsToFetch.forEach(function(entry) {
                var req = new XMLHttpRequest();
                req.timeout = 15000;
                req.ontimeout = function() {
                    fetched++;
                    if (fetched === urlsToFetch.length) {
                        callback(result, null);
                    }
                };
                req.open('GET', entry.url, true);
                req.onload = function() {
                    if (req.status === 200 && req.responseText) {
                        html = req.responseText.trim();
                        if (html.indexOf('<svg') !== -1) {
                            html = sanitizeSvgMarkup(html);
                            if (html) {
                                key = svgFingerprint(html);
                                if (!seen[key]) {
                                    seen[key] = true;
                                    result.push({ id: 'icon-' + entry.index, html: html });
                                }
                            }
                        }
                    }
                    fetched++;
                    if (fetched === urlsToFetch.length) {
                        callback(result, null);
                    }
                };
                req.onerror = function() {
                    fetched++;
                    if (fetched === urlsToFetch.length) {
                        callback(result, null);
                    }
                };
                req.send();
            });
        };
        xhr.onerror = function() {
            callback(null, 'Помилка мережі');
        };
        try {
            xhr.open('GET', url, true);
            xhr.responseType = 'text';
            xhr.send();
        } catch (e) {
            callback(null, 'Помилка запиту');
        }
    }

    function buildIconPicker(opts) {
        opts = opts || {};
        var title = opts.title || '';
        var defaultIconHtml = opts.defaultIconHtml;
        var onChoice = (typeof opts.onChoice === 'function') ? opts.onChoice : function() {};
        var seenForJsonDedupe = {};
        var wrap = $('<div class="icon-picker-wrap buttons-plugin-icon-picker"></div>');
        var defaultBlock = $('<div class="selector icon-picker-default" tabindex="0">' +
            '<div class="icon-picker-default__preview"></div>' +
            '<span class="buttons-plugin-ui-text">За замовчуванням</span></div>');
        if (defaultIconHtml) {
            defaultBlock.find('.icon-picker-default__preview').append($(defaultIconHtml).clone());
        }
        function applyChoice(isDefault, chosenHtml) {
            onChoice(isDefault, chosenHtml);
        }
        defaultBlock.on('hover:enter', function() {
            applyChoice(true, null);
        });
        wrap.append(defaultBlock);
        var tabLampa = $('<div class="selector icon-picker-tab icon-picker-tab--active buttons-plugin-ui-text" tabindex="0">Іконки Lampa</div>');
        var tabAlt = $('<div class="selector icon-picker-tab buttons-plugin-ui-text" tabindex="0">Альтернативні іконки</div>');
        var switchBlock = $('<div class="icon-picker-switch-wrap"></div>');
        switchBlock.append(tabLampa).append(tabAlt);
        wrap.append(switchBlock);
        var loadStatus = $('<div class="icon-picker-load-status buttons-plugin-ui-text"></div>');
        wrap.append(loadStatus);
        wrap.addClass('icon-picker-view-lampa');
        tabLampa.on('hover:enter', function() {
            wrap.removeClass('icon-picker-view-alt').addClass('icon-picker-view-lampa');
            tabLampa.addClass('icon-picker-tab--active');
            tabAlt.removeClass('icon-picker-tab--active');
        });
        tabAlt.on('hover:enter', function() {
            wrap.removeClass('icon-picker-view-lampa').addClass('icon-picker-view-alt');
            tabAlt.addClass('icon-picker-tab--active');
            tabLampa.removeClass('icon-picker-tab--active');
        });
        loadStatus.text('Завантаження…');
        var modalOpened = false;
        function openModal() {
            if (modalOpened) return;
            modalOpened = true;
            openModalWithEdgeScroll({
                title: title,
                html: wrap,
                size: 'medium',
                scroll_to_center: false,
                onBack: function() {
                    closeModalSafe();
                    setTimeout(function() {
                        reopenButtonEditorAfterColorPicker(false);
                    }, 200);
                }
            });
        }
        var openTimeout = setTimeout(openModal, DELAY_ICON_PICKER_MODAL_MS);
        var chainUrls = [DEFAULT_ICONS_URL];
        loadIconsFromUrlChain(chainUrls, seenForJsonDedupe, function(newEntries, err) {
            clearTimeout(openTimeout);
            var icons = collectAllIcons(seenForJsonDedupe);
            icons.forEach(function(entry) {
                var lampaCell = $('<div class="selector icon-picker-grid__cell icon-picker-cell-lampa" tabindex="0"></div>');
                lampaCell.append($(entry.html).clone());
                var lampaHtml = entry.html;
                lampaCell.on('hover:enter', function() {
                    applyChoice(false, lampaHtml);
                });
                wrap.append(lampaCell);
            });
            if (newEntries && newEntries.length) {
                newEntries.forEach(function(entry) {
                    var altCell = $('<div class="selector icon-picker-grid__cell icon-picker-cell-alt" tabindex="0"></div>');
                    altCell.append($(entry.html).clone());
                    var altHtml = entry.html;
                    altCell.on('hover:enter', function() {
                        applyChoice(false, altHtml);
                    });
                    wrap.append(altCell);
                });
                loadStatus.text('Альтернативні: ' + newEntries.length + ' · вкладка Lampa: ' + icons.length);
            } else {
                loadStatus.text('Вкладка Lampa: ' + icons.length);
            }
            openModal();
        });
    }

    function openTextInputModal(opts) {
        opts = opts || {};
        var title = opts.title || '';
        var placeholder = opts.placeholder || '';
        var value = opts.value || '';
        var onDone = (typeof opts.onDone === 'function') ? opts.onDone : function() {};
        var onBack = (typeof opts.onBack === 'function') ? opts.onBack : function() {};
        var wrap = $('<div class="name-picker-wrap">' +
            '<input type="text" class="name-picker-input" value="' + escapeHtml(value) + '" placeholder="' + escapeHtml(placeholder) + '" style="width:100%;padding:.7em 1em;margin:.3em 0;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:.7em;color:#fff;font-size:1em;box-sizing:border-box" />' +
            '<div class="selector name-picker-ok">' +
            '<span class="menu-edit-list__create-folder-spacer"></span>' +
            '<div class="menu-edit-list__create-folder-inner">' +
            '<div class="menu-edit-list__icon">' + toolbarSvgCheck() + '</div>' +
            '<span class="buttons-plugin-ui-text">Готово</span>' +
            '</div><span class="menu-edit-list__create-folder-spacer"></span></div></div>');
        var inputEl = wrap.find('input').get(0);
        wrap.find('.name-picker-ok').on('hover:enter', function() {
            var val = (inputEl && inputEl.value) ? String(inputEl.value).trim() : '';
            if (typeof Lampa.Modal !== 'undefined' && Lampa.Modal.close) Lampa.Modal.close();
            onDone(val);
        });
        openModalWithEdgeScroll({
            title: title,
            html: wrap,
            size: 'small',
            scroll_to_center: true,
            onBack: onBack
        });
        setTimeout(function() { if (inputEl) inputEl.focus(); }, 150);
    }

    function openIconPicker(btn, btnId, defaultIconHtml, listItem) {
        buildIconPicker({
            title: 'Іконка кнопки',
            defaultIconHtml: defaultIconHtml,
            onChoice: function(isDefault, chosenHtml) {
                var stored = getCustomIcons();
                var custom = {};
                for (var key in stored) {
                    if (stored.hasOwnProperty(key)) custom[key] = stored[key];
                }
                if (isDefault) {
                    delete custom[btnId];
                } else {
                    custom[btnId] = chosenHtml;
                }
                setCustomIcons(custom);
                reopenButtonEditorAfterColorPicker(true);
            }
        });
    }

    var BM_ID_ATTR = 'data-bm-id';
    var BM_ID_SEP = '___dup';

    function baseButtonId(button) {
        var classes = button.attr('class') || '';
        var span = button.find('span').first();
        var text = (span.attr('data-original-text') || span.text() || '').trim().replace(/\s+/g, '_');
        var subtitle = button.attr('data-subtitle') || '';
        if (classes.indexOf('modss') !== -1 || text.indexOf('MODS') !== -1 || text.indexOf('MOD') !== -1) {
            return 'modss_online_button';
        }
        if (classes.indexOf('showy') !== -1 || text.indexOf('Showy') !== -1) {
            return 'showy_online_button';
        }
        var viewClasses = classes.split(' ').filter(function(c) { return c.indexOf('view--') === 0 || c.indexOf('button--') === 0; }).join('_');
        if (!viewClasses && !text) {
            return 'button_unknown';
        }
        var id = viewClasses + '_' + text;
        if (subtitle) {
            id = id + '_' + subtitle.replace(/\s+/g, '_').substring(0, 30);
        }
        return id;
    }

    function assignButtonIds($buttons) {
        if (!$buttons || !$buttons.length) return;
        var counts = {};

        $buttons.each(function() {
            var existing = this.getAttribute ? this.getAttribute(BM_ID_ATTR) : null;
            if (!existing) return;
            var sepIdx = existing.indexOf(BM_ID_SEP);
            var base = sepIdx === -1 ? existing : existing.substring(0, sepIdx);
            var n = 1;
            if (sepIdx !== -1) {
                var parsed = parseInt(existing.substring(sepIdx + BM_ID_SEP.length), 10);
                if (!isNaN(parsed)) n = parsed;
            }
            if (!counts[base] || n > counts[base]) counts[base] = n;
        });

        $buttons.each(function() {
            if (this.getAttribute && this.getAttribute(BM_ID_ATTR)) return;
            var base = baseButtonId($(this));
            var c = (counts[base] || 0) + 1;
            counts[base] = c;
            var id = (c === 1) ? base : (base + BM_ID_SEP + c);
            if (this.setAttribute) this.setAttribute(BM_ID_ATTR, id);
        });
    }

    function getButtonId(button) {
        if (!button) return baseButtonId(button);
        var el = button[0];
        if (el && el.getAttribute) {
            var stamped = el.getAttribute(BM_ID_ATTR);
            if (stamped) return stamped;
        } else if (button.attr) {
            var attr = button.attr(BM_ID_ATTR);
            if (attr) return attr;
        }
        return baseButtonId(button);
    }

    function getButtonType(button) {
        var classes = button.attr('class') || '';
        for (var i = 0; i < DEFAULT_GROUPS.length; i++) {
            var group = DEFAULT_GROUPS[i];
            for (var j = 0; j < group.patterns.length; j++) {
                if (classes.indexOf(group.patterns[j]) !== -1) {
                    return group.name;
                }
            }
        }
        return 'other';
    }

    function isExcluded(button) {
        var classes = button.attr('class') || '';
        for (var i = 0; i < EXCLUDED_CLASSES.length; i++) {
            if (classes.indexOf(EXCLUDED_CLASSES[i]) !== -1) {
                return true;
            }
        }
        return false;
    }

    function categorizeButtons(container) {
        var allButtons = container.find('.full-start__button').not('.button--edit-order, .button--folder, .button--play');

        assignButtonIds(allButtons);
        var categories = { online: [], torrent: [], trailer: [], favorite: [], subscribe: [], book: [], reaction: [], other: [] };
        var processedIds = {};
        allButtons.each(function() {
            var $btn = $(this);
            if (isExcluded($btn)) return;
            var btnId = getButtonId($btn);
            if (processedIds[btnId]) return;
            processedIds[btnId] = true;
            var type = getButtonType($btn);
            if (categories[type]) {
                categories[type].push($btn);
            } else {
                categories.other.push($btn);
            }
            if (!$btn.hasClass('selector')) {
                $btn.addClass('selector');
            }
        });
        return categories;
    }

    function getAllButtonsFromCategories(categories) {
        return [].concat(
            categories.online,
            categories.torrent,
            categories.trailer,
            categories.favorite,
            categories.subscribe,
            categories.book,
            categories.reaction,
            categories.other
        );
    }

    function sortByCustomOrder(buttons) {
        var customOrder = getCustomOrder();
        if (!customOrder.length) {
            var regular = buttons.slice();
            regular.sort(function(a, b) {
                var typeOrder = ['online', 'torrent', 'trailer', 'favorite', 'subscribe', 'book', 'reaction', 'other'];
                var typeA = getButtonType(a);
                var typeB = getButtonType(b);
                var indexA = typeOrder.indexOf(typeA);
                var indexB = typeOrder.indexOf(typeB);
                if (indexA === -1) indexA = 999;
                if (indexB === -1) indexB = 999;
                return indexA - indexB;
            });
            return regular;
        }
        var sorted = [];
        var remaining = buttons.slice();
        customOrder.forEach(function(key) {
            for (var i = 0; i < remaining.length; i++) {
                if (getOrderKey(remaining[i]) === key || getButtonId(remaining[i]) === key) {
                    sorted.push(remaining[i]);
                    remaining.splice(i, 1);
                    break;
                }
            }
        });
        return sorted.concat(remaining);
    }

    function applyHiddenButtons(buttons) {
        var hidden = getHiddenButtons();
        buttons.forEach(function(btn) {
            var id = getButtonId(btn);
            btn.toggleClass('hidden', hidden.indexOf(id) !== -1);
        });
    }

    function getDefaultLabelForButton(btnId) {
        var orig = allButtonsOriginal.find(function(b) { return getButtonId(b) === btnId; });
        if (!orig || !orig.length) return '';
        return orig.find('span').first().text().trim();
    }

    function applyCustomLabels(buttons) {
        var customLabels = getCustomLabels();
        buttons.forEach(function(btn) {
            var id = getButtonId(btn);
            if (customLabels[id]) {
                var span = btn.find('span').first();
                if (span.length) {
                    if (!span.attr('data-original-text')) {
                        span.attr('data-original-text', getDefaultLabelForButton(id) || span.text().trim());
                    }
                    span.text(customLabels[id]);
                }
            }
        });
    }

    function applyButtonAnimation(buttons, opacityOnly) {
        var animName = opacityOnly ? 'button-fade-in-opacity' : 'button-fade-in';
        buttons.forEach(function(btn, index) {
            btn.css({
                'opacity': '0',
                'animation': animName + ' 0.4s ease forwards',
                'animation-delay': (index * 0.08) + 's'
            });
            if (opacityOnly) {
                btn.one('animationend', function() {
                    $(this).css({ 'opacity': '1', 'animation': '', 'animation-delay': '' });
                });
            }
        });
    }

    function getDefaultEditButtonSvg() {
        return $('<div style="display:none"></div>').html(
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 30 29" fill="none"><use xlink:href="#sprite-edit"></use></svg>'
        ).find('svg').first();
    }

    function createEditButton() {
        var btn = $('<div class="full-start__button selector button--edit-order" style="order: 9999;"></div>');
        btn.append(getDefaultEditButtonSvg().clone());
        btn.on('hover:enter', function() {
            openEditDialog();
        });
        if (Lampa.Storage.get(STORAGE_KEYS.editor_enabled) === false) {
            btn.hide();
        }
        return btn;
    }

    function saveOrder() {
        var order = [];
        currentButtons.forEach(function(btn) {
            order.push(getOrderKey(btn));
        });
        setCustomOrder(order);
    }

    function createFolderButton(folder) {
        var btn = $('<div class="full-start__button selector button--folder" data-folder-id="' + escapeHtml(folder.id) + '"></div>');
        btn.append($(folderPlaceholderSvgStr()));
        var span = $('<span>' + escapeHtml(folder.name || 'Папка') + '</span>');
        btn.append(span);
        btn.on('hover:enter', function() {
            openFolder(folder);
        });
        return btn;
    }

    function layoutButtons(targetContainer, currentButtons, folders, buttonsInFolders, options) {
        options = options || {};
        var guardInFolders = !!options.guardButtonsInFolders;
        var foldersFirst = !!options.foldersFirstWhenNoOrder;
        if (!buttonsInFolders) buttonsInFolders = [];
        var visibleButtons = [];
        var itemOrder = getItemOrder();
        var customOrder = getCustomOrder();

        if (customOrder.length > 0) {
            var addedKeys = {};
            customOrder.forEach(function(key) {
                var btn = currentButtons.find(function(b) {
                    return getOrderKey(b) === key || getButtonId(b) === key;
                });
                if (btn) {
                    var bid = getButtonId(btn);
                    if (!guardInFolders || buttonsInFolders.indexOf(bid) === -1) {
                        targetContainer.append(btn);
                        if (!btn.hasClass('hidden')) visibleButtons.push(btn);
                        addedKeys[key] = true;
                        addedKeys[bid] = true;
                    }
                }
                var folder = folders.find(function(f) { return f.id === key; });
                if (folder) {
                    var folderBtn = createFolderButton(folder);
                    targetContainer.append(folderBtn);
                    visibleButtons.push(folderBtn);
                    addedKeys[key] = true;
                }
            });
            currentButtons.forEach(function(btn) {
                var bid = getButtonId(btn);
                var okey = getOrderKey(btn);
                if (addedKeys[okey] || addedKeys[bid]) return;
                if (guardInFolders && buttonsInFolders.indexOf(bid) !== -1) return;
                targetContainer.append(btn);
                if (!btn.hasClass('hidden')) visibleButtons.push(btn);
            });
            folders.forEach(function(folder) {
                if (addedKeys[folder.id]) return;
                var folderBtn = createFolderButton(folder);
                targetContainer.append(folderBtn);
                visibleButtons.push(folderBtn);
            });
            return visibleButtons;
        }

        if (itemOrder.length > 0) {
            var addedFolders = [];
            var addedButtons = [];
            itemOrder.forEach(function(item) {
                if (item.type === 'folder') {
                    var folder = folders.find(function(f) { return f.id === item.id; });
                    if (folder) {
                        var folderBtn = createFolderButton(folder);
                        targetContainer.append(folderBtn);
                        visibleButtons.push(folderBtn);
                        addedFolders.push(folder.id);
                    }
                } else if (item.type === 'button') {
                    var btnId = item.id;
                    if (!guardInFolders || buttonsInFolders.indexOf(btnId) === -1) {
                        var btn = currentButtons.find(function(b) {
                            return getButtonId(b) === btnId || getOrderKey(b) === btnId;
                        });
                        if (btn) {
                            targetContainer.append(btn);
                            if (!btn.hasClass('hidden')) visibleButtons.push(btn);
                            addedButtons.push(btnId);
                        }
                    }
                }
            });
            currentButtons.forEach(function(btn) {
                var btnId = getButtonId(btn);
                if (addedButtons.indexOf(btnId) === -1 && (!guardInFolders || buttonsInFolders.indexOf(btnId) === -1)) {
                    targetContainer.append(btn);
                    if (!btn.hasClass('hidden')) visibleButtons.push(btn);
                }
            });
            folders.forEach(function(folder) {
                if (addedFolders.indexOf(folder.id) === -1) {
                    var folderBtn = createFolderButton(folder);
                    targetContainer.append(folderBtn);
                    visibleButtons.push(folderBtn);
                }
            });
        } else {
            var appendLooseButtons = function() {
                currentButtons.forEach(function(btn) {
                    if (!guardInFolders || buttonsInFolders.indexOf(getButtonId(btn)) === -1) {
                        targetContainer.append(btn);
                        if (!btn.hasClass('hidden')) visibleButtons.push(btn);
                    }
                });
            };
            var appendAllFolders = function() {
                folders.forEach(function(folder) {
                    var folderBtn = createFolderButton(folder);
                    targetContainer.append(folderBtn);
                    visibleButtons.push(folderBtn);
                });
            };
            if (foldersFirst) {
                appendAllFolders();
                appendLooseButtons();
            } else {
                appendLooseButtons();
                appendAllFolders();
            }
        }
        return visibleButtons;
    }

    function applyChanges() {
        if (!currentContainer) return;
        var categories = categorizeButtons(currentContainer);
        var allButtons = sortByCustomOrder(getAllButtonsFromCategories(categories));
        allButtonsCache = allButtons;
        var folders = getFolders();
        var buttonsInFolders = getButtonsInFolders();
        var filteredButtons = allButtons.filter(function(btn) {
            return buttonsInFolders.indexOf(getButtonId(btn)) === -1;
        });
        currentButtons = filteredButtons;
        var targetContainer = currentContainer.find('.full-start-new__buttons');
        if (!targetContainer.length) return;
        targetContainer.find('.full-start__button').not('.button--edit-order').detach();

        var visibleButtons = layoutButtons(targetContainer, currentButtons, folders, buttonsInFolders, {
            guardButtonsInFolders: true
        });

        applyHiddenButtons(currentButtons);
        applyCustomLabels(currentButtons);
        applyIconsAndColorsToButtons(visibleButtons);
        applyButtonAnimation(visibleButtons, false);

        if (Lampa.Storage.get(STORAGE_KEYS.editor_enabled) !== false) {
            var editBtn = targetContainer.find('.button--edit-order');
            if (!editBtn.length) {
                editBtn = createEditButton();
                targetContainer.append(editBtn);
            }
        }
        currentContainer.data('buttons-animation-until', Date.now() + (visibleButtons.length * 80) + 400);
        watchForLateButtons(currentContainer);
    }

    function reorderButtons(container, opts) {
        if (!container) return false;
        var saved = currentContainer;
        currentContainer = container;
        try {
            applyChanges();
        } finally {
            currentContainer = saved;
        }
        return true;
    }

    function refreshController() {
        try {
            if (Lampa.Controller && typeof Lampa.Controller.refresh === 'function') {
                Lampa.Controller.refresh();
            }
        } catch (e) { logDebug('refreshController', e); }
    }

    function openFolder(folder) {
        var wrap = $('<div class="folder-view-wrap"></div>');
        var list = $('<div class="folder-view-list"></div>');
        wrap.append(list);

        function renderFolderButtons() {
            list.empty();
            var allBtns = currentContainer ? currentContainer.find('.full-start__button').not('.button--edit-order, .button--folder') : $();
            var items = [];
            if (Array.isArray(folder.buttons)) {
                folder.buttons.forEach(function(id) {
                    allBtns.each(function() {
                        var $b = $(this);
                        if (getButtonId($b) === id) {
                            items.push($b.clone());
                        }
                    });
                });
            }
            if (!items.length) {
                list.append($('<div class="folder-view-empty buttons-plugin-ui-text">У папці немає кнопок</div>'));
                return;
            }
            items.forEach(function($b) {
                $b.addClass('selector');
                $b.on('hover:enter', function() {
                    closeModalSafe();
                    var orig = findButton(getButtonId($b));
                    if (orig && orig.length) orig.trigger('hover:enter');
                });
                list.append($b);
            });
        }

        renderFolderButtons();

        var toolbar = $('<div class="folder-view-toolbar buttons-plugin-toolbar"></div>');
        var renameBtn = $('<div class="folder-view-tool-btn selector" tabindex="0" title="Перейменувати папку">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>');
        renameBtn.on('hover:enter', function() {
            closeModalSafe();
            setTimeout(function() {
                openTextInputModal({
                    title: 'Перейменувати папку',
                    placeholder: 'Назва папки',
                    value: folder.name || '',
                    onDone: function(val) {
                        if (val) {
                            folder.name = val;
                            var folders = getFolders();
                            var idx = folders.findIndex(function(f) { return f.id === folder.id; });
                            if (idx !== -1) {
                                folders[idx].name = val;
                                setFolders(folders);
                            }
                            applyChanges();
                        }
                        setTimeout(function() { openFolder(folder); }, 200);
                    },
                    onBack: function() {
                        setTimeout(function() { openFolder(folder); }, 200);
                    }
                });
            }, 200);
        });
        var deleteBtn = $('<div class="folder-view-tool-btn selector" tabindex="0" title="Видалити папку">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></div>');
        deleteBtn.on('hover:enter', function() {
            var folders = getFolders();
            var newFolders = folders.filter(function(f) { return f.id !== folder.id; });
            setFolders(newFolders);
            closeModalSafe();
            applyChanges();
        });
        toolbar.append(renameBtn).append(deleteBtn);
        wrap.prepend(toolbar);

        openModalWithEdgeScroll({
            title: folder.name || 'Папка',
            html: wrap,
            size: 'medium',
            scroll_to_center: false,
            onBack: function() {
                closeModalSafe();
                setTimeout(function() { openEditDialog(); }, 200);
            }
        });
        focusModalController();
    }

    function openEditDialog() {
        if (!currentContainer) return;
        var wrap = $('<div class="buttons-editor-wrap"></div>');
        var list = $('<div class="buttons-editor-list"></div>');
        wrap.append(list);

        function renderList() {
            list.empty();
            if (!currentButtons.length) {
                list.append($('<div class="buttons-editor-empty buttons-plugin-ui-text">Немає кнопок для редагування</div>'));
                return;
            }
            currentButtons.forEach(function(btn, idx) {
                var btnId = getButtonId(btn);
                var label = btn.find('span').first().text().trim() || btnId;
                var isHidden = btn.hasClass('hidden');
                var customLabel = getCustomLabels()[btnId] || '';
                var row = $('<div class="buttons-editor-row selector" tabindex="0"></div>');
                var posEl = $('<div class="buttons-editor-pos buttons-plugin-ui-text">' + (idx + 1) + '</div>');
                var iconEl = $('<div class="buttons-editor-icon"></div>');
                var svg = btn.find('svg').first();
                if (svg.length) {
                    iconEl.append(svg.clone());
                } else {
                    iconEl.append($(folderPlaceholderSvgStr()));
                }
                var nameEl = $('<div class="buttons-editor-name buttons-plugin-ui-text"></div>');
                nameEl.text(customLabel || label);
                if (isHidden) {
                    nameEl.addClass('buttons-editor-name--hidden');
                }
                row.append(posEl).append(iconEl).append(nameEl);
                row.on('hover:enter', function() {
                    openItemMenu(btn, btnId, label, customLabel, isHidden, idx);
                });
                list.append(row);
            });
        }

        renderList();

        var toolbar = $('<div class="buttons-editor-toolbar buttons-plugin-toolbar"></div>');
        var upBtn = $('<div class="buttons-editor-tool-btn selector" tabindex="0" title="Вгору">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg></div>');
        upBtn.on('hover:enter', function() {
            var focused = list.find('.selector.focused').first();
            if (!focused.length) return;
            var idx = list.children().index(focused);
            if (idx <= 0) return;
            var tmp = currentButtons[idx - 1];
            currentButtons[idx - 1] = currentButtons[idx];
            currentButtons[idx] = tmp;
            saveOrder();
            applyChanges();
            setTimeout(function() {
                renderList();
                list.children().eq(idx - 1).addClass('selector').focus();
            }, 100);
        });
        var downBtn = $('<div class="buttons-editor-tool-btn selector" tabindex="0" title="Вниз">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>');
        downBtn.on('hover:enter', function() {
            var focused = list.find('.selector.focused').first();
            if (!focused.length) return;
            var idx = list.children().index(focused);
            if (idx < 0 || idx >= currentButtons.length - 1) return;
            var tmp = currentButtons[idx + 1];
            currentButtons[idx + 1] = currentButtons[idx];
            currentButtons[idx] = tmp;
            saveOrder();
            applyChanges();
            setTimeout(function() {
                renderList();
                list.children().eq(idx + 1).addClass('selector').focus();
            }, 100);
        });
        var resetBtn = $('<div class="buttons-editor-tool-btn selector" tabindex="0" title="Скинути порядок">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></div>');
        resetBtn.on('hover:enter', function() {
            setCustomOrder([]);
            setItemOrder([]);
            applyChanges();
            renderList();
        });
        var colorBtn = $('<div class="buttons-editor-tool-btn selector" tabindex="0" title="Колір іконок">' +
            iconSvgPalette() + '</div>');
        colorBtn.on('hover:enter', function() {
            closeModalSafe();
            setTimeout(function() {
                openColorPickerModal(null);
            }, 200);
        });
        var createFolderBtn = $('<div class="buttons-editor-tool-btn selector" tabindex="0" title="Створити папку">' +
            toolbarSvgFolderConfirm() + '</div>');
        createFolderBtn.on('hover:enter', function() {
            closeModalSafe();
            setTimeout(function() {
                openTextInputModal({
                    title: 'Нова папка',
                    placeholder: 'Назва папки',
                    value: '',
                    onDone: function(val) {
                        if (val) {
                            var folders = getFolders();
                            var newFolder = {
                                id: 'folder_' + Date.now(),
                                name: val,
                                buttons: []
                            };
                            folders.push(newFolder);
                            setFolders(folders);
                            applyChanges();
                        }
                        setTimeout(function() { openEditDialog(); }, 200);
                    },
                    onBack: function() {
                        setTimeout(function() { openEditDialog(); }, 200);
                    }
                });
            }, 200);
        });
        toolbar.append(upBtn).append(downBtn).append(resetBtn).append(colorBtn).append(createFolderBtn);
        wrap.prepend(toolbar);

        openModalWithEdgeScroll({
            title: 'Редактор кнопок',
            html: wrap,
            size: 'medium',
            scroll_to_center: false,
            onBack: function() {
                closeModalSafe();
            }
        });
        focusModalController();
    }

    function openItemMenu(btn, btnId, label, customLabel, isHidden, idx) {
        closeModalSafe();
        var wrap = $('<div class="item-menu-wrap"></div>');
        var list = $('<div class="item-menu-list"></div>');
        wrap.append(list);

        var items = [];

        items.push({
            icon: isHidden
                ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
            label: isHidden ? 'Показати' : 'Приховати',
            action: function() {
                var hidden = getHiddenButtons();
                if (isHidden) {
                    hidden = hidden.filter(function(id) { return id !== btnId; });
                } else {
                    hidden.push(btnId);
                }
                setHiddenButtons(hidden);
                applyChanges();
                setTimeout(function() { openEditDialog(); }, 200);
            }
        });

        items.push({
            icon: iconSvgPalette(),
            label: 'Колір іконки',
            action: function() {
                setTimeout(function() {
                    openColorPickerModal(btnId);
                }, 200);
            }
        });

        items.push({
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
            label: 'Іконка',
            action: function() {
                var defaultIcon = getDefaultIconForButton(btnId);
                setTimeout(function() {
                    openIconPicker(btn, btnId, defaultIcon);
                }, 200);
            }
        });

        items.push({
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
            label: 'Назва',
            action: function() {
                setTimeout(function() {
                    openTextInputModal({
                        title: 'Назва кнопки',
                        placeholder: 'Нова назва',
                        value: customLabel || label,
                        onDone: function(val) {
                            var labels = getCustomLabels();
                            if (val) {
                                labels[btnId] = val;
                            } else {
                                delete labels[btnId];
                            }
                            setCustomLabels(labels);
                            applyChanges();
                            setTimeout(function() { openEditDialog(); }, 200);
                        },
                        onBack: function() {
                            setTimeout(function() { openEditDialog(); }, 200);
                        }
                    });
                }, 200);
            }
        });

        var folders = getFolders();
        if (folders.length) {
            items.push({
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>',
                label: 'У папку',
                action: function() {
                    setTimeout(function() { openFolderSelectForButton(btnId); }, 200);
                }
            });
        }

        items.push({
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
            label: 'Видалити з папки',
            action: function() {
                var folders = getFolders();
                folders.forEach(function(f) {
                    if (Array.isArray(f.buttons)) {
                        f.buttons = f.buttons.filter(function(id) { return id !== btnId; });
                    }
                });
                setFolders(folders);
                applyChanges();
                setTimeout(function() { openEditDialog(); }, 200);
            }
        });

        items.forEach(function(item) {
            var row = $('<div class="selector item-menu-row" tabindex="0"></div>');
            var iconEl = $('<div class="item-menu-icon">' + item.icon + '</div>');
            var labelEl = $('<div class="item-menu-label buttons-plugin-ui-text">' + escapeHtml(item.label) + '</div>');
            row.append(iconEl).append(labelEl);
            row.on('hover:enter', function() {
                item.action();
            });
            list.append(row);
        });

        openModalWithEdgeScroll({
            title: label,
            html: wrap,
            size: 'small',
            scroll_to_center: false,
            onBack: function() {
                closeModalSafe();
                setTimeout(function() { openEditDialog(); }, 200);
            }
        });
        focusModalController();
    }

    function openFolderSelectForButton(btnId) {
        closeModalSafe();
        var folders = getFolders();
        if (!folders.length) {
            setTimeout(function() { openEditDialog(); }, 200);
            return;
        }
        var wrap = $('<div class="folder-select-wrap"></div>');
        var list = $('<div class="folder-select-list"></div>');
        wrap.append(list);
        folders.forEach(function(folder) {
            var row = $('<div class="selector folder-select-row" tabindex="0"></div>');
            var iconEl = $('<div class="folder-select-icon">' + folderPlaceholderSvgStr() + '</div>');
            var nameEl = $('<div class="folder-select-name buttons-plugin-ui-text">' + escapeHtml(folder.name || 'Папка') + '</div>');
            row.append(iconEl).append(nameEl);
            row.on('hover:enter', function() {
                if (!Array.isArray(folder.buttons)) folder.buttons = [];
                if (folder.buttons.indexOf(btnId) === -1) {
                    folder.buttons.push(btnId);
                }
                var all = getFolders();
                var idx = all.findIndex(function(f) { return f.id === folder.id; });
                if (idx !== -1) all[idx] = folder;
                setFolders(all);
                applyChanges();
                closeModalSafe();
                setTimeout(function() { openEditDialog(); }, 200);
            });
            list.append(row);
        });
        openModalWithEdgeScroll({
            title: 'Виберіть папку',
            html: wrap,
            size: 'small',
            scroll_to_center: false,
            onBack: function() {
                closeModalSafe();
                setTimeout(function() { openEditDialog(); }, 200);
            }
        });
        focusModalController();
    }

    function addSettingsComponent() {
        var settingsApi = Lampa.SettingsApi || Lampa.Settings;
        if (!settingsApi || typeof settingsApi.addComponent !== 'function') {
            setTimeout(addSettingsComponent, 500);
            return;
        }
        var manifest = {};
        try {
            manifest = Lampa.Manifest && Lampa.Manifest.plugins && Lampa.Manifest.plugins.buttons ? Lampa.Manifest.plugins.buttons : {};
        } catch (e) { logDebug('addSettingsComponent manifest', e); }

        var componentName = 'buttons_plugin';
        var componentTitle = 'Кнопки';

        settingsApi.addComponent({
            component: componentName,
            name: componentTitle,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="7" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="17" cy="12" r="1"/></svg>'
        });

        settingsApi.addParam({
            component: componentName,
            param: {
                name: 'editor_enabled',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Редактор кнопок',
                description: 'Показувати кнопку редагування порядку біля кнопок балансерів'
            },
            onChange: function(value) {
                Lampa.Storage.set(STORAGE_KEYS.editor_enabled, value);
                if (currentContainer && currentContainer.length) {
                    var target = currentContainer.find('.full-start-new__buttons');
                    if (value === false) {
                        target.find('.button--edit-order').remove();
                    } else {
                        applyChanges();
                    }
                }
            }
        });

        settingsApi.addParam({
            component: componentName,
            param: {
                name: 'reset_button_order',
                type: 'button',
                default: ''
            },
            field: {
                name: 'Скинути порядок кнопок',
                description: 'Очистити збережений порядок кнопок'
            },
            onChange: function() {
                setCustomOrder([]);
                setItemOrder([]);
                Lampa.Storage.set(STORAGE_KEYS.stable_map, {});
                if (currentContainer && currentContainer.length) applyChanges();
                Lampa.Noty.show('Порядок кнопок скинуто');
            }
        });
    }

    function init() {
        Lampa.Storage.set(STORAGE_KEYS.plugin_version, PLUGIN_VERSION);
        addSettingsComponent();

        Lampa.Listener.follow(FULL_EVENT_TYPE, function(e) {
            if (e.type === FULL_EVENT_TYPE && e.component === 'full') {
                setTimeout(function() {
                    currentContainer = $('.full-start');
                    if (currentContainer.length) {
                        applyChanges();
                    }
                }, DELAY_FULL_CARD_READY_MS);
            }
        });
    }

    if (window.Lampa && Lampa.Listener) {
        if (Lampa.Manifest && Lampa.Manifest.app_digital >= 100) {
            init();
        } else {
            Lampa.Listener.follow('app', function(e) {
                if (e.type === 'ready') init();
            });
            setTimeout(function() {
                if (!Lampa.Storage.get(STORAGE_KEYS.plugin_version)) init();
            }, 1000);
        }
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            if (window.Lampa && Lampa.Listener) init();
        });
    }
})();
