(function () {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = `
        .time-badge {
            background-color: #3498DB;
            color: white;
            padding: 2px 8px;
            border-radius: 6px;
            margin-right: 8px;
            font-weight: bold;
            display: inline-block;
            vertical-align: middle;
        }
        .info-row {
            display: block;
            width: 100%;
            margin-bottom: 5px;
        }
        /* Ховаємо оригінальний текст назви, поки не підставиться логотип */
        .full-start-new__title.logo-pending {
            opacity: 0 !important;
            transition: none !important;
        }
        .full-start-new__title.logo-ready {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);

    function getScaleValues() {
        var vals = {};
        for (var i = 5; i <= 20; i++) {
            var val = (i / 10).toString();
            vals[val] = (i * 10) + "%";
        }
        return vals;
    }

    Lampa.SettingsApi.addParam({
        component: "interface",
        param: { name: "logo_glav", type: "select", values: { 1: "Приховати", 0: "Відображати" }, default: "0" },
        field: { name: "Логотипи замість назв", description: "Відображає логотипи фільмів замість тексту" }
    });
    Lampa.SettingsApi.addParam({
        component: "interface",
        param: { name: "logo_size", type: "select", values: { w300: "w300", w500: "w500", w780: "w780", original: "Оригінал" }, default: "w500" },
        field: { name: "Розмір логотипу", description: "Розмір зображення" }
    });
    Lampa.SettingsApi.addParam({
        component: "interface",
        param: { name: "logo_hide_year", type: "trigger", default: true },
        field: { name: "Приховувати рік та країну над логотипом", description: "Переносить рік випуску та країну під логотип" }
    });
    Lampa.SettingsApi.addParam({
        component: "interface",
        param: { name: "logo_info_scale", type: "select", values: getScaleValues(), default: "1" },
        field: { name: "Масштаб інформації", description: "Масштаб для тексту." }
    });
    Lampa.SettingsApi.addParam({
        component: "interface",
        param: { name: "logo_time_scale", type: "select", values: getScaleValues(), default: "1" },
        field: { name: "Масштаб часу", description: "Масштаб тільки для плашки часу." }
    });

    if (window.logoplugin) return;
    window.logoplugin = true;

    // ===== MutationObserver: ловимо появу title якомога раніше =====
    function hideTitleText(el) {
        if (!el || el.classList.contains('logo-pending') || el.classList.contains('logo-ready')) return;
        el.classList.add('logo-pending');
        // Додатково чистимо текст, щоб точно не промайнув
        if (el.textContent && el.textContent.trim().length > 0) {
            el.dataset.originalTitle = el.textContent;
            el.textContent = '';
        }
    }

    var titleObserver = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var nodes = mutations[i].addedNodes;
            for (var j = 0; j < nodes.length; j++) {
                var node = nodes[j];
                if (node.nodeType !== 1) continue;

                // Сам елемент title
                if (node.classList && node.classList.contains('full-start-new__title')) {
                    hideTitleText(node);
                }
                // Або title всередині доданого блоку
                var titles = node.querySelectorAll ? node.querySelectorAll('.full-start-new__title') : [];
                for (var t = 0; t < titles.length; t++) {
                    hideTitleText(titles[t]);
                }
            }
        }
    });

    titleObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ===== Основна логіка плагіна =====
    Lampa.Listener.follow('full', function (a) {
        if (a.type == 'complite' && "1" != Lampa.Storage.get("logo_glav")) {
            var movie = a.data.movie;
            var type = movie.name ? 'tv' : 'movie';
            var render = a.object.activity.render();
            var title = render.find(".full-start-new__title");
            var head = render.find(".full-start-new__head");
            var details = render.find(".full-start-new__details");

            if (!movie.id || !title.length) return;

            // Миттєво ховаємо назву (навіть якщо observer ще не встиг)
            hideTitleText(title[0]);

            var lang = Lampa.Storage.get("language");
            var size = Lampa.Storage.get("logo_size", "w500");
            var infoScale = parseFloat(Lampa.Storage.get("logo_info_scale", "1"));
            var timeScale = parseFloat(Lampa.Storage.get("logo_time_scale", "1"));

            var url = "http://apitmdb.cubnotrip.top/3/" + type + "/" + movie.id + "/images?api_key=" + Lampa.TMDB.key() + "&include_image_language=" + lang + ",en,null";

            $.get(url, function (response) {
                var logo_path = (response.logos && response.logos.length > 0)
                    ? (response.logos.find(l => l.iso_639_1 == lang) || response.logos.find(l => l.iso_639_1 == 'en') || response.logos[0]).file_path
                    : null;

                if (!logo_path) {
                    // Логотипу немає — повертаємо оригінальну назву
                    if (title[0].dataset.originalTitle) {
                        title[0].textContent = title[0].dataset.originalTitle;
                    }
                    title[0].classList.remove('logo-pending');
                    title[0].classList.add('logo-ready');
                    return;
                }

                var logo_url = Lampa.TMDB.image("/t/p/" + (size === "original" ? "original" : size) + logo_path.replace(".svg", ".png"));

                function renderLogo(needBadge) {
                    var img = needBadge
                        ? '<div style="display:inline-block; background-color:rgba(128,128,128,0.6); padding:8px 16px; border-radius:8px; margin-top:5px;"><img style="max-height:125px; display:block;" src="' + logo_url + '"/></div>'
                        : '<img style="margin-top:5px; max-height:125px;" src="' + logo_url + '"/>';

                    title.html(img);
                    title[0].classList.remove('logo-pending');
                    title[0].classList.add('logo-ready');
                }

                // Аналіз яскравості та насиченості
                var testImg = new Image();
                testImg.crossOrigin = "anonymous";

                testImg.onload = function () {
                    try {
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        var w = canvas.width = Math.min(testImg.width, 200);
                        var h = canvas.height = Math.min(testImg.height, 100);
                        ctx.drawImage(testImg, 0, 0, w, h);

                        var data = ctx.getImageData(0, 0, w, h).data;
                        var totalBrightness = 0;
                        var totalSaturation = 0;
                        var visiblePixels = 0;

                        for (var i = 0; i < data.length; i += 4) {
                            var alpha = data[i + 3];
                            if (alpha < 50) continue;

                            var r = data[i], g = data[i + 1], b = data[i + 2];
                            var brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                            var max = Math.max(r, g, b);
                            var min = Math.min(r, g, b);
                            var saturation = max === 0 ? 0 : (max - min) / max;

                            totalBrightness += brightness;
                            totalSaturation += saturation;
                            visiblePixels++;
                        }

                        if (visiblePixels === 0) {
                            renderLogo(true);
                            return;
                        }

                        var avgBrightness = totalBrightness / visiblePixels;
                        var avgSaturation = totalSaturation / visiblePixels;
                        var needBadge = (avgBrightness < 120) && (avgSaturation < 0.35);

                        renderLogo(needBadge);
                    } catch (e) {
                        renderLogo(false);
                    }
                };

                testImg.onerror = function () {
                    renderLogo(false);
                };

                testImg.src = logo_url;

                render.find(".full-start-new__tagline").remove();

                if (Lampa.Storage.get("logo_hide_year", true)) {
                    var head_html = (head.html() || "");
                    var details_html = details.html() || "";

                    var time_match = details_html.match(/(\d{1,2}:\d{2})/);
                    var time_html = time_match
                        ? '<span class="time-badge" style="font-size:' + (timeScale * 100) + '%;">' + time_match[0] + '</span>'
                        : '';

                    var clean_details = details_html
                        .replace(/(\d{1,2}:\d{2})\s?●\s?/, '')
                        .replace(/(\d{1,2}:\d{2})/, '')
                        .replace(/●/g, '   ●   ');

                    details.html(
                        '<div class="info-row" style="font-size:' + (infoScale * 100) + '%;">' + time_html + clean_details + '</div>' +
                        '<div class="info-row" style="font-size:' + (infoScale * 100) + '%;">' + head_html + '</div>'
                    );
                    head.remove();
                }
            });
        }
    });
})();
