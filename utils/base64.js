(function (a) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = a();
  else if ("function" == typeof define && define.amd) define([], a);
  else {
    var b;
    b = "undefined" == typeof window ? "undefined" == typeof global ? "undefined" == typeof self ? this : self : global : window, b.base64js = a()
  }
})(function () {
  return function () {
    function b(d, e, g) {
      function a(j, i) {
        if (!e[j]) {
          if (!d[j]) {
            var f = "function" == typeof require && require;
            if (!i && f) return f(j, !0);
            if (h) return h(j, !0);
            var c = new Error("Cannot find module '" + j + "'");
            throw c.code = "MODULE_NOT_FOUND", c
          }
          var k = e[j] = {
            exports: {}
          };
          d[j][0].call(k.exports, function (b) {
            var c = d[j][1][b];
            return a(c || b)
          }, k, k.exports, b, d, e, g)
        }
        return e[j].exports
      }
      for (var h = "function" == typeof require && require, c = 0; c < g.length; c++) a(g[c]);
      return a
    }
    return b
  }()({
    "/": [function (a, b, c) {
      'use strict';

      function d(a) {
        var b = a.length;
        if (0 < b % 4) throw new Error("Invalid string. Length must be a multiple of 4");
        var c = a.indexOf("="); - 1 === c && (c = b);
        var d = c === b ? 0 : 4 - c % 4;
        return [c, d]
      }

      function e(a, b, c) {
        return 3 * (b + c) / 4 - c
      }

      function f(a) {
        var b, c, f = d(a),
          g = f[0],
          h = f[1],
          j = new m(e(a, g, h)),
          k = 0,
          n = 0 < h ? g - 4 : g;
        for (c = 0; c < n; c += 4) b = l[a.charCodeAt(c)] << 18 | l[a.charCodeAt(c + 1)] << 12 | l[a.charCodeAt(c + 2)] << 6 | l[a.charCodeAt(c + 3)], j[k++] = 255 & b >> 16, j[k++] = 255 & b >> 8, j[k++] = 255 & b;
        return 2 === h && (b = l[a.charCodeAt(c)] << 2 | l[a.charCodeAt(c + 1)] >> 4, j[k++] = 255 & b), 1 === h && (b = l[a.charCodeAt(c)] << 10 | l[a.charCodeAt(c + 1)] << 4 | l[a.charCodeAt(c + 2)] >> 2, j[k++] = 255 & b >> 8, j[k++] = 255 & b), j
      }

      function g(a) {
        return k[63 & a >> 18] + k[63 & a >> 12] + k[63 & a >> 6] + k[63 & a]
      }

      function h(a, b, c) {
        for (var d, e = [], f = b; f < c; f += 3) d = (16711680 & a[f] << 16) + (65280 & a[f + 1] << 8) + (255 & a[f + 2]), e.push(g(d));
        return e.join("")
      }

      function j(a) {
        for (var b, c = a.length, d = c % 3, e = [], f = 16383, g = 0, j = c - d; g < j; g += f) e.push(h(a, g, g + f > j ? j : g + f));
        return 1 === d ? (b = a[c - 1], e.push(k[b >> 2] + k[63 & b << 4] + "==")) : 2 === d && (b = (a[c - 2] << 8) + a[c - 1], e.push(k[b >> 10] + k[63 & b >> 4] + k[63 & b << 2] + "=")), e.join("")
      }
      c.byteLength = function (a) {
        var b = d(a),
          c = b[0],
          e = b[1];
        return 3 * (c + e) / 4 - e
      }, c.toByteArray = f, c.fromByteArray = j;
      for (var k = [], l = [], m = "undefined" == typeof Uint8Array ? Array : Uint8Array, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, p = n.length; o < p; ++o) k[o] = n[o], l[n.charCodeAt(o)] = o;
      l[45] = 62, l[95] = 63
    }, {}]
  }, {}, [])("/")
});
