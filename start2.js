(function () {
    'use strict';

    (function () {
        'use strict';

        // --- Анти-дебаг захист (обфускація) ---
        // Ці конструкції перевіряють, чи не підмінено функції (self-defending code).
        // Їх можна безпечно прибрати, вони не впливають на логіку плагіна.
        (function () {
            var check1 = (function () {
                var flag = true;
                return function (ctx, fn) {
                    var wrapped = flag ? function () {
                        if (fn) {
                            var result = fn.apply(ctx, arguments);
                            fn = null;
                            return result;
                        }
                    } : function () {};
                    flag = false;
                    return wrapped;
                };
            }());

            var check2 = (function () {
                var flag = true;
                return function (ctx, fn) {
                    var wrapped = flag ? function () {
                        if (fn) {
                            var result = fn.apply(ctx, arguments);
                            fn = null;
                            return result;
                        }
                    } : function () {};
                    flag = false;
                    return wrapped;
                };
            }());

            function main() {
                // Перевірка цілісності toString
                var selfCheck = check1(this, function () {
                    return selfCheck.toString()
                        .search('(((.+)+)+)+$')
                        .toString()
                        .constructor(selfCheck)
                        .search('(((.+)+)+)+$');
                });
                selfCheck();

                // Підміна console методів (анти-дебаг)
                var consoleCheck = check2(this, function () {
                    var getGlobal = function () {
                        var global;
                        try {
                            global = Function('return (function() {}.constructor("return this")( ));')();
                        } catch (e) {
                            global = window;
                        }
                        return global;
                    };

                    var globalObj = getGlobal();
                    var consoleObj = globalObj.console = globalObj.console || {};
                    var methods = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];

                    for (var i = 0; i < methods.length; i++) {
                        var boundFn = check2.constructor.prototype.bind(check2);
                        var methodName = methods[i];
                        var original = consoleObj[methodName] || boundFn;

                        boundFn.__proto__ = check2.bind(check2);
                        boundFn.toString = original.toString.bind(original);
                        consoleObj[methodName] = boundFn;
                    }
                });
                consoleCheck();

                // --- Основна логіка плагіна ---

                // Підписка на подію успішного запиту
                Lampa.Listener.follow('request_secuses', function (event) {
                    if (event.data.blocked) {
                        var activeActivity = Lampa.Activity.active();

                        activeActivity.source = 'tmdb';
                        Lampa.Storage.set('source', 'tmdb', true);
                        Lampa.Activity.replace(activeActivity);
                        Lampa.Storage.set('source', 'cub', true);
                    }
                });

                // Таймер для вимкнення 'fixdcma'/'dcma'
                var settingsCheckInterval = setInterval(function () {
                    if (typeof window.lampa_settings !== 'undefined' &&
                        (window.lampa_settings.fixdcma || window.lampa_settings.dcma)) {
                        clearInterval(settingsCheckInterval);

                        if (window.lampa_settings.dcma) {
                            window.lampa_settings.dcma = false;
                        }
                    }
                }, 100);
            }

            // Запуск
            if (window.appready) {
                main();
            } else {
                Lampa.Listener.follow('app', function (event) {
                    if (event.type === 'ready') {
                        main();
                    }
                });
            }
        }());
    }());
})();
