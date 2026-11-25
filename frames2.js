(function () {
    'use strict';

    if (window.plugin_lampa_frames_installed) return;
    window.plugin_lampa_frames_installed = true;

    var manifest = {
        type: 'other',
        version: '1.4.0',
        name: 'Frames',
        description: 'Кадри та скріншоти з фільмів, серіалів, аніме, мультфільмів і дорам',
        author: 'DeepSeek 🌚',
        component: 'lampa_frames'
    };

    Lampa.Manifest.plugins = manifest;

    function getCurrentLang() {
        try {
            return Lampa.Storage.get('language', 'uk') || 'uk';
        } catch (e) {
            return 'uk';
        }
    }

    function getLocalizedMeta() {
    var lang = getCurrentLang();
    var name = Lampa.Lang.translate('frames_settings_title');
    var descr = Lampa.Lang.translate('frames_enable_descr');
    if (!name || name === 'frames_settings_title') {
        name = (lang === 'en') ? 'Frames & Screenshots'
             : (lang === 'ru') ? 'Кадры и скриншоты'
             : (lang === 'be') ? 'Кадры і скрыншоты'
             : 'Кадри та скріншоти';
    }
    if (!descr || descr === 'frames_enable_descr') {
        descr = (lang === 'en') ? 'Display frames block on movie, series, cartoon and drama cards'
              : (lang === 'ru') ? 'Отображать блок кадров в карточках фильмов, сериалов, мультфильмов и дорам'
              : (lang === 'be') ? 'Адлюстроўваць блок кадраў у картках фільмаў, серыялаў, мультфільмаў і дорам'
              : 'Відображати блок кадрів у картках фільмів, серіалів, мультфільмів та дорам';
    }
    return { name: name, descr: descr, author: manifest.author };
}

    function updatePluginMeta() {
        if (!window.Lampa || !Lampa.Plugins || !Lampa.Plugins.get) return;
        try {
            var plugins = Lampa.Plugins.get();
            var meta = getLocalizedMeta();
            var changed = false;
            for (var i = 0; i < plugins.length; i++) {
                var plugin = plugins[i];
                var url = String(plugin && plugin.url || '');
                if (/\/frames2(?:\.v\d+)?\.js(?:[?#].*)?$/i.test(url)) {
                    if (plugin.name !== meta.name) {
                        plugin.name = meta.name;
                        changed = true;
                    }
                    if (plugin.descr !== meta.descr) {
                        plugin.descr = meta.descr;
                        changed = true;
                    }
                    if (plugin.author !== meta.author) {
                        plugin.author = meta.author;
                        changed = true;
                    }
                }
            }
            if (changed && Lampa.Plugins.save) Lampa.Plugins.save();
        } catch (e) {}
    }

    Lampa.Lang.add({
        frames_title: {
            uk: 'Кадри',
            ru: 'Кадры',
            en: 'Frames',
            be: 'Кадры'
        },
        frames_settings_title: {
            uk: 'Кадри та скріншоти',
            ru: 'Кадры и скриншоты',
            en: 'Frames & Screenshots',
            be: 'Кадры і скрыншоты'
        },
        frames_enable: {
            uk: 'Показувати кадри',
            ru: 'Показывать кадры',
            en: 'Show frames',
            be: 'Паказваць кадры'
        },
        frames_enable_descr: {
            uk: 'Відображати блок кадрів у картках фільмів, серіалів, мультфільмів та дорам',
            ru: 'Отображать блок кадров в карточках фильмов, сериалов, мультфильмов и дорам',
            en: 'Display frames block on movie, series, cartoon and drama cards',
            be: 'Адлюстроўваць блок кадраў у картках фільмаў, серыялаў, мультфільмаў і дорам'
        },
        frames_ambient: {
            uk: 'Фон при наведенні',
            ru: 'Фон при наведении',
            en: 'Background on hover',
            be: 'Фон пры навядзенні'
        },
        frames_ambient_descr: {
            uk: 'Змінювати фонове зображення екрана при наведенні на кадр',
            ru: 'Изменять фоновое изображение экрана при наведении на кадр',
            en: 'Change screen background when hovering over a frame',
            be: 'Змяняць фонавае выява экрана пры навядзенні на кадр'
        },
        frames_limit: {
            uk: 'Кількість кадрів',
            ru: 'Количество кадров',
            en: 'Number of frames',
            be: 'Колькасць кадраў'
        },
        frames_limit_descr: {
            uk: 'Обмеження кількості завантажуваних кадрів для оптимальної продуктивності',
            ru: 'Ограничение количества загружаемых кадров для оптимальной производительности',
            en: 'Limit the number of loaded frames for better performance',
            be: 'Абмежаванне колькасці загружаемых кадраў для аптымальнай прадукцыйнасці'
        },
        frames_limit_12: {
            uk: '12 кадрів (швидко)',
            ru: '12 кадров (быстро)',
            en: '12 frames (fast)',
            be: '12 кадраў (хутка)'
        },
        frames_limit_24: {
            uk: '24 кадри (рекомендовано)',
            ru: '24 кадра (рекомендуется)',
            en: '24 frames (recommended)',
            be: '24 кадры (рэкамендуецца)'
        },
        frames_limit_36: {
            uk: '36 кадрів (максимум)',
            ru: '36 кадров (максимум)',
            en: '36 frames (maximum)',
            be: '36 кадраў (максимум)'
        },
        frames_quality: {
            uk: 'Якість мініатюр',
            ru: 'Качество миниатюр',
            en: 'Thumbnail quality',
            be: 'Якасць мініяцюр'
        },
        frames_quality_descr: {
            uk: 'Роздільність завантажуваних прев’ю в рядку (повний розмір відкривається натисканням)',
            ru: 'Разрешение загружаемых превью в строке (полный размер открывается по нажатию)',
            en: 'Resolution of loaded previews in the row (full size opens on click)',
            be: 'Раздзяленне загружаемых прэв’ю ў радку (поўны памер адкрываецца націскам)'
        },
        frames_quality_w500: {
            uk: 'Середнє (w500)',
            ru: 'Среднее (w500)',
            en: 'Medium (w500)',
            be: 'Сярэдняе (w500)'
        },
        frames_quality_w780: {
            uk: 'Високе (w780, чітко)',
            ru: 'Высокое (w780, четко)',
            en: 'High (w780, sharp)',
            be: 'Высокае (w780, выразна)'
        },
        frames_viewer_hint: {
            uk: 'Свайпніть або стрілки вліво / вправо для перемикання · Натисніть [Назад] для виходу',
            ru: 'Свайпните или стрелки Влево / Вправо для переключения · Нажмите [Назад] для выхода',
            en: 'Swipe or use Left / Right arrows to switch · Press [Back] to exit',
            be: 'Свайпніце або стрэлкі ўлева / ўправа для пераключэння · Націсніце [Назад] для выхаду'
        },
        frames_fallback_movie: {
            uk: 'Фільм',
            ru: 'Фильм',
            en: 'Movie',
            be: 'Фільм'
        },
        frames_fallback_drama: {
            uk: 'Дорама',
            ru: 'Дорама',
            en: 'Drama',
            be: 'Дорама'
        }
    });

    var Nav = {
        canmove: function (dir) {
            var n = window.Navigator || (typeof Navigator !== 'undefined' ? Navigator : null);
            return (n && typeof n.canmove === 'function') ? n.canmove(dir) : false;
        },
        move: function (dir) {
            var n = window.Navigator || (typeof Navigator !== 'undefined' ? Navigator : null);
            return (n && typeof n.move === 'function') ? n.move(dir) : false;
        },
        focused: function (elem) {
            var n = window.Navigator || (typeof Navigator !== 'undefined' ? Navigator : null);
            if (n && typeof n.focused === 'function') n.focused(elem);
        }
    };

    var Cache = {
        data: {},
        keys: [],
        max: 50,
        get: function (key) {
            if (this.data[key]) {
                var idx = this.keys.indexOf(key);
                if (idx >= 0) {
                    this.keys.splice(idx, 1);
                    this.keys.push(key);
                }
                return this.data[key];
            }
            return null;
        },
        set: function (key, value) {
            if (this.keys.length >= this.max) {
                var oldest = this.keys.shift();
                delete this.data[oldest];
            }
            this.keys.push(key);
            this.data[key] = value;
        }
    };

    var FrameViewer = {
        active: false,
        frames: [],
        index: 0,
        title: '',
        html: null,
        prevController: null,
        lastFocusedElem: null,
        touchStartX: 0,
        touchStartY: 0,

        open: function (frames, startIndex, title, lastElem) {
            if (!frames || !frames.length) return;
            var _this = this;
            this.frames = frames;
            this.index = Math.max(0, Math.min(startIndex || 0, frames.length - 1));
            this.title = title || '';
            this.lastFocusedElem = lastElem || null;

            try {
                this.prevController = Lampa.Controller.enabled().name;
            } catch (e) {
                this.prevController = 'content';
            }
            this.active = true;

            if (this.html) this.html.remove();

            this.html = $(
                '<div class="frames-viewer">' +
                    '<div class="frames-viewer__head">' +
                        '<div class="frames-viewer__title">' + this.title + '</div>' +
                        '<div class="frames-viewer__counter">' + (this.index + 1) + ' / ' + this.frames.length + '</div>' +
                    '</div>' +
                    '<div class="frames-viewer__body">' +
                        '<div class="frames-viewer__loader hide"></div>' +
                        '<img class="frames-viewer__img" />' +
                    '</div>' +
                    '<div class="frames-viewer__arrow frames-viewer__arrow--left">' +
                        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                            '<polyline points="15 18 9 12 15 6"></polyline>' +
                        '</svg>' +
                    '</div>' +
                    '<div class="frames-viewer__arrow frames-viewer__arrow--right">' +
                        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                            '<polyline points="9 18 15 12 9 6"></polyline>' +
                        '</svg>' +
                    '</div>' +
                    '<div class="frames-viewer__footer">' +
                        '<span>' + Lampa.Lang.translate('frames_viewer_hint') + '</span>' +
                    '</div>' +
                '</div>'
            );

            $('body').append(this.html);

            this.html.on('touchstart', function (e) {
                if (e.originalEvent.touches && e.originalEvent.touches.length === 1) {
                    _this.touchStartX = e.originalEvent.touches[0].clientX;
                    _this.touchStartY = e.originalEvent.touches[0].clientY;
                }
            });

            this.html.on('touchend', function (e) {
                if (!e.originalEvent.changedTouches || e.originalEvent.changedTouches.length !== 1) return;
                var endX = e.originalEvent.changedTouches[0].clientX;
                var endY = e.originalEvent.changedTouches[0].clientY;
                var diffX = endX - _this.touchStartX;
                var diffY = endY - _this.touchStartY;

                if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
                    if (diffX > 0) _this.prev();
                    else _this.next();
                }
            });

            this.showFrame(this.index);

            Lampa.Controller.add('frames_viewer', {
                toggle: function () {},
                left: function () { _this.prev(); },
                right: function () { _this.next(); },
                up: function () { _this.close(); },
                down: function () { _this.close(); },
                back: function () { _this.close(); },
                enter: function () { _this.next(); }
            });

            Lampa.Controller.toggle('frames_viewer');
        },

        showFrame: function (idx) {
            var _this = this;
            this.index = (idx + this.frames.length) % this.frames.length;
            var item = this.frames[this.index];
            var imgUrl = item.original || item.thumb;

            this.html.find('.frames-viewer__counter').text((this.index + 1) + ' / ' + this.frames.length);

            var imgElem = this.html.find('.frames-viewer__img');
            var loader = this.html.find('.frames-viewer__loader');

            loader.removeClass('hide');
            imgElem.css('opacity', '0.2');

            var pre = new Image();
            pre.onload = function () {
                if (_this.active) {
                    imgElem.attr('src', imgUrl);
                    imgElem.css('opacity', '1');
                    loader.addClass('hide');
                }
            };
            pre.onerror = function () {
                if (_this.active) {
                    imgElem.attr('src', item.thumb);
                    imgElem.css('opacity', '1');
                    loader.addClass('hide');
                }
            };
            pre.src = imgUrl;

            var nextItem = this.frames[(this.index + 1) % this.frames.length];
            var prevItem = this.frames[(this.index - 1 + this.frames.length) % this.frames.length];
            if (nextItem) { var n = new Image(); n.src = nextItem.original || nextItem.thumb; }
            if (prevItem) { var p = new Image(); p.src = prevItem.original || prevItem.thumb; }
        },

        next: function () {
            this.showFrame(this.index + 1);
        },

        prev: function () {
            this.showFrame(this.index - 1);
        },

        close: function () {
            this.active = false;
            var _this = this;
            if (this.html) {
                this.html.fadeOut(150, function () {
                    if (_this.html) {
                        _this.html.remove();
                        _this.html = null;
                    }
                });
            }

            Lampa.Controller.toggle(this.prevController || 'items_line');
            if (this.lastFocusedElem) {
                Nav.focused(this.lastFocusedElem);
            }
        }
    };

    function fetchTmdbFrames(type, id, onResult) {
        var cacheKey = 'tmdb_' + type + '_' + id;
        var cached = Cache.get(cacheKey);
        if (cached) return onResult(cached);

        var limit = parseInt(Lampa.Storage.get('frames_limit', '24'), 10) || 24;
        var quality = Lampa.Storage.get('frames_quality', 'w780');

        var u = type + '/' + id + '/images?api_key=' + Lampa.TMDB.key();
        var url = Lampa.TMDB.api(u);

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            timeout: 10000,
            success: function (res) {
                var backdrops = (res && res.backdrops) ? res.backdrops : [];
                if (!backdrops.length && res && res.stills) backdrops = res.stills;

                var sorted = backdrops.slice().sort(function (a, b) {
                    return (b.vote_count || 0) - (a.vote_count || 0);
                });

                var frames = [];
                for (var i = 0; i < sorted.length; i++) {
                    var b = sorted[i];
                    if (b && b.file_path) {
                        frames.push({
                            thumb: Lampa.TMDB.image('t/p/' + quality + b.file_path),
                            original: Lampa.TMDB.image('t/p/original' + b.file_path),
                            width: b.width,
                            height: b.height,
                            ratio: b.aspect_ratio || 1.77
                        });
                    }
                    if (frames.length >= limit) break;
                }

                Cache.set(cacheKey, frames);
                onResult(frames);
            },
            error: function () {
                onResult([]);
            }
        });
    }

    function fetchAdramaFrames(releaseData, onResult) {
        var id = (releaseData.summary && releaseData.summary.id) || releaseData.id;
        var cacheKey = 'adrama_' + id;
        var cached = Cache.get(cacheKey);
        if (cached) return onResult(cached);

        var limit = parseInt(Lampa.Storage.get('frames_limit', '24'), 10) || 24;
        var frames = [];

        var det = releaseData.details || {};
        var media = det.media || releaseData.media || {};
        var gallery = media.gallery || [];
        var originals = media.gallery_originals || [];

        if (gallery.length) {
            for (var i = 0; i < gallery.length && i < limit; i++) {
                frames.push({
                    thumb: gallery[i],
                    original: originals[i] || gallery[i]
                });
            }
        }

        if (!frames.length) {
            var sum = releaseData.summary || {};
            var titleEn = (sum.titles && sum.titles.en) || '';
            var titleRu = (sum.titles && sum.titles.ru) || sum.title || '';
            var year = sum.year || '';
            var query = titleEn || titleRu;

            if (query) {
                searchTmdbFallback(query, year, function (tmdbFrames) {
                    Cache.set(cacheKey, tmdbFrames);
                    onResult(tmdbFrames);
                });
                return;
            }
        }

        Cache.set(cacheKey, frames);
        onResult(frames);
    }

    function searchTmdbFallback(query, year, onResult) {
        var u = 'search/multi?api_key=' + Lampa.TMDB.key() + '&query=' + encodeURIComponent(query);
        if (year) u += '&year=' + encodeURIComponent(year);
        var sUrl = Lampa.TMDB.api(u);

        $.ajax({
            url: sUrl,
            type: 'GET',
            dataType: 'json',
            timeout: 8000,
            success: function (res) {
                var results = (res && res.results) ? res.results : [];
                if (results.length) {
                    var first = results[0];
                    var type = first.media_type === 'tv' ? 'tv' : 'movie';
                    fetchTmdbFrames(type, first.id, onResult);
                } else {
                    onResult([]);
                }
            },
            error: function () {
                onResult([]);
            }
        });
    }

    function buildFramesLine(frames, title, targetScroll, onFocus) {
        if (!frames || !frames.length) return null;

        var line = $(
            '<div class="items-line layer--visible layer--render items-line--frames">' +
                '<div class="items-line__head">' +
                    '<div class="items-line__title">' + Lampa.Lang.translate('frames_title') + ' <span class="items-line__count">(' + frames.length + ')</span></div>' +
                '</div>' +
                '<div class="items-line__body"></div>' +
            '</div>'
        );

        var lineScroll = new Lampa.Scroll({ horizontal: true, step: 350 });
        lineScroll.body().addClass('items-cards items-cards--frames');

        lineScroll.onWheel = function (step) {
            if (step > 0) Nav.move('right');
            else if (Nav.canmove('left')) Nav.move('left');
            else Lampa.Controller.toggle('menu');
        };

        var ambient = Lampa.Storage.get('frames_ambient', true);

        frames.forEach(function (frame, idx) {
            var card = $(
                '<div class="card card--wide card--frame selector layer--visible layer--render">' +
                    '<div class="card__view">' +
                        '<img class="card__img" src="' + frame.thumb + '" loading="lazy" />' +
                        '<div class="frame__number">' + (idx + 1) + '</div>' +
                    '</div>' +
                '</div>'
            );

            var img = card.find('.card__img');
            img.on('load', function () {
                $(this).addClass('loaded');
            });

            card.on('hover:focus', function () {
                lineScroll.update(card, true);
                if (onFocus) onFocus(line);
                else if (targetScroll && targetScroll.update) targetScroll.update(line);

                if (ambient) {
                    Lampa.Background.change(frame.thumb);
                }
            }).on('hover:hover', function () {
                Nav.focused(card[0]);
            }).on('hover:enter', function () {
                FrameViewer.open(frames, idx, title, card[0]);
            });

            lineScroll.append(card);
        });

        line.find('.items-line__body').append(lineScroll.render());
        return { line: line, lineScroll: lineScroll };
    }

    function createFramesItem(comp, line, lineScroll) {
        var item = {
            html: line[0],
            scroll: lineScroll,
            components: [],
            last: null,
            render: function (js) {
                return js ? this.html : $(this.html);
            },
            use: function (module) {
                this.components.push(module);
            },
            emit: function (event) {
                var name = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
                this.components.forEach(function (c) {
                    if (typeof c[name] === 'function') c[name]();
                });
            },
            toggle: function () {
                var _this = this;
                var cards = line.find('.items-cards');
                if (!_this.last) {
                    _this.last = line.find('.card--frame:first')[0];
                }
                Lampa.Controller.add('items_line', {
                    link: _this,
                    toggle: function () {
                        Lampa.Controller.collectionSet(cards);
                        Lampa.Controller.collectionFocus(_this.last || false, cards);
                        _this.emit('toggle');
                    },
                    right: function () {
                        if (Nav.canmove('right')) Nav.move('right');
                    },
                    left: function () {
                        if (Nav.canmove('left')) Nav.move('left');
                        else _this.emit('left');
                    },
                    down: function () {
                        _this.emit('down');
                    },
                    up: function () {
                        _this.emit('up');
                    },
                    back: function () {
                        _this.emit('back');
                    }
                });
                Lampa.Controller.toggle('items_line');
            }
        };

        if (comp && typeof comp.emit === 'function') {
            item.use({
                onDown: comp.emit.bind(comp, 'down'),
                onUp: comp.emit.bind(comp, 'up'),
                onBack: comp.emit.bind(comp, 'back'),
                onLeft: comp.emit.bind(comp, 'left'),
                onActive: function () {
                    if (comp.items) comp.active = comp.items.indexOf(item);
                },
                onToggle: function () {
                    if (comp.scroll && comp.scroll.update) comp.scroll.update(item.render(true));
                }
            });
        }

        return item;
    }

    function init() {
        updatePluginMeta();
        setTimeout(updatePluginMeta, 1000);
        setTimeout(updatePluginMeta, 3000);

        if (Lampa.Listener && Lampa.Listener.follow) {
            Lampa.Listener.follow('settings', function (e) {
                if (e && e.type === 'change' && e.name === 'language') {
                    updatePluginMeta();
                    setTimeout(updatePluginMeta, 500);
                }
            });
            Lampa.Listener.follow('language', function () {
                updatePluginMeta();
                setTimeout(updatePluginMeta, 500);
            });
        }

        if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
            try {
                Lampa.Storage.listener.follow('change', function (e) {
                    if (e && e.name === 'language') {
                        updatePluginMeta();
                        setTimeout(updatePluginMeta, 500);
                    }
                });
            } catch (err) {}
        }

        if (!$('link[href*="frames.css"]').length && !$('#frames-styles').length) {
            $('head').append('<style id="frames-styles">' +
'.items-line--frames{position:relative;margin-bottom:1.5em}' +
'.items-cards--frames{display:-webkit-box!important;display:-webkit-flex!important;display:flex!important;-webkit-flex-direction:row!important;flex-direction:row!important;-webkit-flex-wrap:nowrap!important;flex-wrap:nowrap!important;-webkit-box-align:start!important;-webkit-align-items:flex-start!important;align-items:flex-start!important;padding:0.8em 1.5em 1.4em 1.5em!important}' +
'.items-cards--frames .card--frame{-webkit-flex-shrink:0!important;flex-shrink:0!important;width:20em!important;margin-right:1.2em!important;cursor:pointer}' +
'.card--frame .card__view{padding-bottom:56.25%!important;position:relative!important;-webkit-border-radius:0.8em!important;border-radius:0.8em!important;background:#141416!important;transition:transform 0.2s ease,box-shadow 0.2s ease!important}' +
'.card--frame .card__img{position:absolute!important;top:0!important;left:0!important;width:100%!important;height:100%!important;object-fit:cover!important;-webkit-border-radius:0.8em!important;border-radius:0.8em!important;transition:transform 0.25s ease,opacity 0.3s ease!important;opacity:0}' +
'.card--frame .card__img.loaded{opacity:1!important}' +
'.card--frame.focus .card__view{outline:none!important}' +
'.card--frame.focus .card__view::after{content:""!important;position:absolute!important;top:-0.4em!important;left:-0.4em!important;right:-0.4em!important;bottom:-0.4em!important;border:0.3em solid #fff!important;-webkit-border-radius:1.2em!important;border-radius:1.2em!important;box-shadow:0 8px 24px rgba(0,0,0,0.85)!important;z-index:5!important;pointer-events:none!important;-webkit-animation:animation-card-focus 0.2s ease!important;animation:animation-card-focus 0.2s ease!important}' +
'.card--frame.hover .card__view::after{border-color:rgba(255,255,255,0.5)!important}' +
'.card--frame.focus .card__img{transform:scale(1.02)!important}' +
'.card--frame .frame__number{position:absolute;bottom:0.5em;right:0.6em;padding:0.15em 0.5em;background:rgba(0,0,0,0.65);border-radius:0.3em;font-size:0.8em;font-weight:600;color:#fff;pointer-events:none;z-index:2}' +
'.items-line__count{font-size:0.75em;color:rgba(255,255,255,0.5);font-weight:400;margin-left:0.4em}' +
'.frames-viewer{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.94);z-index:10000;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;user-select:none;-webkit-user-select:none;animation:frames-fade-in 0.2s ease-out}' +
'@keyframes frames-fade-in{from{opacity:0}to{opacity:1}}' +
'.frames-viewer__head{position:absolute;top:2em;left:3.5em;right:3.5em;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center;z-index:2}' +
'.frames-viewer__title{font-size:1.6em;font-weight:700;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,0.9);max-width:75vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
'.frames-viewer__counter{font-size:1.3em;color:rgba(255,255,255,0.8);font-weight:600;background:rgba(255,255,255,0.12);padding:0.2em 0.8em;border-radius:0.4em}' +
'.frames-viewer__body{position:relative;width:90vw;height:80vh;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}' +
'.frames-viewer__img{max-width:100%;max-height:100%;object-fit:contain;border-radius:0.6em;box-shadow:0 10px 40px rgba(0,0,0,0.85);transition:opacity 0.2s ease}' +
'.frames-viewer__arrow{position:absolute;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%);width:3.8em;height:3.8em;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;color:rgba(255,255,255,0.7);background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.15);-webkit-border-radius:50%;border-radius:50%;z-index:10;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,0.6);transition:opacity 0.2s ease,background 0.2s ease,transform 0.2s ease}' +
'.frames-viewer__arrow svg{width:2.2em;height:2.2em;display:block}' +
'.frames-viewer__arrow--left{left:2em}' +
'.frames-viewer__arrow--right{right:2em}' +
'.frames-viewer__footer{position:absolute;bottom:2em;color:rgba(255,255,255,0.5);font-size:1.05em;text-align:center;z-index:2}' +
'.frames-viewer__loader{position:absolute;width:3.5em;height:3.5em;border:4px solid rgba(255,255,255,0.2);border-top-color:#fff;border-radius:50%;animation:frames-spin 0.8s linear infinite;z-index:3}' +
'@keyframes frames-spin{to{transform:rotate(360deg)}}' +
'</style>');
        }

        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite' || !Lampa.Storage.get('frames_enable', true)) return;

            var movie = e.data && e.data.movie;
            if (!movie || !movie.id) return;

            var comp = e.link || (e.object && e.object.activity && e.object.activity.component) || (Lampa.Activity.active() && Lampa.Activity.active().activity && Lampa.Activity.active().activity.component);
            if (!comp) return;

            var scroll = comp.scroll;
            if (!scroll) return;

            if (scroll.render().find('.items-line--frames').length) return;

            var isTV = (e.object && e.object.method === 'tv') || Boolean(movie.number_of_seasons !== undefined || movie.first_air_date);
            var type = isTV ? 'tv' : 'movie';
            var title = movie.title || movie.name || Lampa.Lang.translate('frames_fallback_movie');

            fetchTmdbFrames(type, movie.id, function (frames) {
                if (!frames || !frames.length) return;
                if (scroll.render().find('.items-line--frames').length) return;

                var lineData = buildFramesLine(frames, title, scroll, function (lineElem) {
                    scroll.update(lineElem);
                });
                if (!lineData) return;

                var line = lineData.line;
                var lineScroll = lineData.lineScroll;
                var item = createFramesItem(comp, line, lineScroll);

                line.find('.card--frame').on('hover:focus', function () {
                    item.last = this;
                    item.emit('active');
                });

                if (comp.rows && comp.items && comp.items.length < comp.rows.length) {
                    var add = comp.rows.slice(comp.items.length);
                    comp.fragment = document.createDocumentFragment();
                    add.forEach(comp.emit.bind(comp, 'createAndAppend'));
                    comp.scroll.append(comp.fragment);
                }

                var insertIdx = -1;
                if (comp.items && comp.items.length) {
                    for (var i = 0; i < comp.items.length; i++) {
                        var it = comp.items[i];
                        var itHtml = it && it.render ? $(it.render()) : null;
                        if (itHtml && itHtml.length) {
                            if (itHtml.find('.card--simular, .card--recomend, .card--collection').length > 0) {
                                insertIdx = i;
                                break;
                            }
                            var t = (it.data && it.data.title) || itHtml.find('.items-line__title').text() || '';
                            if (t && (t.indexOf('Рекоменд') >= 0 || t.indexOf('Похож') >= 0 || t.indexOf('Коллекц') >= 0 ||
                                      t.indexOf('Similar') >= 0 || t.indexOf('Recom') >= 0 || t.indexOf('Collection') >= 0)) {
                                insertIdx = i;
                                break;
                            }
                        }
                    }
                }

                if (insertIdx >= 0 && comp.items) {
                    line.insertBefore($(comp.items[insertIdx].render()));
                    comp.items.splice(insertIdx, 0, item);
                    if (comp.active >= insertIdx) comp.active++;
                } else if (comp.items) {
                    var container = scroll.render().find('.scroll__body').first();
                    if (!container.length) container = scroll.render();
                    container.append(line);
                    comp.items.push(item);
                } else {
                    var container = scroll.render().find('.scroll__body').first();
                    if (!container.length) container = scroll.render();
                    container.append(line);
                    Lampa.Controller.collectionAppend(line.find('.selector'));
                }

                if (Lampa.Layer && Lampa.Layer.update) Lampa.Layer.update();
                if (Lampa.Layer && Lampa.Layer.visible) Lampa.Layer.visible(scroll.render(true));
            });
        });

        Lampa.Listener.follow('adrama_card', function (e) {
            if (e.type !== 'complite' || !Lampa.Storage.get('frames_enable', true)) return;
            if (!e.release || !e.scroll) return;

            if (e.scroll.render().find('.items-line--frames').length) return;

            var sum = e.release.summary || {};
            var title = (sum.titles && sum.titles.ru) || (sum.titles && sum.titles.en) || sum.title || Lampa.Lang.translate('frames_fallback_drama');

            fetchAdramaFrames(e.release, function (frames) {
                if (!frames || !frames.length) return;
                if (e.scroll.render().find('.items-line--frames').length) return;

                var lineData = buildFramesLine(frames, title, e.scroll, function (lineElem) {
                    e.scroll.update(lineElem);
                });
                if (!lineData) return;

                var line = lineData.line;

                var commentsLine = e.scroll.render().find('.adrama-comments-line');
                if (commentsLine.length) {
                    commentsLine.before(line);
                } else {
                    e.scroll.append(line);
                }

                Lampa.Controller.collectionAppend(line.find('.selector'));

                if (Lampa.Layer && Lampa.Layer.update) Lampa.Layer.update();
                if (Lampa.Layer && Lampa.Layer.visible) Lampa.Layer.visible(e.scroll.render(true));
            });
        });

        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addComponent({
                component: 'frames_settings',
                name: Lampa.Lang.translate('frames_settings_title'),
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>'
            });

            Lampa.SettingsApi.addParam({
                component: 'frames_settings',
                param: {
                    name: 'frames_enable',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: Lampa.Lang.translate('frames_enable'),
                    description: Lampa.Lang.translate('frames_enable_descr')
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'frames_settings',
                param: {
                    name: 'frames_ambient',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: Lampa.Lang.translate('frames_ambient'),
                    description: Lampa.Lang.translate('frames_ambient_descr')
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'frames_settings',
                param: {
                    name: 'frames_limit',
                    type: 'select',
                    values: {
                        '12': Lampa.Lang.translate('frames_limit_12'),
                        '24': Lampa.Lang.translate('frames_limit_24'),
                        '36': Lampa.Lang.translate('frames_limit_36')
                    },
                    default: '24'
                },
                field: {
                    name: Lampa.Lang.translate('frames_limit'),
                    description: Lampa.Lang.translate('frames_limit_descr')
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'frames_settings',
                param: {
                    name: 'frames_quality',
                    type: 'select',
                    values: {
                        'w500': Lampa.Lang.translate('frames_quality_w500'),
                        'w780': Lampa.Lang.translate('frames_quality_w780')
                    },
                    default: 'w780'
                },
                field: {
                    name: Lampa.Lang.translate('frames_quality'),
                    description: Lampa.Lang.translate('frames_quality_descr')
                }
            });
        }
    }

    if (window.appready) {
        init();
    } else if (window.Lampa && window.Lampa.Listener) {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    } else {
        window.addEventListener('load', function () {
            if (window.Lampa && window.Lampa.Listener) {
                Lampa.Listener.follow('app', function (e) {
                    if (e.type === 'ready') init();
                });
            }
        });
    }
})();
