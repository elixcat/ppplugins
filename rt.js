(function () {
  'use strict';

  (function () {
    var c = true;
    try {
      window.localStorage.setItem("__lmp_test__", '1');
      window.localStorage.removeItem("__lmp_test__");
    } catch (g) {
      c = false;
    }
    if (!c) {
      var f = {};
      window.localStorage = {
        'getItem': function (h) {
          return Object.prototype.hasOwnProperty.call(f, h) ? f[h] : null;
        },
        'setItem': function (h, i) {
          f[h] = String(i);
        },
        'removeItem': function (h) {
          delete f[h];
        },
        'clear': function () {
          f = {};
        }
      };
    }
  })();
  (function (c) {
    if (c.Promise) {
      return;
    }
    function g(i) {
      setTimeout(i, 0x0);
    }
    function h(i) {
      if (!(this instanceof h)) {
        return new h(i);
      }
      var j = this;
      j._state = 0x0;
      j._value = undefined;
      j._handlers = [];
      function k(o) {
        if (j._state !== 0x0) {
          return;
        }
        if (o && (typeof o === "object" || typeof o === "function")) {
          var p;
          try {
            p = o.then;
          } catch (q) {
            return l(q);
          }
          if (typeof p === "function") {
            return p.call(o, k, l);
          }
        }
        j._state = 0x1;
        j._value = o;
        m();
      }
      function l(o) {
        if (j._state !== 0x0) {
          return;
        }
        j._state = 0x2;
        j._value = o;
        m();
      }
      function m() {
        g(function () {
          var o = j._handlers;
          j._handlers = [];
          for (var p = 0x0; p < o.length; p++) {
            n(o[p]);
          }
        });
      }
      function n(o) {
        if (j._state === 0x0) {
          j._handlers.push(o);
          return;
        }
        var p = j._state === 0x1 ? o.onFulfilled : o.onRejected;
        if (!p) {
          (j._state === 0x1 ? o.resolve : o.reject)(j._value);
          return;
        }
        try {
          var q = p(j._value);
          o.resolve(q);
        } catch (r) {
          o.reject(r);
        }
      }
      this.then = function (o, p) {
        return new h(function (q, r) {
          n({
            'onFulfilled': o,
            'onRejected': p,
            'resolve': q,
            'reject': r
          });
        });
      };
      this["catch"] = function (o) {
        return this.then(null, o);
      };
      try {
        i(k, l);
      } catch (o) {
        l(o);
      }
    }
    h.resolve = function (i) {
      return new h(function (j) {
        j(i);
      });
    };
    h.reject = function (i) {
      return new h(function (j, k) {
        k(i);
      });
    };
    h.all = function (i) {
      return new h(function (j, k) {
        if (!i || !i.length) {
          return j([]);
        }
        var l = new Array(i.length);
        var m = i.length;
        for (var n = 0x0; n < i.length; n++) {
          (function (o) {
            h.resolve(i[o]).then(function (p) {
              l[o] = p;
              if (--m === 0x0) {
                j(l);
              }
            }, k);
          })(n);
        }
      });
    };
    c.Promise = h;
  })(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
  (function (c) {
    if (c.fetch) {
      return;
    }
    function d(e, f) {
      this.status = f && f.status || 0xc8;
      this.ok = this.status >= 0xc8 && this.status < 0x12c;
      this._body = e == null ? '' : String(e);
      this.headers = f && f.headers || {};
    }
    d.prototype.text = function () {
      var e = this;
      return Promise.resolve(e._body);
    };
    d.prototype.json = function () {
      var e = this;
      return Promise.resolve().then(function () {
        return JSON.parse(e._body || "null");
      });
    };
    c.fetch = function (e, f) {
      f = f || {};
      var g = typeof e === "string" ? e : e && e.url || '';
      var h = (f.method || "GET").toUpperCase();
      var i = f.headers || {};
      var j = f.body || null;
      if (c.Lampa && Lampa.Reguest) {
        return new Promise(function (k) {
          new Lampa.Reguest().native(g, function (l) {
            var m = typeof l === "string" ? l : l != null ? JSON.stringify(l) : '';
            k(new d(m, {
              'status': 0xc8,
              'headers': i
            }));
          }, function () {
            k(new d('', {
              'status': 0x1f4,
              'headers': i
            }));
          }, false, {
            'dataType': "text",
            'method': h,
            'headers': i,
            'data': j
          });
        });
      }
      return new Promise(function (l, m) {
        try {
          var n = new XMLHttpRequest();
          n.open(h, g, true);
          for (var o in i) {
            if (Object.prototype.hasOwnProperty.call(i, o)) {
              n.setRequestHeader(o, i[o]);
            }
          }
          n.onload = function () {
            l(new d(n.responseText, {
              'status': n.status,
              'headers': i
            }));
          };
          n.onerror = function () {
            m(new TypeError("Network request failed"));
          };
          n.send(j);
        } catch (p) {
          m(p);
        }
      });
    };
  })(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
})();
(function () {
  'use strict';

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (ad, ae) {
      ae = ae || window;
      for (var af = 0x0; af < this.length; af++) {
        ad.call(ae, this[af], af, this);
      }
    };
  }
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector || function (ad) {
      var ae = this;
      var af = (ae.parentNode || document).querySelectorAll(ad);
      for (var ag = 0x0; ag < af.length; ag++) {
        if (af[ag] === ae) {
          return true;
        }
      }
      return false;
    };
  }
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (ad) {
      var ae = this;
      while (ae && ae.nodeType === 0x1) {
        if (ae.matches(ad)) {
          return ae;
        }
        ae = ae.parentElement || ae.parentNode;
      }
      return null;
    };
  }
  var c = {
    'apiKeys': {
      'mdblist': '',
      'omdb': ''
    },
    'monochromeIcons': false
  };
  Lampa.Lang.add({
    'oscars_label': {
      'uk': "Оскар"
    },
    'emmy_label': {
      'uk': "Еммі"
    },
    'awards_other_label': {
      'uk': "Нагороди"
    },
    'popcorn_label': {
      'uk': "Глядачі"
    },
    'source_tmdb': {
      'ru': "TMDB",
      'en': "TMDB",
      'uk': "TMDB"
    },
    'source_imdb': {
      'ru': "IMDb",
      'en': "IMDb",
      'uk': "IMDb"
    },
    'source_mc': {
      'ru': "Metacritic",
      'en': "Metacritic",
      'uk': "Metacritic"
    },
    'source_rt': {
      'ru': "Rotten",
      'en': "Rotten",
      'uk': "Rotten"
    }
  });
  var j = {
    'G': '3+',
    'PG': '6+',
    'PG-13': "13+",
    'R': "17+",
    'NC-17': "18+",
    'TV-Y': '0+',
    'TV-Y7': '7+',
    'TV-G': '3+',
    'TV-PG': '6+',
    'TV-14': "14+",
    'TV-MA': "17+"
  };
  var k = {
    'ratings_omdb_key': c.apiKeys.omdb || '',
    'ratings_mdblist_key': c.apiKeys.mdblist || '',
    'ratings_layout': "horizontal",
    'ratings_bw_logos': false,
    'ratings_show_awards': true,
    'ratings_show_average': true,
    'ratings_logo_offset': 0x0,
    'ratings_font_offset': -0x3,
    'ratings_badge_alpha': 0.15,
    'ratings_badge_tone': 0x0,
    'ratings_gap_step': 0x0,
    'ratings_colorize_all': false,
    'ratings_enable_imdb': true,
    'ratings_enable_tmdb': true,
    'ratings_enable_mc': true,
    'ratings_enable_rt': true,
    'ratings_enable_popcorn': true,
    'ratings_poster_badges': false,
    'ratings_rate_border': false,
    'ratings_enable_trakt': true,
    'ratings_enable_letterboxd': true
  };
  var l = null;
  var m = null;
  function n(ad) {
    var ae = ad.media_type || ad.type;
    if (ae === "movie" || ae === 'tv') {
      return ae;
    }
    return ad.name || ad.original_name ? 'tv' : "movie";
  }
  function o(ad) {
    var ae = parseFloat(ad);
    if (isNaN(ae)) {
      return "rating--red";
    }
    if (ae >= 0x8) {
      return "rating--green";
    }
    if (ae >= 0x6) {
      return "rating--blue";
    }
    if (ae >= 0x4) {
      return "rating--orange";
    }
    return "rating--red";
  }
  function q(ad) {
    if (!ad || typeof ad !== "object") {
      return null;
    }
    var ae = ad.value;
    if (ae == null) {
      ae = ad.score;
    }
    if (ae == null) {
      ae = ad.rating;
    }
    if (ae == null) {
      ae = ad.percent;
    }
    if (ae == null && typeof ad.display === "string") {
      ae = ad.display;
    }
    return ae == null ? null : ae;
  }
  function r(ad) {
    if (!Array.isArray(ad)) {
      return [];
    }
    var ae = (Lampa.Storage.get("source") || '').toLowerCase() === "cub";
    return ad.filter(function (af) {
      if (!af) {
        return false;
      }
      var ag = q(af);
      if (ag == null) {
        return false;
      }
      var ah = String(af.source || '').toLowerCase();
      if (ah === "tmdb") {
        return false;
      }
      if (ae && ah === "imdb") {
        return false;
      }
      return true;
    });
  }
  function s(ad) {
    if (ad && Array.isArray(ad._mdblist_ratings) && ad._mdblist_ratings.length) {
      return ad._mdblist_ratings.slice();
    }
    var ae = [];
    var af = ad || {};
    if (af.imdb_display) {
      ae.push({
        'source': "imdb",
        'value': af.imdb_display
      });
    }
    if (af.mc_critic_display) {
      ae.push({
        'source': "metacritic",
        'value': af.mc_critic_display
      });
    }
    if (af.mc_user_display) {
      ae.push({
        'source': "metacritic_user",
        'value': af.mc_user_display
      });
    }
    if (af.rt_display) {
      ae.push({
        'source': "rottentomatoes",
        'value': af.rt_display
      });
    }
    if (af.popcorn_display) {
      ae.push({
        'source': "popcorn",
        'value': af.popcorn_display
      });
    }
    if (af.tmdb_display) {
      ae.push({
        'source': "tmdb",
        'value': af.tmdb_display
      });
    }
    return ae;
  }
  function t() {
    if (document.getElementById("lmp-poster-badges-css")) {
      return;
    }
    var ad = "\n    /* === Бейдж одного рейтингу на постері === */\n    .card__lmerating {\n      position: absolute;\n      right: -0.8em;                    /* 👉 відступ від правого краю */\n      padding: 0.40em 0.60em;           /* 👉 внутрішні відступи */\n      background: linear-gradient(90deg, #2c2c2c, #1a1a1a); /* 👉 фон бейджа */\n      color: #fff;\n      border-radius: 0.35em;            /* 👉 скруглення */\n      text-transform: uppercase;\n      font-size: 0.80em;                /* 👉 розмір шрифту */\n      line-height: 1;\n      box-shadow: 0 2px 6px rgba(0,0,0,.35); /* 👉 тінь */\n      z-index: 5;\n      pointer-events: none;\n    }\n    @media (max-width: 768px) {\n      .card__lmerating { right: .2em; font-size: .74em; }\n    }\n    @media (max-width: 480px) {\n      .card__lmerating { right: .2em; font-size: .66em; }\n    }\n    ".trim();
    var ae = document.createElement("style");
    ae.id = "lmp-poster-badges-css";
    ae.textContent = ad;
    document.head.appendChild(ae);
  }
  function x(ad) {
    if (!ad || !ad.length) {
      return;
    }
    ad.addClass("lmp-is-loading-ratings");
  }
  function y(ad) {
    if (!ad || !ad.length) {
      return;
    }
    ad.removeClass("lmp-is-loading-ratings");
  }
  function z(ad) {
    if (!ad || !ad.length) {
      return $();
    }
    var ae = $(".cardify__left .full-start-new__rate-line.rate-fix:not([data-lmp-fake]), .cardify__left .full-start__rate-line.rate-fix:not([data-lmp-fake])", ad).first();
    if (ae.length) {
      return ae;
    }
    var af = $(".full-start-new__rate-line:not([data-lmp-fake]), .full-start__rate-line:not([data-lmp-fake])", ad).filter(function () {
      return !$(this).closest(".cardify__right").length;
    }).first();
    return af;
  }
  function A(ad) {
    if (!ad || !ad.length) {
      return;
    }
    ad.find(".rate--mc, .rate--rt, .rate--popcorn, .rate--trakt, .rate--letterboxd, .rate--avg,.rate--awards, .rate--emmy, .rate--oscars").remove();
  }
  function B(ad) {
    if (!ad || !ad[0x0]) {
      return;
    }
    if ($("#lmp-search-loader", ad).length) {
      return;
    }
    var ag = z(ad);
    if (ag.length) {
      ag.append("<div id=\"lmp-search-loader\" class=\"loading-dots-container\"><div class=\"loading-dots__text\">Пошук…</div><div class=\"loading-dots__dot\"></div><div class=\"loading-dots__dot\"></div><div class=\"loading-dots__dot\"></div></div>");
      x(ag);
      return;
    }
    var ah = $("<div class=\"full-start-new__rate-line\"      id=\"lmp-loader-fake\" data-lmp-fake=\"1\"      style=\"min-height:28px; display:flex; align-items:center;\"></div>");
    var ai = $(".full-start-new__title, .full-start__title", ad).first();
    if (ai.length) {
      ai.after(ah);
    } else {
      $(ad).append(ah);
    }
    ah.append("<div id=\"lmp-search-loader\" class=\"loading-dots-container\"><div class=\"loading-dots__text\">Пошук…</div><div class=\"loading-dots__dot\"></div><div class=\"loading-dots__dot\"></div><div class=\"loading-dots__dot\"></div></div>");
    try {
      if (l) {
        l.disconnect();
      }
    } catch (aj) {}
    l = new MutationObserver(function () {
      var ak = z(ad);
      var al = $("#lmp-search-loader", ad);
      if (ak.length && al.length) {
        ak.append(al);
        x(ak);
        $("#lmp-loader-fake", ad).remove();
        try {
          l.disconnect();
        } catch (am) {}
        l = null;
      }
    });
    l.observe(ad[0x0], {
      'childList': true,
      'subtree': true
    });
    setTimeout(function () {
      if (l) {
        try {
          l.disconnect();
        } catch (ak) {}
        l = null;
      }
    }, 0x1770);
  }
  function C(ad) {
    if (!ad || !ad[0x0]) {
      return;
    }
    $("#lmp-search-loader", ad).remove();
    $("#lmp-loader-fake", ad).remove();
    var ae = z(ad);
    if (ae.length) {
      y(ae);
    }
    try {
      if (l) {
        l.disconnect();
      }
    } catch (af) {}
    l = null;
  }
  function D(ad) {
    var ae = Lampa.Storage.get("lmp_enh_rating_cache_v2") || {};
    var af = ae[ad];
    if (!af) {
      return null;
    }
    if (Date.now() - af.timestamp > 259200000) {
      return null;
    }
    return af.data || null;
  }
  function E(ad, ae) {
    if (!ae) {
      return;
    }
    var af = Lampa.Storage.get("lmp_enh_rating_cache_v2") || {};
    af[ad] = {
      'timestamp': Date.now(),
      'data': ae
    };
    Lampa.Storage.set("lmp_enh_rating_cache_v2", af);
  }
  function F(ad) {
    if (typeof ad !== "string") {
      return {
        'oscars': 0x0,
        'emmy': 0x0,
        'awards': 0x0
      };
    }
    var ae = {
      'oscars': 0x0,
      'emmy': 0x0,
      'awards': 0x0
    };
    var af = ad.match(/Won (\d+) Oscars?/i);
    if (af && af[0x1]) {
      ae.oscars = parseInt(af[0x1], 0xa);
    }
    var ag = ad.match(/Won (\d+) Primetime Emmys?/i);
    if (ag && ag[0x1]) {
      ae.emmy = parseInt(ag[0x1], 0xa);
    }
    var ah = ad.match(/Another (\d+) wins?/i);
    if (ah && ah[0x1]) {
      ae.awards = parseInt(ah[0x1], 0xa);
    }
    var ai = ad.match(/(\d+) wins?/i);
    if (ai && ai[0x1]) {
      ae.awards = parseInt(ai[0x1], 0xa);
    }
    return ae;
  }
  (function () {
    function ad(af) {
      var ag = (af.textContent || '').replace(/\u00A0/g, " ").trim();
      if (/^10(?:[.,]0+)?$/.test(ag)) {
        af.textContent = '10';
      }
    }
    function ae(af) {
      try {
        var ag = af.querySelectorAll(".full-start__rate > div:first-child");
        for (var ah = 0x0; ah < ag.length; ah++) {
          ad(ag[ah]);
        }
      } catch (ai) {}
    }
    window.__lmpTenFixStart = function () {
      try {
        var af = Lampa && Lampa.Activity && Lampa.Activity.active() && Lampa.Activity.active().activity.render && Lampa.Activity.active().activity.render();
        if (!af || !af[0x0]) {
          return;
        }
        var ag = af[0x0].querySelector(".full-start-new__rate-line, .full-start__rate-line") || af[0x0];
        ae(ag);
        var ah = window.MutationObserver || window.WebKitMutationObserver;
        if (!ah) {
          return;
        }
        if (window.__lmpTenObs) {
          window.__lmpTenObs.disconnect();
          window.__lmpTenObs = null;
        }
        var ai = new ah(function (aj) {
          for (var ak = 0x0; ak < aj.length; ak++) {
            var al = aj[ak];
            if (al.type === "characterData") {
              var am = al.target && al.target.parentNode;
              if (am && am.nodeType === 0x1 && am.matches(".full-start__rate > div:first-child")) {
                ad(am);
              }
            } else {
              if (al.type === "childList") {
                var an = al.addedNodes || [];
                for (var ao = 0x0; ao < an.length; ao++) {
                  var ap = an[ao];
                  if (!ap || ap.nodeType !== 0x1) {
                    continue;
                  }
                  if (ap.matches && ap.matches(".full-start__rate > div:first-child")) {
                    ad(ap);
                  }
                  if (ap.querySelectorAll) {
                    var aq = ap.querySelectorAll(".full-start__rate > div:first-child");
                    for (var ar = 0x0; ar < aq.length; ar++) {
                      ad(aq[ar]);
                    }
                  }
                }
              }
            }
          }
        });
        ai.observe(ag, {
          'subtree': true,
          'childList': true,
          'characterData': true
        });
        window.__lmpTenObs = ai;
      } catch (aj) {}
    };
  })();
  function G(ad) {
    try {
      if (Lampa && typeof Lampa.Noty === "function") {
        Lampa.Noty(ad);
        return;
      }
      if (Lampa && Lampa.Noty && Lampa.Noty.show) {
        Lampa.Noty.show(ad);
        return;
      }
    } catch (ag) {}
    var af = document.getElementById("lmp_toast");
    if (!af) {
      af = document.createElement("div");
      af.id = "lmp_toast";
      af.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:2rem;padding:.6rem 1rem;background:rgba(0,0,0,.85);color:#fff;border-radius:.5rem;z-index:9999;font-size:14px;transition:opacity .2s;opacity:0";
      document.body.appendChild(af);
    }
    af.textContent = ad;
    af.style.opacity = '1';
    setTimeout(function () {
      af.style.opacity = '0';
    }, 0x514);
  }
  function H() {
    try {
      Lampa.Storage.set("lmp_enh_rating_cache_v2", {});
      Lampa.Storage.set("lmp_rating_id_cache", {});
      G("Кеш рейтингів очищено");
    } catch (ad) {
      console.error("LMP Ratings: clear cache error", ad);
      G("Помилка очищення кешу");
    }
  }
  function I(ad, ae, af) {
    if (!ad) {
      return af(null);
    }
    var ag = ae === "movie" ? "movie" : 'tv';
    var ah = ag === "movie" ? 'tv' : "movie";
    var ai = Lampa.Storage.get("lmp_rating_id_cache") || {};
    var aj = Date.now();
    function ak(at) {
      var au = ai[at];
      if (!au) {
        return null;
      }
      if (!au.imdb_id) {
        return null;
      }
      if (aj - au.timestamp > 259200000) {
        return null;
      }
      return au.imdb_id;
    }
    var al = ag + '_' + ad;
    var am = ah + '_' + ad;
    var an = ak(al) || ak(am);
    if (an) {
      return af(an);
    }
    var ao = Lampa.TMDB.key();
    var ap = ["https://api.themoviedb.org/3/" + ag + '/' + ad + "/external_ids?api_key=" + ao, "https://api.themoviedb.org/3/" + ag + '/' + ad + "?api_key=" + ao + "&append_to_response=external_ids", "https://api.themoviedb.org/3/" + ah + '/' + ad + "/external_ids?api_key=" + ao, "https://api.themoviedb.org/3/" + ah + '/' + ad + "?api_key=" + ao + "&append_to_response=external_ids"];
    var aq = function (at, au, av) {
      new Lampa.Reguest().silent(at, au, function () {
        new Lampa.Reguest().native(at, function (aw) {
          try {
            au(typeof aw === "string" ? JSON.parse(aw) : aw);
          } catch (ax) {
            av();
          }
        }, av, false, {
          'dataType': "json"
        });
      });
    };
    function ar(at) {
      if (!at || typeof at !== "object") {
        return null;
      }
      if (at.imdb_id && typeof at.imdb_id === "string") {
        return at.imdb_id;
      }
      if (at.external_ids && typeof at.external_ids.imdb_id === "string") {
        return at.external_ids.imdb_id;
      }
      return null;
    }
    function as(at) {
      var au = {
        'imdb_id': at,
        'timestamp': Date.now()
      };
      ai[al] = au;
      ai[am] = au;
      Lampa.Storage.set("lmp_rating_id_cache", ai);
      af(at);
    }
    (function at() {
      var au = ap.shift();
      if (!au) {
        return af(null);
      }
      aq(au, function (av) {
        var aw = ar(av);
        if (aw) {
          as(aw);
        } else {
          at();
        }
      }, function () {
        at();
      });
    })();
  }
  function J(ad, ae) {
    var af = c.apiKeys.mdblist;
    if (!af) {
      ae(null);
      return;
    }
    var ag = ad.type === 'tv' ? "show" : ad.type;
    var ah = "https://api.mdblist.com/tmdb/" + ag + '/' + ad.id + "?apikey=" + encodeURIComponent(af);
    new Lampa.Reguest().silent(ah, aj, ai);
    function ai() {
      new Lampa.Reguest().native(ah, function (ak) {
        try {
          aj(typeof ak === "string" ? JSON.parse(ak) : ak);
        } catch (al) {
          ae(null);
        }
      }, function () {
        ae(null);
      }, false, {
        'dataType': "json"
      });
    }
    function aj(ak) {
      if (!ak || !ak.ratings || !ak.ratings.length) {
        ae(null);
        return;
      }
      var al = {
        'tmdb_display': null,
        'tmdb_for_avg': null,
        'imdb_display': null,
        'imdb_for_avg': null,
        'mc_user_display': null,
        'mc_user_for_avg': null,
        'mc_critic_display': null,
        'mc_critic_for_avg': null,
        'rt_display': null,
        'rt_for_avg': null,
        'rt_fresh': null,
        'popcorn_display': null,
        'popcorn_for_avg': null,
        'trakt_display': null,
        'trakt_for_avg': null,
        'letterboxd_display': null,
        'letterboxd_for_avg': null
      };
      function am(ao) {
        if (ao === null || ao === undefined) {
          return null;
        }
        if (typeof ao === "number") {
          return ao;
        }
        if (typeof ao === "string") {
          if (ao.indexOf('%') !== -0x1) {
            return parseFloat(ao.replace('%', ''));
          }
          if (ao.indexOf('/') !== -0x1) {
            return parseFloat(ao.split('/')[0x0]);
          }
          return parseFloat(ao);
        }
        return null;
      }
      ak.ratings.forEach(function (ao) {
        var ap = (ao.source || '').toLowerCase();
        var aq = am(ao.value);
        if (aq === null || isNaN(aq)) {
          return;
        }
        if (ap.indexOf("tmdb") !== -0x1) {
          var ar = aq > 0xa ? aq / 0xa : aq;
          al.tmdb_display = ar.toFixed(0x1);
          al.tmdb_for_avg = ar;
        }
        if (ap.indexOf("imdb") !== -0x1) {
          var as = aq > 0xa ? aq / 0xa : aq;
          al.imdb_display = as.toFixed(0x1);
          al.imdb_for_avg = as;
        }
        if (ap.indexOf("metacritic") !== -0x1 && (ap.indexOf("user") !== -0x1 || ap.indexOf("users") !== -0x1 || ap.indexOf("metacriticuser") !== -0x1 || ap.indexOf("metacritic_user") !== -0x1)) {
          var at = aq > 0xa ? aq / 0xa : aq;
          al.mc_user_display = at.toFixed(0x1);
          al.mc_user_for_avg = at;
        }
        if (ap.indexOf("metacritic") !== -0x1 && !(ap.indexOf("user") !== -0x1 || ap.indexOf("users") !== -0x1 || ap.indexOf("metacriticuser") !== -0x1 || ap.indexOf("metacritic_user") !== -0x1)) {
          var au = aq > 0xa ? aq / 0xa : aq;
          al.mc_critic_display = au.toFixed(0x1);
          al.mc_critic_for_avg = au;
        }
        if (ap.indexOf("rotten") !== -0x1 || ap.indexOf("tomato") !== -0x1) {
          al.rt_display = String(Math.round(aq));
          al.rt_for_avg = aq / 0xa;
          al.rt_fresh = aq >= 0x3c;
        }
        if (ap.indexOf("popcorn") !== -0x1 || ap.indexOf("audience") !== -0x1) {
          al.popcorn_display = String(Math.round(aq));
          al.popcorn_for_avg = aq / 0xa;
        }
        if (ap.indexOf("trakt") !== -0x1) {
          var av = aq > 0xa ? aq / 0xa : aq;
          al.trakt_display = av.toFixed(0x1);
          al.trakt_for_avg = av;
        }
        if (ap.indexOf("letterbox") !== -0x1) {
          var aw = aq > 0xa ? aq / 0xa : aq;
          var ax = aw <= 0x5 ? aw * 0x2 : aw;
          al.letterboxd_display = ax.toFixed(0x1);
          al.letterboxd_for_avg = ax;
        }
      });
      al._mdblist_ratings = Array.isArray(ak.ratings) ? ak.ratings.slice() : [];
      ae(al);
    }
  }
  function K(ad, ae) {
    var af = c.apiKeys.omdb;
    if (!af || !ad.imdb_id) {
      ae(null);
      return;
    }
    var ag = ad.type === 'tv' ? "&type=series" : '';
    var ah = "https://www.omdbapi.com/?apikey=" + encodeURIComponent(af) + "&i=" + encodeURIComponent(ad.imdb_id) + ag;
    new Lampa.Reguest().silent(ah, function (ai) {
      if (!ai || ai.Response !== "True") {
        ae(null);
        return;
      }
      var aj = F(ai.Awards || '');
      var ak = null;
      var al = null;
      if (Array.isArray(ai.Ratings)) {
        ai.Ratings.forEach(function (ao) {
          if (ao.Source === "Rotten Tomatoes") {
            var ap = parseInt((ao.Value || '').replace('%', ''));
            if (!isNaN(ap)) {
              ak = ap;
            }
          }
          if (ao.Source === "Metacritic") {
            var aq = parseInt((ao.Value || '').split('/')[0x0]);
            if (!isNaN(aq)) {
              al = aq;
            }
          }
        });
      }
      var am = al !== null && !isNaN(al) ? al > 0xa ? al / 0xa : al : null;
      var an = {
        'tmdb_display': null,
        'tmdb_for_avg': null,
        'imdb_display': ai.imdbRating && ai.imdbRating !== "N/A" ? parseFloat(ai.imdbRating).toFixed(0x1) : null,
        'imdb_for_avg': ai.imdbRating && ai.imdbRating !== "N/A" ? parseFloat(ai.imdbRating) : null,
        'mc_user_display': null,
        'mc_user_for_avg': null,
        'mc_critic_display': am !== null ? am.toFixed(0x1) : null,
        'mc_critic_for_avg': am !== null ? am : null,
        'rt_display': ak !== null && !isNaN(ak) ? String(ak) : null,
        'rt_for_avg': ak !== null && !isNaN(ak) ? ak / 0xa : null,
        'rt_fresh': ak !== null && !isNaN(ak) ? ak >= 0x3c : null,
        'popcorn_display': null,
        'popcorn_for_avg': null,
        'ageRating': ai.Rated || null,
        'oscars': aj.oscars || 0x0,
        'emmy': aj.emmy || 0x0,
        'awards': aj.awards || 0x0
      };
      ae(an);
    }, function () {
      ae(null);
    });
  }
  function L(ad, ae) {
    ad = ad || {};
    ae = ae || {};
    var af = null;
    var ag = null;
    if (ad.mc_user_display) {
      af = ad.mc_user_display;
      ag = ad.mc_user_for_avg;
    } else {
      if (ad.mc_critic_display) {
        af = ad.mc_critic_display;
        ag = ad.mc_critic_for_avg;
      } else if (ae.mc_critic_display) {
        af = ae.mc_critic_display;
        ag = ae.mc_critic_for_avg;
      }
    }
    var ah = {
      'tmdb_display': ad.tmdb_display || null,
      'tmdb_for_avg': ad.tmdb_for_avg || null,
      'imdb_display': ad.imdb_display || ae.imdb_display || null,
      'imdb_for_avg': ad.imdb_for_avg || ae.imdb_for_avg || null,
      'mc_user_display': ad.mc_user_display || null,
      'mc_user_for_avg': typeof ad.mc_user_for_avg === "number" ? ad.mc_user_for_avg : null,
      'mc_critic_display': ad.mc_critic_display || ae.mc_critic_display || null,
      'mc_critic_for_avg': typeof ad.mc_critic_for_avg === "number" ? ad.mc_critic_for_avg : typeof ae.mc_critic_for_avg === "number" ? ae.mc_critic_for_avg : null,
      'mc_display': af || null,
      'mc_for_avg': typeof ag === "number" ? ag : null,
      'rt_display': ad.rt_display || ae.rt_display || null,
      'rt_for_avg': ad.rt_for_avg || ae.rt_for_avg || null,
      'rt_fresh': ad.rt_display || ae.rt_display ? ad.rt_display ? ad.rt_fresh : ae.rt_fresh : null,
      'popcorn_display': ad.popcorn_display || null,
      'popcorn_for_avg': ad.popcorn_for_avg || null,
      'trakt_display': ad.trakt_display || null,
      'trakt_for_avg': ad.trakt_for_avg || null,
      'letterboxd_display': ad.letterboxd_display || null,
      'letterboxd_for_avg': ad.letterboxd_for_avg || null,
      'ageRating': ae.ageRating || null,
      'oscars': ae.oscars || 0x0,
      'emmy': ae.emmy || 0x0,
      'awards': ae.awards || 0x0,
      '_mdblist_ratings': Array.isArray(ad._mdblist_ratings) ? ad._mdblist_ratings.slice() : []
    };
    return ah;
  }
  function M(ad) {
    var ae = (ad || document).querySelectorAll(".card__lmerating");
    ae.forEach(function (af) {
      if (af.parentNode) {
        af.parentNode.removeChild(af);
      }
    });
  }
  function N(ad, ae) {
    var af = U();
    if (!af.enablePosterBadges) {
      M(ae && ae[0x0]);
      return;
    }
    t();
    if (!ae || !ae.length) {
      return;
    }
    var ag = $(".full-start-new__poster, .full-start__poster", ae).first();
    if (!ag.length) {
      return;
    }
    ag.find(".card__lmerating").remove();
    var ah = s(ad);
    var ai = r(ah);
    if (!ai.length) {
      return;
    }
    ai.forEach(function (al, am) {
      var an = $("<div class=\"card__lmerating\"></div>");
      an.css("top", "calc(0.8em + " + am * 0x2 + "em)");
      an.text(String(al.source || '').toUpperCase() + ": " + String(al.value));
      ag.append(an);
    });
  }
  function O(ad, ae) {
    if (!ae || !ae.length) {
      return;
    }
    ae.find(".card__lmerating").remove();
    var af = r(ad);
    if (!af.length) {
      return;
    }
    t();
    af.forEach(function (ai, aj) {
      var ak = q(ai);
      if (ak == null) {
        return;
      }
      var al = String((ai.source || '').toUpperCase()) + ": " + String(ak);
      if (ai.votes != null) {
        al += " /" + String(ai.votes);
      }
      var am = $("<div class=\"card__lmerating\"></div>");
      am.css("top", "calc(0.6em + " + aj * 0x2 + "em)").text(al);
      ae.append(am);
    });
  }
  function P(ad, ae) {
    if (!ae || !ae[0x0]) {
      return;
    }
    var af = $(".full-start__pg.hide", ae);
    if (af.length && ad.ageRating) {
      var ag = ["N/A", "Not Rated", "Unrated"];
      var ah = ag.indexOf(ad.ageRating) === -0x1;
      if (ah) {
        var ai = j[ad.ageRating] || ad.ageRating;
        af.removeClass("hide").text(ai);
      }
    }
    var aj = U();
    var ak = $(".rate--imdb", ae);
    if (ak.length) {
      ak.addClass("lmp-loaded");
      var al = parseFloat(ad.imdb_display);
      if (!aj.enableImdb || !ad.imdb_display || isNaN(al) || al === 0x0) {
        ak.addClass("hide");
      } else {
        ak.removeClass("hide");
        var am = ak.find("> div");
        if (am.length >= 0x2) {
          am.eq(0x0).text(al.toFixed(0x1));
          am.eq(0x1).addClass("source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/imdb.svg" + "\" alt=\"" + ("IMDb" || '') + "\">");
        }
        ak.removeClass("rating--green rating--blue rating--orange rating--red");
        if (aj.colorizeAll && ad.imdb_for_avg) {
          ak.addClass(o(ad.imdb_for_avg));
        }
      }
    }
    var an = $(".rate--tmdb", ae);
    if (an.length) {
      an.addClass("lmp-loaded");
      var ao = parseFloat(ad.tmdb_display);
      if (!aj.enableTmdb || !ad.tmdb_display || isNaN(ao) || ao === 0x0) {
        an.addClass("hide");
      } else {
        an.removeClass("hide");
        var ap = an.find("> div");
        if (ap.length >= 0x2) {
          ap.eq(0x0).text(ao.toFixed(0x1));
          ap.eq(0x1).addClass("source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/tmdb.svg" + "\" alt=\"" + ("TMDB" || '') + "\">");
        }
        an.removeClass("rating--green rating--blue rating--orange rating--red");
        if (aj.colorizeAll && ad.tmdb_for_avg) {
          an.addClass(o(ad.tmdb_for_avg));
        }
      }
    }
  }
  function Q(ad, ae) {
    var af = ad.find(".rate--awards, .rate--oscars, .rate--emmy");
    af.removeClass("rating--green rating--blue rating--orange rating--red");
    if (ae && ae.colorizeAll) {
      af.addClass("rate--gold");
    } else {
      af.removeClass("rate--gold");
    }
  }
  function R(ad, ae) {
    if (!ae || !ae.length) {
      return;
    }
    A(ae);
    var af = z(ae);
    if (!af.length) {
      return;
    }
    var ag = typeof U === "function" ? U() : {
      'enableImdb': true,
      'enableTmdb': true,
      'enableMc': true,
      'enableRt': true,
      'enablePop': true,
      'enableTrakt': true,
      'enableLetterboxd': true,
      'mcMode': "meta",
      'colorizeAll': false
    };
    (function () {
      var ak = $(".rate--mc", af);
      if (!ag.enableMc) {
        ak.remove();
        return;
      }
      var al = null;
      if (ad.mc_user_for_avg && !isNaN(ad.mc_user_for_avg)) {
        al = parseFloat(ad.mc_user_for_avg);
      } else {
        if (ad.mc_critic_for_avg && !isNaN(ad.mc_critic_for_avg)) {
          al = parseFloat(ad.mc_critic_for_avg);
        } else {
          if (ad.mc_for_avg && !isNaN(ad.mc_for_avg)) {
            al = parseFloat(ad.mc_for_avg);
          } else {
            if (ad.mc_display && !isNaN(parseFloat(ad.mc_display))) {
              var am = parseFloat(ad.mc_display);
              al = am > 0xa ? am / 0xa : am;
            }
          }
        }
      }
      if (al == null || isNaN(al)) {
        ak.remove();
        return;
      }
      var an = al.toFixed(0x1);
      var ao = ad.mc_user_for_avg && !isNaN(ad.mc_user_for_avg) && Math.abs(al - parseFloat(ad.mc_user_for_avg)) < 0.051;
      var ap = !ao && ad.mc_critic_for_avg && !isNaN(ad.mc_critic_for_avg) && Math.abs(al - parseFloat(ad.mc_critic_for_avg)) < 0.051;
      var aq = "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/metascore.png";
      if (ao) {
        aq = "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/metacritic.svg";
      }
      if (ap) {
        aq = "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/metascore.png";
      }
      if (!ak.length) {
        ak = $("<div class=\"full-start__rate rate--mc\"><div>" + an + "</div>" + "<div class=\"source--name\"></div>" + "</div>");
        ak.find(".source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + aq + "\" alt=\"" + ("Metacritic" || '') + "\">");
        var ar = $(".rate--imdb", af);
        if (ar.length) {
          ak.insertAfter(ar);
        } else {
          af.append(ak);
        }
      } else {
        ak.find("> div").eq(0x0).text(an);
        ak.find(".source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + aq + "\" alt=\"" + ("Metacritic" || '') + "\">");
      }
      ak.removeClass("rating--green rating--blue rating--orange rating--red");
      if (ag.colorizeAll) {
        ak.addClass(o(al));
      }
    })();
    (function () {
      var ak = $(".rate--rt", af);
      if (!ag.enableRt) {
        ak.remove();
        return;
      }
      var al = null;
      if (ad.rt_for_avg && !isNaN(ad.rt_for_avg)) {
        al = parseFloat(ad.rt_for_avg);
      } else {
        if (ad.rt_display && !isNaN(parseFloat(ad.rt_display))) {
          var am = parseFloat(ad.rt_display);
          al = am > 0xa ? am / 0xa : am;
        }
      }
      if (al == null || isNaN(al)) {
        ak.remove();
        return;
      }
      var an = al.toFixed(0x1);
      var ao = ad.rt_fresh ? "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/RottenTomatoes.svg" : "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/RottenBad.svg";
      var ap = ad.rt_fresh ? "border-radius:4px;" : '';
      if (!ak.length) {
        ak = $("<div class=\"full-start__rate rate--rt\"><div>" + an + "</div>" + "<div class=\"source--name\"></div>" + "</div>");
        ak.find(".source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (ap || '') + " " + "\" " + "src=\"" + ao + "\" alt=\"" + ("Rotten Tomatoes" || '') + "\">");
        var aq = $(".rate--mc", af);
        if (aq.length) {
          ak.insertAfter(aq);
        } else {
          var ar = $(".rate--imdb", af);
          if (ar.length) {
            ak.insertAfter(ar);
          } else {
            af.prepend(ak);
          }
        }
      } else {
        ak.find("> div").eq(0x0).text(an);
        ak.find(".source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (ap || '') + " " + "\" " + "src=\"" + ao + "\" alt=\"" + ("Rotten Tomatoes" || '') + "\">");
      }
      ak.removeClass("rating--green rating--blue rating--orange rating--red");
      if (ag.colorizeAll) {
        ak.addClass(o(al));
      }
    })();
    (function () {
      var ak = $(".rate--popcorn", af);
      if (!ag.enablePop) {
        ak.remove();
        return;
      }
      var al = null;
      if (ad.popcorn_for_avg && !isNaN(ad.popcorn_for_avg)) {
        al = parseFloat(ad.popcorn_for_avg);
      } else {
        if (ad.popcorn_display && !isNaN(parseFloat(ad.popcorn_display))) {
          var am = parseFloat(ad.popcorn_display);
          al = am > 0xa ? am / 0xa : am;
        }
      }
      if (al == null || isNaN(al)) {
        ak.remove();
        return;
      }
      var an = al.toFixed(0x1);
      var ao = al >= 0x6 ? "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/PopcornGood.svg" : "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/PopcornBad.svg";
      if (!ak.length) {
        ak = $("<div class=\"full-start__rate rate--popcorn\"><div>" + an + "</div>" + "<div class=\"source--name\"></div>" + "</div>");
        ak.find(".source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + ao + "\" alt=\"" + ("Audience" || '') + "\">");
        var ap = af.find(".rate--rt, .rate--mc, .rate--tmdb, .rate--imdb");
        if (ap.length) {
          ak.insertAfter(ap.last());
        } else {
          af.prepend(ak);
        }
      } else {
        ak.find("> div").eq(0x0).text(an);
        ak.find(".source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + ao + "\" alt=\"" + ("Audience" || '') + "\">");
      }
      ak.removeClass("rating--green rating--blue rating--orange rating--red");
      if (ag.colorizeAll) {
        ak.addClass(o(al));
      }
    })();
    (function () {
      var ak = $(".rate--trakt", af);
      if (!ag.enableTrakt) {
        ak.remove();
        return;
      }
      var al = null;
      if (ad.trakt_for_avg && !isNaN(ad.trakt_for_avg)) {
        al = parseFloat(ad.trakt_for_avg);
      } else {
        if (ad.trakt_display && !isNaN(parseFloat(ad.trakt_display))) {
          var am = parseFloat(ad.trakt_display);
          al = am > 0xa ? am / 0xa : am;
        }
      }
      if (al == null || isNaN(al)) {
        ak.remove();
        return;
      }
      var an = al.toFixed(0x1);
      if (!ak.length) {
        ak = $("<div class=\"full-start__rate rate--trakt\"><div>" + an + "</div>" + "<div class=\"source--name\"></div>" + "</div>");
        ak.find(".source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/trakt.png" + "\" alt=\"" + ("Trakt" || '') + "\">");
        var ao = af.find(".rate--popcorn, .rate--rt, .rate--mc, .rate--tmdb, .rate--imdb");
        if (ao.length) {
          ak.insertAfter(ao.last());
        } else {
          af.prepend(ak);
        }
      } else {
        ak.find("> div").eq(0x0).text(an);
        ak.find(".source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/trakt.png" + "\" alt=\"" + ("Trakt" || '') + "\">");
      }
      ak.removeClass("rating--green rating--blue rating--orange rating--red");
      if (ag.colorizeAll) {
        ak.addClass(o(al));
      }
    })();
    (function () {
      var ak = $(".rate--letterboxd", af);
      if (!ag.enableLetterboxd) {
        ak.remove();
        return;
      }
      var al = null;
      if (ad.letterboxd_for_avg && !isNaN(ad.letterboxd_for_avg)) {
        al = parseFloat(ad.letterboxd_for_avg);
      } else {
        if (ad.letterboxd_display && !isNaN(parseFloat(ad.letterboxd_display))) {
          var am = parseFloat(ad.letterboxd_display);
          al = am <= 0x5 ? am * 0x2 : am;
        }
      }
      if (al == null || isNaN(al)) {
        ak.remove();
        return;
      }
      var an = al.toFixed(0x1);
      if (!ak.length) {
        ak = $("<div class=\"full-start__rate rate--letterboxd\"><div>" + an + "</div>" + "<div class=\"source--name\"></div>" + "</div>");
        ak.find(".source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/letterboxd1.svg" + "\" alt=\"" + ("Letterboxd" || '') + "\">");
        var ao = af.find(".rate--trakt, .rate--popcorn, .rate--rt, .rate--mc, .rate--tmdb, .rate--imdb");
        if (ao.length) {
          ak.insertAfter(ao.last());
        } else {
          af.prepend(ak);
        }
      } else {
        ak.find("> div").eq(0x0).text(an);
        ak.find(".source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/letterboxd1.svg" + "\" alt=\"" + ("Letterboxd" || '') + "\">");
      }
      ak.removeClass("rating--green rating--blue rating--orange rating--red");
      if (ag.colorizeAll) {
        ak.addClass(o(al));
      }
    })();
    if (ad.awards && ad.awards > 0x0 && !$(".rate--awards", af).length) {
      var ah = $("<div class=\"full-start__rate rate--awards rate--gold\"><div>" + ad.awards + "</div>" + "<div class=\"source--name\"></div>" + "</div>");
      ah.find(".source--name").html("<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/awards.png" + "\" alt=\"" + ("Awards" || '') + "\">").attr("title", Lampa.Lang.translate("awards_other_label"));
      af.prepend(ah);
    }
    if (ad.emmy && ad.emmy > 0x0 && !$(".rate--emmy", af).length) {
      var ai = $("<div class=\"full-start__rate rate--emmy rate--gold\"><div>" + ad.emmy + "</div>" + "<div class=\"source--name\"></div>" + "</div>");
      ai.find(".source--name").html("<span class=\"lmp-award-icon lmp-award-icon--emmy\"><img src=\"https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/EmmyGold.png\" alt=\"Emmy\"></span>").attr("title", Lampa.Lang.translate("emmy_label"));
      af.prepend(ai);
    }
    if (ad.oscars && ad.oscars > 0x0 && !$(".rate--oscars", af).length) {
      var aj = $("<div class=\"full-start__rate rate--oscars rate--gold\"><div>" + ad.oscars + "</div>" + "<div class=\"source--name\"></div>" + "</div>");
      aj.find(".source--name").html("<span class=\"lmp-award-icon lmp-award-icon--oscar\"><img src=\"https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/OscarGold.png\" alt=\"Oscar\"></span>").attr("title", Lampa.Lang.translate("oscars_label"));
      af.prepend(aj);
    }
    try {
      Q(af, ag);
    } catch (ak) {}
  }
  function S(ad, ae) {
    if (!ae || !ae.length) {
      return;
    }
    var af = z(ae);
    if (!af.length) {
      return;
    }
    var ag = typeof U === "function" ? U() : {
      'enableImdb': true,
      'enableTmdb': true,
      'enableMc': true,
      'enableRt': true,
      'enablePop': true,
      'enableTrakt': true,
      'enableLetterboxd': true,
      'colorizeAll': true,
      'showAverage': true
    };
    $(".rate--avg", af).remove();
    if (!ag.showAverage) {
      try {
        Q(af, ag);
      } catch (ap) {}
      C(ae);
      y(af);
      return;
    }
    var ah = [];
    if (ag.enableTmdb && ad.tmdb_for_avg && !isNaN(ad.tmdb_for_avg)) {
      ah.push(parseFloat(ad.tmdb_for_avg));
    }
    if (ag.enableImdb && ad.imdb_for_avg && !isNaN(ad.imdb_for_avg)) {
      ah.push(parseFloat(ad.imdb_for_avg));
    }
    if (ag.enableMc) {
      if (ad.mc_user_for_avg && !isNaN(ad.mc_user_for_avg)) {
        ah.push(parseFloat(ad.mc_user_for_avg));
      } else {
        if (ad.mc_critic_for_avg && !isNaN(ad.mc_critic_for_avg)) {
          ah.push(parseFloat(ad.mc_critic_for_avg));
        } else if (ad.mc_for_avg && !isNaN(ad.mc_for_avg)) {
          ah.push(parseFloat(ad.mc_for_avg));
        }
      }
    }
    if (ag.enableRt && ad.rt_for_avg && !isNaN(ad.rt_for_avg)) {
      ah.push(parseFloat(ad.rt_for_avg));
    }
    if (ag.enablePop && ad.popcorn_for_avg && !isNaN(ad.popcorn_for_avg)) {
      ah.push(parseFloat(ad.popcorn_for_avg));
    }
    if (ag.enableTrakt && ad.trakt_for_avg && !isNaN(ad.trakt_for_avg)) {
      ah.push(parseFloat(ad.trakt_for_avg));
    }
    if (ag.enableLetterboxd && ad.letterboxd_for_avg && !isNaN(ad.letterboxd_for_avg)) {
      ah.push(parseFloat(ad.letterboxd_for_avg));
    }
    if (!ah.length) {
      C(ae);
      y(af);
      return;
    }
    var ai = 0x0;
    for (var aj = 0x0; aj < ah.length; aj++) {
      ai += ah[aj];
    }
    var ak = ai / ah.length;
    var al = ag.colorizeAll ? o(ak) : '';
    var am = $("<div class=\"full-start__rate rate--avg " + al + "\">" + "<div>" + ak.toFixed(0x1) + "</div>" + "<div class=\"source--name\"></div>" + "</div>");
    var an = "<img style=\"width:auto; display:inline-block; vertical-align:middle; object-fit:contain; " + (undefined || '') + " " + "\" " + "src=\"" + "https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/star.png" + "\" alt=\"" + ("AVG" || '') + "\">";
    am.find(".source--name").html(an);
    var ao = $(".full-start__rate:first", af);
    if (ao.length) {
      ao.before(am);
    } else {
      af.prepend(am);
    }
    try {
      Q(af, typeof U === "function" ? U() : null);
    } catch (aq) {}
    C(ae);
    y(af);
  }
  function T(ad, ae) {
    if (!ae || !ae.length) {
      return;
    }
    V();
    var af = {
      'id': ad.id,
      'imdb_id': ad.imdb_id || ad.imdb || null,
      'title': ad.title || ad.name || '',
      'original_title': ad.original_title || ad.original_name || '',
      'type': n(ad),
      'release_date': ad.release_date || ad.first_air_date || '',
      'vote': ad.vote_average || ad.vote || null
    };
    var ag = (af.type || n(af)) + '_' + (af.imdb_id || af.id || '');
    var ah = ag + '_' + Date.now();
    m = ah;
    var ai = null;
    function aj() {
      if (ah !== m) {
        return;
      }
      if (!ai) {
        C(ae);
        return;
      }
      ae.data("lmp_ratings_data", ai);
      P(ai, ae);
      R(ai, ae);
      S(ai, ae);
      try {
        N(ai, ae);
      } catch (al) {}
      a3();
    }
    function ak() {
      var al = af.imdb_id || af.id;
      var am = al ? af.type + '_' + al : null;
      var an = am ? D(am) : null;
      if (an) {
        ai = an;
        aj();
        return;
      }
      B(ae);
      var ao = 0x2;
      var ap = null;
      var aq = null;
      function ar() {
        ao--;
        if (ao !== 0x0) {
          return;
        }
        ai = L(ap, aq);
        if ((!ai.tmdb_display || !ai.tmdb_for_avg) && af.vote != null) {
          var as = parseFloat(af.vote);
          if (!isNaN(as)) {
            if (as > 0xa) {
              as = as / 0xa;
            }
            if (as < 0x0) {
              as = 0x0;
            }
            if (as > 0xa) {
              as = 0xa;
            }
            ai.tmdb_for_avg = as;
            ai.tmdb_display = as.toFixed(0x1);
          }
        }
        if (am && ai && (ai.tmdb_display || ai.imdb_display || ai.mc_display || ai.rt_display || ai.popcorn_display || ai.trakt_display || ai.letterboxd_display || ai.oscars || ai.emmy || ai.awards)) {
          E(am, ai);
        }
        aj();
      }
      J(af, function (as) {
        ap = as || {};
        ar();
      });
      K(af, function (as) {
        aq = as || {};
        ar();
      });
    }
    if (!af.imdb_id) {
      I(af.id, af.type, function (al) {
        af.imdb_id = al;
        ak();
      });
    } else {
      ak();
    }
  }
  function U() {
    var ad = Lampa.Storage.get("ratings_omdb_key", k.ratings_omdb_key);
    var ae = Lampa.Storage.get("ratings_mdblist_key", k.ratings_mdblist_key);
    var af = Lampa.Storage.get("ratings_layout", "horizontal");
    var ag = !!Lampa.Storage.field("ratings_bw_logos", false);
    var ah = !!Lampa.Storage.field("ratings_show_awards", true);
    var ai = !!Lampa.Storage.field("ratings_show_average", true);
    var aj = parseInt(Lampa.Storage.get("ratings_logo_offset", 0x0), 0xa);
    if (isNaN(aj)) {
      aj = 0x0;
    }
    var ak = parseInt(Lampa.Storage.get("ratings_font_offset", k.ratings_font_offset), 0xa);
    if (isNaN(ak)) {
      ak = 0x0;
    }
    var al = parseFloat(Lampa.Storage.get("ratings_badge_alpha", 0.15));
    if (isNaN(al)) {
      al = 0.15;
    }
    if (al < 0x0) {
      al = 0x0;
    }
    if (al > 0x1) {
      al = 0x1;
    }
    var am = parseInt(Lampa.Storage.get("ratings_badge_tone", 0x0), 0xa);
    if (isNaN(am)) {
      am = 0x0;
    }
    if (am < 0x0) {
      am = 0x0;
    }
    if (am > 0xff) {
      am = 0xff;
    }
    var an = parseInt(Lampa.Storage.get("ratings_gap_step", 0x0), 0xa);
    if (isNaN(an) || an < 0x0) {
      an = 0x0;
    }
    var ao = !!Lampa.Storage.field("ratings_colorize_all", false);
    var ap = !!Lampa.Storage.field("ratings_enable_imdb", true);
    var aq = !!Lampa.Storage.field("ratings_enable_tmdb", true);
    var ar = !!Lampa.Storage.field("ratings_enable_mc", true);
    var as = !!Lampa.Storage.field("ratings_enable_rt", true);
    var at = !!Lampa.Storage.field("ratings_enable_popcorn", true);
    var au = !!Lampa.Storage.field("ratings_enable_trakt", true);
    var av = !!Lampa.Storage.field("ratings_enable_letterboxd", true);
    var aw = !!Lampa.Storage.field("ratings_poster_badges", false);
    var ax = !!Lampa.Storage.field("ratings_rate_border", false);
    return {
      'omdbKey': ad || '',
      'mdblistKey': ae || '',
      'layout': af,
      'bwLogos': ag,
      'showAwards': ah,
      'showAverage': ai,
      'logoOffset': aj,
      'fontOffset': ak,
      'badgeAlpha': al,
      'badgeTone': am,
      'gapStep': an,
      'colorizeAll': ao,
      'enableImdb': ap,
      'enableTmdb': aq,
      'enableMc': ar,
      'enableRt': as,
      'enablePop': at,
      'enableTrakt': au,
      'enableLetterboxd': av,
      'enablePosterBadges': aw,
      'rateBorder': ax
    };
  }
  function V() {
    var ad = U();
    c.apiKeys.omdb = ad.omdbKey || '';
    c.apiKeys.mdblist = ad.mdblistKey || '';
    c.monochromeIcons = ad.bwLogos;
    if (ad.bwLogos) {
      $("body").addClass("lmp-enh--mono");
    } else {
      $("body").removeClass("lmp-enh--mono");
    }
    return ad;
  }
  function W(ad) {
    var ae = document.querySelectorAll(".rate--oscars, .rate--emmy, .rate--awards");
    ae.forEach(function (af) {
      if (ad) {
        af.style.removeProperty("display");
      } else {
        af.style.setProperty("display", "none", "important");
      }
    });
  }
  function X(ad) {
    var ae = document.querySelectorAll(".rate--avg");
    ae.forEach(function (af) {
      if (ad) {
        af.style.removeProperty("display");
      } else {
        af.style.setProperty("display", "none", "important");
      }
    });
  }
  function Y(ad) {
    var ae = parseFloat(ad) || 0x0;
    var af = document.querySelectorAll(".full-start__rate");
    af.forEach(function (ag) {
      ag.style.fontSize = '';
      var ai = parseFloat(getComputedStyle(ag).fontSize);
      if (isNaN(ai)) {
        ai = 0x17;
      }
      var aj = Math.max(0x1, ai + ae);
      ag.style.fontSize = aj + 'px';
    });
  }
  function Z(ad) {
    var af = (0x1c + (parseFloat(ad) || 0x0)) / 0x1c;
    if (af < 0.1) {
      af = 0.1;
    }
    var ag = document.querySelectorAll(".full-start__rate .source--name img,.rate--imdb > div:nth-child(2) img,.rate--tmdb > div:nth-child(2) img,.lmp-award-icon img");
    function ah(ai) {
      if (!ai) {
        return null;
      }
      var aj = getComputedStyle(document.documentElement).getPropertyValue(ai);
      var ak = parseFloat(aj);
      return isNaN(ak) ? null : ak;
    }
    ag.forEach(function (ai) {
      var aj = null;
      if (ai.closest(".rate--imdb")) {
        aj = "--lmp-h-imdb";
      } else {
        if (ai.closest(".rate--tmdb")) {
          aj = "--lmp-h-tmdb";
        } else {
          if (ai.closest(".rate--mc")) {
            aj = "--lmp-h-mc";
          } else {
            if (ai.closest(".rate--rt")) {
              aj = "--lmp-h-rt";
            } else {
              if (ai.closest(".rate--popcorn")) {
                aj = "--lmp-h-popcorn";
              } else {
                if (ai.closest(".rate--trakt")) {
                  aj = "--lmp-h-trakt";
                } else {
                  if (ai.closest(".rate--letterboxd")) {
                    aj = "--lmp-h-letterboxd";
                  } else {
                    if (ai.closest(".rate--awards")) {
                      aj = "--lmp-h-awards";
                    } else {
                      if (ai.closest(".rate--avg")) {
                        aj = "--lmp-h-avg";
                      } else {
                        if (ai.closest(".rate--oscars") || ai.closest(".lmp-award-icon--oscar")) {
                          aj = "--lmp-h-oscar";
                        } else {
                          if (ai.closest(".rate--emmy") || ai.closest(".lmp-award-icon--emmy")) {
                            aj = "--lmp-h-emmy";
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      var ak = ah(aj);
      if (!ak || ak <= 0x0) {
        ak = 0x18;
      }
      var al = Math.max(0x1, ak * af);
      ai.style.height = al + 'px';
      ai.style.maxHeight = al + 'px';
    });
  }
  function a0(ad, ae) {
    var af = "rgba(" + ad + ',' + ad + ',' + ad + ',' + ae + ')';
    var ag = document.querySelectorAll(".full-start__rate");
    ag.forEach(function (ah) {
      ah.style.background = af;
      var ai = ah.firstElementChild;
      if (ai) {
        ai.style.background = af;
      }
    });
  }
  function a1(ad) {
    var ae = document.querySelectorAll(".full-start-new__rate-line, .full-start__rate-line");
    var af = 0.3 + ad * 0.1;
    ae.forEach(function (ag) {
      var ah = ag.children;
      for (var ai = 0x0; ai < ah.length; ai++) {
        var aj = ah[ai];
        aj.style.setProperty("margin-right", af + 'em', "important");
      }
      if (ag.lastElementChild) {
        ag.lastElementChild.style.setProperty("margin-right", '0', "important");
      }
    });
  }
  function a2(ad) {
    var ae = document.querySelectorAll(".full-start__rate .source--name img,.rate--imdb > div:nth-child(2) img,.rate--tmdb > div:nth-child(2) img,.lmp-award-icon img");
    var af = ad ? "grayscale(100%)" : '';
    ae.forEach(function (ag) {
      ag.style.filter = af;
    });
  }
  function a3() {
    var ad = U();
    if (ad.bwLogos) {
      $("body").addClass("lmp-enh--mono");
    } else {
      $("body").removeClass("lmp-enh--mono");
    }
    if (ad.layout === "vertical") {
      $("body").addClass("lmp-enh--layout-vertical");
    } else {
      $("body").removeClass("lmp-enh--layout-vertical");
    }
    if (ad.rateBorder) {
      $("body").addClass("lmp-enh--rate-border");
    } else {
      $("body").removeClass("lmp-enh--rate-border");
    }
    W(ad.showAwards);
    X(ad.showAverage);
    Y(ad.fontOffset);
    Z(ad.logoOffset);
    a0(ad.badgeTone, ad.badgeAlpha);
    a1(ad.gapStep);
    a2(ad.bwLogos);
  }
  function a4() {
    if (window.__lmpRatingsPatchedStorage) {
      return;
    }
    window.__lmpRatingsPatchedStorage = true;
    var ad = Lampa.Storage.set;
    Lampa.Storage.set = function (ae, af) {
      var ag = ad.apply(this, arguments);
      if (typeof ae === "string" && ae.indexOf("ratings_") === 0x0) {
        setTimeout(function () {
          a3();
        }, 0x0);
      }
      return ag;
    };
  }
  var a5 = function () {
    var ad;
    return function () {
      clearTimeout(ad);
      ad = setTimeout(function () {
        a3();
      }, 0x96);
    };
  }();
  function a6() {
    if (typeof Lampa.Storage.get("ratings_show_awards") === "undefined") {
      Lampa.Storage.set("ratings_show_awards", true);
    }
    if (typeof Lampa.Storage.get("ratings_show_average") === "undefined") {
      Lampa.Storage.set("ratings_show_average", true);
    }
  }
  function a7() {
    var ad = function () {
      var af;
      return function () {
        clearTimeout(af);
        af = setTimeout(function () {
          try {
            var ag = Lampa.Activity.active();
            var ah = ag && ag.activity && ag.activity.render && ag.activity.render();
            if (ah) {
              var ai = ah.data("lmp_ratings_data");
              if (typeof ai === "object" && ai) {
                P(ai, ah);
                R(ai, ah);
                S(ai, ah);
              }
            }
          } catch (aj) {}
          a3();
          try {
            a8();
          } catch (ak) {}
        }, 0x96);
      };
    }();
    function ae(af) {
      var ag = af.target;
      if (!ag) {
        return;
      }
      var ah = ag.getAttribute("name") || ag.getAttribute("data-name") || '';
      if (ah && ah.indexOf("ratings_") === 0x0) {
        ad();
      }
    }
    document.addEventListener("input", ae, true);
    document.addEventListener("change", ae, true);
    document.addEventListener("click", function (af) {
      var ag = af.target.closest("[data-name^=\"ratings_\"],[name^=\"ratings_\"]");
      if (ag) {
        ad();
      }
    }, true);
    document.addEventListener("keyup", ae, true);
    try {
      if (Lampa.SettingsApi && Lampa.SettingsApi.listener && Lampa.SettingsApi.listener.follow) {
        Lampa.SettingsApi.listener.follow("change", function (af) {
          if (af && af.name && af.name.indexOf("ratings_") === 0x0) {
            ad();
          }
        });
      }
    } catch (af) {}
  }
  function a8() {
    $(".card__view .card__lmerating").remove();
    var ad = U();
    if (!ad.enablePosterBadges) {
      return;
    }
    $(".card").each(function () {
      var ae = $(this);
      var af = ae.find(".card__view");
      var ag = ae.data("card") || {};
      var ah = ag.number_of_seasons ? 'tv' : "movie";
      var ai = "poster_" + ({
        'id': ag.id,
        'type': ah,
        'imdb_id': ag.imdb_id
      }.type || n({
        'id': ag.id,
        'type': ah,
        'imdb_id': ag.imdb_id
      })) + '_' + ({
        'id': ag.id,
        'type': ah,
        'imdb_id': ag.imdb_id
      }.imdb_id || {
        'id': ag.id,
        'type': ah,
        'imdb_id': ag.imdb_id
      }.id);
      var aj = D(ai);
      if (aj && aj._mdblist_ratings) {
        O(aj._mdblist_ratings, af);
      }
    });
  }
  function a9() {
    Lampa.Listener.follow("line", function (ad) {
      if (ad.type !== "append") {
        return;
      }
      var ae = U();
      if (!ae.enablePosterBadges) {
        ad.items.forEach(function (af) {
          try {
            af.card.find(".card__view .card__lmerating").remove();
          } catch (ag) {}
        });
        return;
      }
      ad.items.forEach(function (af) {
        var ag = af && af.data;
        var ah = af && af.card && af.card.find(".card__view");
        if (!ag || !ah || !ah.length) {
          return;
        }
        var ai = ag.number_of_seasons ? 'tv' : "movie";
        var aj = "poster_" + ({
          'id': ag.id,
          'type': ai,
          'imdb_id': ag.imdb_id
        }.type || n({
          'id': ag.id,
          'type': ai,
          'imdb_id': ag.imdb_id
        })) + '_' + ({
          'id': ag.id,
          'type': ai,
          'imdb_id': ag.imdb_id
        }.imdb_id || {
          'id': ag.id,
          'type': ai,
          'imdb_id': ag.imdb_id
        }.id);
        var ak = D(aj);
        if (ak && ak._mdblist_ratings) {
          O(ak._mdblist_ratings, ah);
          return;
        }
        J({
          'id': ag.id,
          'type': ai
        }, function (al) {
          if (al && al._mdblist_ratings) {
            E(aj, {
              '_mdblist_ratings': al._mdblist_ratings
            });
            O(al._mdblist_ratings, ah);
          }
        });
      });
    });
  }
  function aa() {
    if (window.lmp_ratings_add_param_ready) {
      return;
    }
    window.lmp_ratings_add_param_ready = true;
    Lampa.SettingsApi.addComponent({
      'component': "lmp_ratings",
      'name': "Рейтинги",
      'icon': "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 3l3.09 6.26L22 10.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 15.14l-5-4.87 6.91-1.01L12 3z\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></svg>"
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_omdb_key",
        'type': "input",
        'values': '',
        'default': k.ratings_omdb_key
      },
      'field': {
        'name': "API ключ (OMDb)",
        'description': "Введи свій ключ OMDb. Можна отримати на omdbapi.com"
      },
      'onRender': function (ad) {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_mdblist_key",
        'type': "input",
        'values': '',
        'default': k.ratings_mdblist_key
      },
      'field': {
        'name': "API ключ (MDBList)",
        'description': "Введи свій ключ MDBList. Можна отримати на mdblist.com"
      },
      'onRender': function (ad) {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_layout",
        'type': "select",
        'values': {
          'horizontal': "Горизонтальний",
          'vertical': "Вертикальний"
        },
        'default': "horizontal"
      },
      'field': {
        'name': "Вигляд",
        'description': "Оберіть орієнтацію іконок та цифр у блоках рейтингів"
      },
      'onChange': function () {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_bw_logos",
        'type': "trigger",
        'values': '',
        'default': false
      },
      'field': {
        'name': "Монохромний режим (Ч/Б логотипи)",
        'description': "Чорно-білі логотипи рейтингів"
      },
      'onRender': function (ad) {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_rate_border",
        'type': "trigger",
        'default': false
      },
      'field': {
        'name': "Рамка плиток рейтингів",
        'description': "Додає рамку навколо кожної плитки (IMDb, Metacritic, Rotten, Popcorn, TMDB, AVG, Awards)."
      },
      'onRender': function () {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_show_awards",
        'type': "trigger",
        'values': '',
        'default': true
      },
      'field': {
        'name': "Нагороди",
        'description': "Показувати Оскари, Еммі та інші нагороди."
      },
      'onRender': function (ad) {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_show_average",
        'type': "trigger",
        'values': '',
        'default': true
      },
      'field': {
        'name': "Середній рейтинг",
        'description': "Показувати середній рейтинг"
      },
      'onRender': function (ad) {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_logo_offset",
        'type': "input",
        'values': '',
        'default': 0x0
      },
      'field': {
        'name': "Розмір логотипів рейтингів",
        'description': "Зміна висоти логотипів. \n\"0\" – стандарт, вводимо від \"1\" чи від \"-1\"."
      },
      'onRender': function (ad) {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_font_offset",
        'type': "input",
        'values': '',
        'default': k.ratings_font_offset
      },
      'field': {
        'name': "Розмір числа рейтингу",
        'description': "Зміна розміру числа рейтингу та розміру фону. \n\"0\" – стандарт, вводимо від \"1\" чи від \"-1\"."
      },
      'onRender': function (ad) {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_badge_alpha",
        'type': "input",
        'values': '',
        'default': 0.15
      },
      'field': {
        'name': "Прозорість фону під рейтингом",
        'description': "Прозорість фону. Стандартне значення: \"0.15\". \n\"0\" – прозорий, \"1\" – чорний."
      },
      'onRender': function (ad) {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_badge_tone",
        'type': "input",
        'values': '',
        'default': 0x0
      },
      'field': {
        'name': "Яскравість плиток",
        'description': "Яскравість плиток. \n\"0\" – чорний. Від 0 до 255 (напр. \"50\" - темно-сірий)."
      },
      'onRender': function (ad) {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_gap_step",
        'type': "input",
        'values': '',
        'default': 0x0
      },
      'field': {
        'name': "Відступи між блоками (крок)",
        'description': "Додатковий відступ. \"0\" – стандарт (0.3em). \nЩоб збільшити - вводимо від \"1\""
      },
      'onRender': function (ad) {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_colorize_all",
        'type': "trigger",
        'default': false
      },
      'field': {
        'name': "Кольорові оцінки рейтингів",
        'description': "Кольорове виділення оцінок рейтингів"
      },
      'onRender': function () {}
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_enable_imdb",
        'type': "trigger",
        'default': true
      },
      'field': {
        'name': "IMDb",
        'description': "Показувати/ховати джерело"
      }
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_enable_tmdb",
        'type': "trigger",
        'default': true
      },
      'field': {
        'name': "TMDB",
        'description': "Показувати/ховати джерело"
      }
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_enable_mc",
        'type': "trigger",
        'default': true
      },
      'field': {
        'name': "Metacritic",
        'description': "Показувати/ховати джерело"
      }
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_enable_rt",
        'type': "trigger",
        'default': true
      },
      'field': {
        'name': "RottenTomatoes",
        'description': "Показувати/ховати джерело"
      }
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_enable_popcorn",
        'type': "trigger",
        'default': true
      },
      'field': {
        'name': "Popcornmeter",
        'description': "Показувати/ховати джерело"
      }
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_enable_trakt",
        'type': "trigger",
        'default': true
      },
      'field': {
        'name': "Trakt",
        'description': "Показувати/ховати джерело"
      }
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_enable_letterboxd",
        'type': "trigger",
        'default': true
      },
      'field': {
        'name': "Letterboxd",
        'description': "Показувати/ховати джерело"
      }
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'name': "ratings_poster_badges",
        'type': "trigger",
        'default': false
      },
      'field': {
        'name': "Додаткові рейтинги на постері",
        'description': "Показувати наявні та додаткові рейтинги на постері"
      }
    });
    Lampa.SettingsApi.addParam({
      'component': "lmp_ratings",
      'param': {
        'type': "button",
        'component': "lmp_clear_cache"
      },
      'field': {
        'name': "Очистити кеш рейтингів"
      },
      'onChange': function () {
        H();
      }
    });
  }
  function ab() {
    a6();
    aa();
    a4();
    a7();
    window.LampaRatings = window.LampaRatings || {};
    window.LampaRatings.applyStyles = a3;
    window.LampaRatings.getConfig = U;
    try {
      a9();
    } catch (ad) {}
    a3();
  }
  function ac() {
    window.combined_ratings_plugin = true;
    Lampa.Listener.follow("full", function (ad) {
      if (ad.type === "complite") {
        var ae = Lampa.Activity.active();
        var af = ae ? ae.activity.render() : null;
        if (af) {
          T(ad.data.movie || ad.object || {}, af);
        }
        __lmpTenFixStart();
      }
    });
  }
  Lampa.Template.add("lmp_enh_styles", "<style>.loading-dots-container {    display: flex;    align-items: center;    font-size: 0.85em;    color: #ccc;    padding: 0.6em 1em;    border-radius: 0.5em;}.loading-dots__text {    margin-right: 1em;}.loading-dots__dot {    width: 0.5em;    height: 0.5em;    border-radius: 50%;    background-color: currentColor;    animation: loading-dots-bounce 1.4s infinite ease-in-out both;}.loading-dots__dot:nth-child(1) { animation-delay: -0.32s; }.loading-dots__dot:nth-child(2) { animation-delay: -0.16s; }@keyframes loading-dots-bounce {    0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }    40% { transform: translateY(-0.5em); opacity: 1; }}:root {  --lmp-h-imdb: 22px;  --lmp-h-mc: 22px;  --lmp-h-rt: 24px;  --lmp-h-popcorn: 24px;  --lmp-h-tmdb: 24px;  --lmp-h-awards: 18px;  --lmp-h-avg: 18px;  --lmp-h-oscar: 20px;  --lmp-h-emmy: 22px;  --lmp-h-trakt: 24px;  --lmp-h-letterboxd: 24px;}.rate--oscars, .rate--emmy, .rate--awards, .rate--gold {    color: gold;}body.lmp-enh--mono .rate--oscars,body.lmp-enh--mono .rate--emmy,body.lmp-enh--mono .rate--awards,body.lmp-enh--mono .rate--gold,body.lmp-enh--mono .rating--green,body.lmp-enh--mono .rating--blue,body.lmp-enh--mono .rating--orange,body.lmp-enh--mono .rating--red,body.lmp-enh--mono .full-start__rate {    color: inherit !important;}body.lmp-enh--layout-vertical .full-start__rate:not(.rate--kp):not(.rate--cub) {  display: inline-flex !important;  flex-direction: column-reverse !important;  justify-content: space-between !important;  align-items: center !important;  align-self: stretch !important;  height: auto !important;  padding: 0.2em 0.1em 0.1em !important;}body.lmp-enh--layout-vertical .full-start__rate > div:first-child {  margin-top: 0.15em;  line-height: 1;}body.lmp-enh--layout-vertical .full-start__rate .source--name {  margin-bottom: 0;}.full-start__rate.rate--kp, .rate--kp, .full-start__rate.rate--cub, .rate--cub {  display: none !important;}body:not(.lmp-enh--mono) .full-start__rate.rating--green  { color: #2ecc71; }body:not(.lmp-enh--mono) .full-start__rate.rating--blue   { color: #60a5fa; }body:not(.lmp-enh--mono) .full-start__rate.rating--orange { color: #f59e0b; }body:not(.lmp-enh--mono) .full-start__rate.rating--red    { color: #ef4444; }.full-start-new__rate-line > div, .full-start__rate-line > div {    margin-right: 0.3em !important;}.full-start-new__rate-line > div:last-child, .full-start__rate-line > div:last-child {    margin-right: 0 !important;}.full-start-new__rate-line.lmp-is-loading-ratings > :not(#lmp-search-loader),.full-start__rate-line.lmp-is-loading-ratings > :not(#lmp-search-loader) {    opacity: 0 !important;    pointer-events: none !important;    transition: opacity 0.15s;}.lmp-award-icon {  display: inline-flex;  align-items: center;  justify-content: center;  line-height: 1;  height: auto;  width: auto;  flex-shrink: 0;}.lmp-award-icon img {  height: auto;  width: auto;  display: block;  object-fit: contain;}.lmp-award-icon--oscar img { height: var(--lmp-h-oscar); }.lmp-award-icon--emmy  img { height: var(--lmp-h-emmy); }.rate--imdb    .source--name img { height: var(--lmp-h-imdb); }.rate--mc      .source--name img { height: var(--lmp-h-mc); }.rate--rt      .source--name img { height: var(--lmp-h-rt); }.rate--popcorn .source--name img { height: var(--lmp-h-popcorn); }.rate--tmdb    .source--name img { height: var(--lmp-h-tmdb); }.rate--awards  .source--name img { height: var(--lmp-h-awards); }.rate--avg     .source--name img { height: var(--lmp-h-avg); }.rate--trakt   .source--name img { height: var(--lmp-h-trakt); }.rate--letterboxd .source--name img { height: var(--lmp-h-letterboxd); }.full-start__rate .source--name {  display: inline-flex;  align-items: center;  justify-content: center;}.settings-param__descr, .settings-param__subtitle { white-space: pre-line; }@media (max-width: 600px) {  .full-start-new__rate-line, .full-start__rate-line { flex-wrap: wrap; }  .full-start-new__rate-line > div, .full-start__rate-line > div {    margin-right: .25em !important;    margin-bottom: .25em !important;  }  .full-start__rate {    font-size: 16px;    min-width: unset;  }  :root {    --lmp-h-imdb: 14px; --lmp-h-mc: 14px; --lmp-h-rt: 16px;    --lmp-h-popcorn: 16px; --lmp-h-trakt: 16px; --lmp-h-letterboxd: 16px; --lmp-h-tmdb: 16px; --lmp-h-awards: 14px;    --lmp-h-avg: 14px; --lmp-h-oscar: 14px; --lmp-h-emmy: 16px;  }  .loading-dots-container { font-size: .8em; padding: .4em .8em; }  .lmp-award-icon { height: 16px; }}@media (max-width: 360px) {  .full-start__rate { font-size: 14px; }  :root {    --lmp-h-imdb: 12px; --lmp-h-mc: 12px; --lmp-h-rt: 14px;    --lmp-h-popcorn: 14px; --lmp-h-trakt: 14px; --lmp-h-letterboxd: 14px; --lmp-h-tmdb: 14px; --lmp-h-awards: 12px;    --lmp-h-avg: 12px; --lmp-h-oscar: 12px; --lmp-h-emmy: 14px;  }  .lmp-award-icon { height: 12px; }}body.lmp-enh--rate-border .full-start__rate {  border: 1px solid rgba(255, 255, 255, 0.45);  border-radius: 0.3em;  box-sizing: border-box;}body.lmp-enh--rate-border .full-start-new__rate-line, body.lmp-enh--rate-border .full-start__rate-line {}.rate--imdb.hide, .rate--tmdb.hide {  display: none !important;  opacity: 0 !important;  visibility: hidden !important;  position: absolute !important;}.rate--imdb:not(.lmp-loaded), .rate--tmdb:not(.lmp-loaded) {  display: none !important;}</style>");
  $("body").append(Lampa.Template.get("lmp_enh_styles", {}, true));
  ab();
  V();
  window.addEventListener("resize", a5);
  window.addEventListener("orientationchange", a5);
  if (!window.combined_ratings_plugin) {
    ac();
  }
})();
