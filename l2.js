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

    Lampa.Listener.follow('full', function (a) {
        if (a.type == 'complite' && "1" != Lampa.Storage.get("logo_glav")) {
            var movie = a.data.movie;
            var type = movie.name ? 'tv' : 'movie';
            var render = a.object.activity.render();
            var title = render.find(".full-start-new__title");
            var head = render.find(".full-start-new__head");
            var details = render.find(".full-start-new__details");

            if (!movie.id) return;

            var lang = Lampa.Storage.get("language");
            var size = Lampa.Storage.get("logo_size", "w500");
            var infoScale = parseFloat(Lampa.Storage.get("logo_info_scale", "1"));
            var timeScale = parseFloat(Lampa.Storage.get("logo_time_scale", "1"));

            var url = "http://apitmdb.cubnotrip.top/3/" + type + "/" + movie.id + "/images?api_key=" + Lampa.TMDB.key() + "&include_image_language=" + lang + ",en,null";

            $.get(url, function (response) {
                var logo_path = (response.logos && response.logos.length > 0) ? (response.logos.find(l => l.iso_639_1 == lang) || response.logos.find(l => l.iso_639_1 == 'en') || response.logos[0]).file_path : null;

                if (!logo_path) return;

                var logo_url = Lampa.TMDB.image("/t/p/" + (size === "original" ? "original" : size) + logo_path.replace(".svg", ".png"));

                // Функція рендеру логотипу (з плашкою або без)
                function renderLogo(needBadge) {
                    var img = needBadge
                        ? '<div style="display:inline-block; background-color:rgba(128,128,128,0.6); padding:8px 16px; border-radius:8px; margin-top:5px;"><img style="max-height:125px; display:block;" src="' + logo_url + '"/></div>'
                        : '<img style="margin-top:5px; max-height:125px;" src="' + logo_url + '"/>';
                    title.html(img);
                }

                // Аналіз яскравості логотипу через Canvas
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
                        var visiblePixels = 0;

                        for (var i = 0; i < data.length; i += 4) {
                            var alpha = data[i + 3];
                            if (alpha < 50) continue; // ігноруємо прозорі пікселі

                            var r = data[i], g = data[i + 1], b = data[i + 2];
                            // Формула сприйняття яскравості людським оком
                            var brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                            totalBrightness += brightness;
                            visiblePixels++;
                        }

                        if (visiblePixels === 0) {
                            renderLogo(true); // пусте/прозоре — про всяк випадок з плашкою
                            return;
                        }

                        var avgBrightness = totalBrightness / visiblePixels;
                        // Якщо середня яскравість < 100 — лого темне, треба плашка
                        // Поріг можна крутити: 80 = темніше, 130 = світліше
                        renderLogo(avgBrightness < 100);
                    } catch (e) {
                        // Якщо CORS заважає — просто рендеримо без плашки
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
                    var time_html = time_match ? '<span class="time-badge" style="font-size:' + (timeScale * 100) + '%;">' + time_match[0] + '</span>' : '';

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
