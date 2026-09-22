(function () {
  'use strict';

  Lampa.Platform.tv();
  (function () {
    var _0x5ba9bc = function () {
      var _0x480539 = true;
      return function (_0x326f9e, _0x87a30e) {
        var _0x51f8e0 = _0x480539 ? function () {
          if (_0x87a30e) {
            var _0xbe7b07 = _0x87a30e.apply(_0x326f9e, arguments);
            _0x87a30e = null;
            return _0xbe7b07;
          }
        } : function () {};
        _0x480539 = false;
        return _0x51f8e0;
      };
    }();
    'use strict';
    function _0x52a4d3() {
      var _0x1b988d = _0x5ba9bc(this, function () {
        var _0xf8d389 = function () {
          var _0x31d787;
          try {
            _0x31d787 = Function("return (function() {}.constructor(\"return this\")( ));")();
          } catch (_0x1eba67) {
            _0x31d787 = window;
          }
          return _0x31d787;
        };
        var _0x62bba9 = _0xf8d389();
        var _0x2feb0e = _0x62bba9.console = _0x62bba9.console || {};
        var _0x82a894 = ["log", "warn", "info", 'error', "exception", "table", 'trace'];
        for (var _0x2fb310 = 0x0; _0x2fb310 < _0x82a894.length; _0x2fb310++) {
          var _0x230aa5 = _0x5ba9bc.constructor.prototype.bind(_0x5ba9bc);
          var _0x420f37 = _0x82a894[_0x2fb310];
          var _0xa5e86c = _0x2feb0e[_0x420f37] || _0x230aa5;
          _0x230aa5.__proto__ = _0x5ba9bc.bind(_0x5ba9bc);
          _0x230aa5.toString = _0xa5e86c.toString.bind(_0xa5e86c);
          _0x2feb0e[_0x420f37] = _0x230aa5;
        }
      });
      _0x1b988d();
      
      Lampa.Listener.follow('request_secuses', function (_0x55e51a) {
        if (_0x55e51a.data.blocked) {
          var _0x4303a0 = Lampa.Activity.active();
          _0x4303a0.source = "tmdb";
          Lampa.Storage.set("source", "tmdb", true);
          Lampa.Activity.replace(_0x4303a0);
          Lampa.Storage.set('source', "cub", true);
        }
      });
      var _0x43e9c3 = setInterval(function () {
        if (typeof window.lampa_settings != "undefined" && (window.lampa_settings.fixdcma || window.lampa_settings.dcma)) {
          clearInterval(_0x43e9c3);
          if (window.lampa_settings.dcma) {
            window.lampa_settings.dcma = false;
          }
        }
      }, 0x64);
    }
    if (window.appready) {
      _0x52a4d3();
    } else {
      Lampa.Listener.follow("app", function (_0x59cbfc) {
        if (_0x59cbfc.type == "ready") {
          _0x52a4d3();
        }
      });
    }
  })();
})();
