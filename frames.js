/**
 * Lampa Frames Plugin (Кадры и скриншоты из фильмов, сериалов, аниме, мультфильмов и дорам)
 * High-performance widescreen frames carousel & full-screen gallery viewer
 * Compatible with TMDB, CUB, KP and ADrama cards.
 */
(function () {
    'use strict';

    if (window.plugin_lampa_frames_installed) return;
    window.plugin_lampa_frames_installed = true;

    // Safe Navigator helper for SpatialNavigator in Lampa
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

    // --- 1. IN-MEMORY LRU CACHE (Optimized for WebOS TV RAM) ---
    var Cache = {
        data: {},
        keys: [],
        max: 50,

        get: function (key) {
            if (this.data[key]) {
                // Refresh position in LRU
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

    // --- 2. FULLSCREEN FRAME VIEWER ---
    var FrameViewer = {
        active: false,
        frames: [],
        index: 0,
        title: '',
        html: null,
        prevController: null,
        lastFocusedElem: null,

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
                        '<span>Стрелки Влево / Вправо для переключения · Нажмите [Назад] для выхода</span>' +
                    '</div>' +
                '</div>'
            );

            $('body').append(this.html);

            this.showFrame(this.index);

            Lampa.Controller.add('frames_viewer', {
                toggle: function () {},
                left: function () {
                    _this.prev();
                },
                right: function () {
                    _this.next();
                },
                up: function () {
                    _this.close();
                },
                down: function () {
                    _this.close();
                },
                back: function () {
                    _this.close();
                },
                enter: function () {
                    _this.next();
                }
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
                if (_this.active && _this.index === _this.index) {
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

            // Preload adjacent images only (saving bandwidth & TV RAM)
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

    // --- 3. DATA FETCHERS ---

    // Fetch frames from TMDB (for movies, TV series, cartoons, anime)
    function fetchTmdbFrames(type, id, onResult) {
        var cacheKey = 'tmdb_' + type + '_' + id;
        var cached = Cache.get(cacheKey);
        if (cached) return onResult(cached);

        var limit = parseInt(Lampa.Storage.get('frames_limit', '24'), 10) || 24;
        var quality = Lampa.Storage.get('frames_quality', 'w780'); // w780 or w500

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

                // Sort by vote_count descending or aspect ratio
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

    // Fetch frames from ADrama
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

        // If ADrama has no gallery stills, fallback to TMDB search
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

    // Fallback search in TMDB by title & year
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

    // --- 4. CAROUSEL LINE BUILDER ---
    function buildFramesLine(frames, title, targetScroll, onFocus) {
        if (!frames || !frames.length) return null;

        var line = $(
            '<div class="items-line layer--visible layer--render items-line--frames">' +
                '<div class="items-line__head">' +
                    '<div class="items-line__title">Кадры <span class="items-line__count">(' + frames.length + ')</span></div>' +
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

    // Wrap frames line into a full-fledged Lampa 2.0 component item for Spatial Navigation
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

    // --- 5. INITIALIZATION & HOOKS ---
    function init() {
        // Inject Stylesheet
        if (!$('link[href*="frames.css"]').length) {
            $('head').append('<style id="frames-styles">' + "/* Lampa Frames Plugin Styles (\u041a\u0430\u0434\u0440\u044b \u0438 \u0441\u043a\u0440\u0438\u043d\u0448\u043e\u0442\u044b) */\n\n.items-line--frames {\n    position: relative;\n    margin-bottom: 1.5em;\n}\n\n.items-cards--frames {\n    display: -webkit-box !important;\n    display: -webkit-flex !important;\n    display: flex !important;\n    -webkit-flex-direction: row !important;\n    flex-direction: row !important;\n    -webkit-flex-wrap: nowrap !important;\n    flex-wrap: nowrap !important;\n    -webkit-box-align: start !important;\n    -webkit-align-items: flex-start !important;\n    align-items: flex-start !important;\n    padding: 0.8em 1.5em 1.4em 1.5em !important;\n}\n\n.items-cards--frames .card--frame {\n    -webkit-flex-shrink: 0 !important;\n    flex-shrink: 0 !important;\n    width: 20em !important;\n    margin-right: 1.2em !important;\n    cursor: pointer;\n}\n\n.card--frame .card__view {\n    padding-bottom: 56.25% !important; /* 16:9 widescreen */\n    position: relative !important;\n    -webkit-border-radius: 0.8em !important;\n    border-radius: 0.8em !important;\n    background: #141416 !important;\n    transition: transform 0.2s ease, box-shadow 0.2s ease !important;\n}\n\n.card--frame .card__img {\n    position: absolute !important;\n    top: 0 !important;\n    left: 0 !important;\n    width: 100% !important;\n    height: 100% !important;\n    object-fit: cover !important;\n    -webkit-border-radius: 0.8em !important;\n    border-radius: 0.8em !important;\n    transition: transform 0.25s ease, opacity 0.3s ease !important;\n    opacity: 0;\n}\n\n.card--frame .card__img.loaded {\n    opacity: 1 !important;\n}\n\n.card--frame.focus .card__view {\n    outline: none !important;\n}\n\n.card--frame.focus .card__view::after {\n    content: \"\" !important;\n    position: absolute !important;\n    top: -0.4em !important;\n    left: -0.4em !important;\n    right: -0.4em !important;\n    bottom: -0.4em !important;\n    border: 0.3em solid #fff !important;\n    -webkit-border-radius: 1.2em !important;\n    border-radius: 1.2em !important;\n    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.85) !important;\n    z-index: 5 !important;\n    pointer-events: none !important;\n    -webkit-animation: animation-card-focus 0.2s ease !important;\n    animation: animation-card-focus 0.2s ease !important;\n}\n\n.card--frame.hover .card__view::after {\n    border-color: rgba(255, 255, 255, 0.5) !important;\n}\n\n.card--frame.focus .card__img {\n    transform: scale(1.02) !important;\n}\n\n.card--frame .frame__number {\n    position: absolute;\n    bottom: 0.5em;\n    right: 0.6em;\n    padding: 0.15em 0.5em;\n    background: rgba(0, 0, 0, 0.65);\n    border-radius: 0.3em;\n    font-size: 0.8em;\n    font-weight: 600;\n    color: #fff;\n    pointer-events: none;\n    z-index: 2;\n}\n\n.items-line__count {\n    font-size: 0.75em;\n    color: rgba(255, 255, 255, 0.5);\n    font-weight: 400;\n    margin-left: 0.4em;\n}\n\n/* Fullscreen Frame Viewer */\n.frames-viewer {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100vw;\n    height: 100vh;\n    background: rgba(0, 0, 0, 0.94);\n    z-index: 10000;\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: flex;\n    -webkit-flex-direction: column;\n    flex-direction: column;\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    justify-content: center;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    align-items: center;\n    user-select: none;\n    -webkit-user-select: none;\n    animation: frames-fade-in 0.2s ease-out;\n}\n\n@keyframes frames-fade-in {\n    from { opacity: 0; }\n    to { opacity: 1; }\n}\n\n.frames-viewer__head {\n    position: absolute;\n    top: 2em;\n    left: 3.5em;\n    right: 3.5em;\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: flex;\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    justify-content: space-between;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    align-items: center;\n    z-index: 2;\n}\n\n.frames-viewer__title {\n    font-size: 1.6em;\n    font-weight: 700;\n    color: #fff;\n    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);\n    max-width: 75vw;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n.frames-viewer__counter {\n    font-size: 1.3em;\n    color: rgba(255, 255, 255, 0.8);\n    font-weight: 600;\n    background: rgba(255, 255, 255, 0.12);\n    padding: 0.2em 0.8em;\n    border-radius: 0.4em;\n}\n\n.frames-viewer__body {\n    position: relative;\n    width: 90vw;\n    height: 80vh;\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: flex;\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    justify-content: center;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    align-items: center;\n}\n\n.frames-viewer__img {\n    max-width: 100%;\n    max-height: 100%;\n    object-fit: contain;\n    border-radius: 0.6em;\n    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.85);\n    transition: opacity 0.2s ease;\n}\n\n.frames-viewer__arrow {\n    position: absolute;\n    top: 50%;\n    transform: translateY(-50%);\n    -webkit-transform: translateY(-50%);\n    width: 3.8em;\n    height: 3.8em;\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: flex;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    align-items: center;\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    justify-content: center;\n    color: rgba(255, 255, 255, 0.7);\n    background: rgba(0, 0, 0, 0.5);\n    border: 1px solid rgba(255, 255, 255, 0.15);\n    -webkit-border-radius: 50%;\n    border-radius: 50%;\n    z-index: 10;\n    pointer-events: none;\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);\n    transition: opacity 0.2s ease, background 0.2s ease, transform 0.2s ease;\n}\n\n.frames-viewer__arrow svg {\n    width: 2.2em;\n    height: 2.2em;\n    display: block;\n}\n\n.frames-viewer__arrow--left {\n    left: 2em;\n}\n\n.frames-viewer__arrow--right {\n    right: 2em;\n}\n\n.frames-viewer__footer {\n    position: absolute;\n    bottom: 2em;\n    color: rgba(255, 255, 255, 0.5);\n    font-size: 1.05em;\n    text-align: center;\n    z-index: 2;\n}\n\n.frames-viewer__loader {\n    position: absolute;\n    width: 3.5em;\n    height: 3.5em;\n    border: 4px solid rgba(255, 255, 255, 0.2);\n    border-top-color: #fff;\n    border-radius: 50%;\n    animation: frames-spin 0.8s linear infinite;\n    z-index: 3;\n}\n\n@keyframes frames-spin {\n    to { transform: rotate(360deg); }\n}\n" + '</style>');
        }

        // Hook 1: Standard Lampa cards (TMDB / CUB / Movies / TV / Anime / Cartoons)
        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite' || !Lampa.Storage.get('frames_enable', true)) return;

            var movie = e.data && e.data.movie;
            if (!movie || !movie.id) return;

            var comp = e.link || (e.object && e.object.activity && e.object.activity.component) || (Lampa.Activity.active() && Lampa.Activity.active().activity && Lampa.Activity.active().activity.component);
            if (!comp) return;

            var scroll = comp.scroll;
            if (!scroll) return;

            // Avoid duplicate injections
            if (scroll.render().find('.items-line--frames').length) return;

            var isTV = (e.object && e.object.method === 'tv') || Boolean(movie.number_of_seasons !== undefined || movie.first_air_date);
            var type = isTV ? 'tv' : 'movie';
            var title = movie.title || movie.name || 'Фильм';

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

                // Materialize un-materialized rows if lazy loading hasn't created them yet
                if (comp.rows && comp.items && comp.items.length < comp.rows.length) {
                    var add = comp.rows.slice(comp.items.length);
                    comp.fragment = document.createDocumentFragment();
                    add.forEach(comp.emit.bind(comp, 'createAndAppend'));
                    comp.scroll.append(comp.fragment);
                }

                // Determine insert position (insert before recommendations / similar)
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

        // Hook 2: ADrama cards
        Lampa.Listener.follow('adrama_card', function (e) {
            if (e.type !== 'complite' || !Lampa.Storage.get('frames_enable', true)) return;
            if (!e.release || !e.scroll) return;

            // Avoid duplicate injections
            if (e.scroll.render().find('.items-line--frames').length) return;

            var sum = e.release.summary || {};
            var title = (sum.titles && sum.titles.ru) || (sum.titles && sum.titles.en) || sum.title || 'Дорама';

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

                // Register all frame selectors in Navigator collection for spatial navigation!
                Lampa.Controller.collectionAppend(line.find('.selector'));

                if (Lampa.Layer && Lampa.Layer.update) Lampa.Layer.update();
                if (Lampa.Layer && Lampa.Layer.visible) Lampa.Layer.visible(e.scroll.render(true));
            });
        });

        // Settings Section
        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addComponent({
                component: 'frames_settings',
                name: 'Кадры и скриншоты',
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
                    name: 'Показывать кадры',
                    description: 'Отображать блок кадров в карточках фильмов, сериалов, мультфильмов и дорам'
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
                    name: 'Фон при наведении',
                    description: 'Изменять фоновое изображение экрана при наведении на кадр'
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'frames_settings',
                param: {
                    name: 'frames_limit',
                    type: 'select',
                    values: {
                        '12': '12 кадров (быстро)',
                        '24': '24 кадра (рекомендуется)',
                        '36': '36 кадров (максимум)'
                    },
                    default: '24'
                },
                field: {
                    name: 'Количество кадров',
                    description: 'Ограничение количества загружаемых кадров для оптимальной производительности'
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'frames_settings',
                param: {
                    name: 'frames_quality',
                    type: 'select',
                    values: {
                        'w500': 'Среднее (w500)',
                        'w780': 'Высокое (w780, четко)'
                    },
                    default: 'w780'
                },
                field: {
                    name: 'Качество миниатюр',
                    description: 'Разрешение загружаемых превью в строке (полный размер открывается по нажатию)'
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
