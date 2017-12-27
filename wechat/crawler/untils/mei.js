(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports["MEI"] = factory();
  else
    root["MEI"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/  // The module cache
/******/  var installedModules = {};
/******/
/******/  // The require function
/******/  function __webpack_require__(moduleId) {
/******/
/******/    // Check if module is in cache
/******/    if(installedModules[moduleId]) {
/******/      return installedModules[moduleId].exports;
/******/    }
/******/    // Create a new module (and put it into the cache)
/******/    var module = installedModules[moduleId] = {
/******/      i: moduleId,
/******/      l: false,
/******/      exports: {}
/******/    };
/******/
/******/    // Execute the module function
/******/    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/    // Flag the module as loaded
/******/    module.l = true;
/******/
/******/    // Return the exports of the module
/******/    return module.exports;
/******/  }
/******/
/******/
/******/  // expose the modules object (__webpack_modules__)
/******/  __webpack_require__.m = modules;
/******/
/******/  // expose the module cache
/******/  __webpack_require__.c = installedModules;
/******/
/******/  // define getter function for harmony exports
/******/  __webpack_require__.d = function(exports, name, getter) {
/******/    if(!__webpack_require__.o(exports, name)) {
/******/      Object.defineProperty(exports, name, {
/******/        configurable: false,
/******/        enumerable: true,
/******/        get: getter
/******/      });
/******/    }
/******/  };
/******/
/******/  // getDefaultExport function for compatibility with non-harmony modules
/******/  __webpack_require__.n = function(module) {
/******/    var getter = module && module.__esModule ?
/******/      function getDefault() { return module['default']; } :
/******/      function getModuleExports() { return module; };
/******/    __webpack_require__.d(getter, 'a', getter);
/******/    return getter;
/******/  };
/******/
/******/  // Object.prototype.hasOwnProperty.call
/******/  __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/  // __webpack_public_path__
/******/  __webpack_require__.p = "";
/******/
/******/  // Load entry module and return exports
/******/  return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var Shop = __webpack_require__(2)
var Store = __webpack_require__(3)
var date = __webpack_require__(4)
var money = __webpack_require__(5)

console.log(date.getSystemTime('yyyy-MM-dd'))

module.exports = {
    date: date,
    money: money,
    shop: Shop,
    store: Store
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {
    getList: function () {
        alert(111)
    }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
    getById: function (id) {
        console.log(222);
    }
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * 返回时间区间
 * @param  {[type]} d      []
 * @param  {[type]} f      [description]
 * @param  {[type]} date   [截止时间，默认]
 * @param  {[type]} format [返回的时间格式，默认yyyyMMdd]
 * @return {[type]}        [description]
 */
function recentDate (d, f, date, format) {
  var curDate = ''
  if (typeof d === 'undefined') {
    return
  }
  curDate = typeof date !== 'undefined' ? this.formatDate(date, format || 'yyyyMMdd') : this.getSystemTime(format || 'yyyyMMdd')
  var startDate = this.formatDate(this.diffDateAdd(curDate, -d, f || 'd'), format || 'yyyyMMdd')

  return {
    startDate: startDate,
    endDate: curDate
  }
}

// 获取系统时间
// getSystemTime()  2017-12-27 17:52:53
// getSystemTime('yyyy-MM-dd') 2017-12-27
//
function getSystemTime (format) {
  var date = new Date()
  return this.formatDate(date, format)
}

function formatDate (date, format) {
  var arr = []
  if (!date || date === '0') {
    return ''
  }
  if (!format) {
    format = 'yyyy-MM-dd hh:mm:ss'
  }
  if (typeof date === 'string') {
    if (date.length === 8) {
      arr = [date.substr(0, 4), date.substr(4, 2), date.substr(6, 2)]
    } else if (date.length === 14) {
      arr = [date.substr(0, 4), date.substr(4, 2), date.substr(6, 2), date.substr(8, 2), date.substr(10, 2), date.substr(12, 2)]
    } else {
      arr = date.split(/[^0-9]+/)
    }
    format = format.replace(/([a-z])\1+/ig, function (all, $1) {
      var result = {
        y: ~~arr[0],
        M: ~~arr[1],
        d: ~~arr[2],
        h: ~~arr[3],
        m: ~~arr[4],
        s: ~~arr[5]
      }[$1]
      if (result !== undefined && result < 10) {
        result = '0' + result
      }
      return result || ''
    })
    return format
  }
  format = format.replace(/([a-z])\1+/ig, function (all) {
    var first = all.charAt(0)
    if ('y M d h m s'.indexOf(first) >= 0) {
      if (first === 'y') {
        return all.length > 2 ? date.getFullYear() : (date.getFullYear() + '').substr(2)
      }
      var result = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
      }[first]
      result !== undefined && result < 10 && (result = '0' + result)
      return result
    } else {
      return all
    }
  })
  return format
}

function formatTime (date) {
  var arr = []
  if (typeof date === 'string') {
    if (date.length === 8) {
      arr = [date.substr(0, 4), date.substr(4, 2), date.substr(6, 2)]
    } else if (date.length === 14) {
      arr = [date.substr(0, 4), date.substr(4, 2), date.substr(6, 2), date.substr(8, 2), date.substr(10, 2), date.substr(12, 2)]
    } else {
      arr = date.split(/[^0-9]+/)
    }
    date = new Date(arr[0], arr[1] - 1, arr[2], arr[3] || 0, arr[4] || 0, arr[5] || 0)
  }
  return date
}

/**
 * 时间推移的功能,
 * parm:
 *  t1 当前时间   形式为  这些方式  '2012.3.4 23:22:33' '2012.3.4' new Date()
 *  num 推移的次数
 *  unit  单位   只能为('y'或者'm'或者'd')
 *  return: 返回推移后的时间对象
 */
function diffDateAdd (t1, num, unit) {
  if (!t1 || typeof num === 'undefined' || !unit) {
    return ''
  }
  t1 = this.formatTime(t1)
  var units = {
    y: 1000 * 60 * 60 * 24 * 365,
    m: 1000 * 60 * 60 * 24 * 30,
    d: 1000 * 60 * 60 * 24
  }[unit]
  return new Date(t1.getTime() + num * units)
}

function forEach (array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i])
  }
}

module.exports = {
  recentDate: recentDate,
  getSystemTime: getSystemTime, // 获取系统时间
  formatTime: formatTime,
  formatDate: formatDate,
  diffDateAdd: diffDateAdd
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*
* 功能齐全的金额转换
* 参数说明：
* number：要格式化的数字,可以为字符串和数字类型
* decimals：保留几位小数
* decPoint：小数点符号,默认为"."
* thousandsSep：千分位符号,默认为",",参数为""时没有符号
* roundtag:舍入参数，默认 "floor向下取(截取),ceil向上取","round" 四舍五入
* example:
* console.log(formatNumber(234.334, 2, ".", "")) // 234.33
* console.log(formatNumber(0.232373, 4, ".", "")) // 0.2323
* console.log(formatNumber(2, 2, ",", ","))//"2,00"
* console.log(formatNumber(3.7, 2, ".", ","))//"3.70"
* console.log(formatNumber(3, 0, ",", ",")) //"3"
* console.log(formatNumber(9.0312, 2, ".", ","))//"9.03"
* console.log(formatNumber(9.00, 2, ".", ","))//"9.00"
* console.log(formatNumber(39.715001, 2, ".", ",", "floor")) //"39.71"
* console.log(formatNumber(9.7, 2, ".", ","))//"9.70"
* console.log(formatNumber(39.7, 2, ".", ","))//"39.70"
* console.log(formatNumber(9.70001, 2, ".", ","))//"9.70"
* console.log(formatNumber(39.70001, 2, ".", ","))//"39.70"
* console.log(formatNumber(9996.03, 2, ".", ","))//"9,996.03"
* console.log(formatNumber(1.7973, 3, ".", ",", "ceil"))//"1.798"
* console.log(formatNumber(393434.715961, 4, '.', '')) // 393434.7159
* console.log(formatNumber(393434.715861, 4, '.', '', 'round')) // 393434.7159
* console.log(formatNumber(393434.715661, 4, '.', ',', 'round')) // 393,434.7157
* */
function formatNumber (number, decimals, decPoint, thousandsSep, roundtag) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    roundtag = roundtag || 'floor'; // "ceil","floor","round"
    var n = !isFinite(+number) ? 0 : +number; // 要处理的数值
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals); // 保留多少位
    var dec = (typeof decPoint === 'undefined') ? '.' : decPoint; // 小数点符号
    var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep; // 千分位符号
    var s = '';
    var toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
    };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (sep !== '') {
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, '$1' + sep + '$2');
        }
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

module.exports = {
    formatNumber: formatNumber
}


/***/ })
/******/ ]);
});
