/* PLUGIN MADE WITH CODE FROM PHPJS.ORG */
(function(factory){
 if(typeof define==='function'&&define.amd){define(['jquery'],factory);}
 else if(typeof exports==='object'){module.exports=factory(require('jquery'));}
 else{factory(jQuery);}
}(function($){
 var functions={
  abs:function(a){return Math.abs(a)||0},
  acos:function(a){return Math.acos(a)},
  acosh:function(t){return Math.log(t+Math.sqrt(t*t-1))},
  asin:function(n){return Math.asin(n)},
  asinh:function(t){return Math.log(t+Math.sqrt(t*t+1))},
  atan:function(a){return Math.atan(a)},
  atan2:function(a,n){return Math.atan2(a,n)},
  atanh:function(n){return.5*Math.log((1+n)/(1-n))},
  base_convert:function(n,t,r){return parseInt(n+"",0|t).toString(0|r)},
  bindec:function(e){return e=(e+"").replace(/[^01]/gi,""),parseInt(e,2)},
  ceil:function(c){return Math.ceil(c)},
  cos:function(c){return Math.cos(c)},
  cosh:function(t){return(Math.exp(t)+Math.exp(-t))/2},
  decbin:function(n){return 0>n&&(n=4294967295+n+1),parseInt(n,10).toString(2)},
  dechex:function(n){return 0>n&&(n=4294967295+n+1),parseInt(n,10).toString(16)},
  decoct:function(t){return 0>t&&(t=4294967295+t+1),parseInt(t,10).toString(8)},
  deg2rad:function(n){return.017453292519943295*n},
  exp:function(e){return Math.exp(e)},
  expm1:function(e){return 1e-5>e&&e>-1e-5?e+.5*e*e:Math.exp(e)-1},
  floor:function(o){return Math.floor(o)},
  fmod:function(t,a){var o,e,n=0,h=0,l=0,r=0;return o=t.toExponential().match(/^.\.?(.*)e(.+)$/),n=parseInt(o[2],10)-(o[1]+"").length,o=a.toExponential().match(/^.\.?(.*)e(.+)$/),h=parseInt(o[2],10)-(o[1]+"").length,h>n&&(n=h),e=t%a,-100>n||n>20?(l=Math.round(Math.log(e)/Math.log(10)),r=Math.pow(10,l),(e/r).toFixed(l-n)*r):parseFloat(e.toFixed(-n))},
  getrandmax:function(){return 2147483647},
  hexdec:function(e){return e=(e+"").replace(/[^a-f0-9]/gi,""),parseInt(e,16)},
  hypot:function(a,t){a=Math.abs(a),t=Math.abs(t);var h=Math.min(a,t);return a=Math.max(a,t),h/=a,a*Math.sqrt(1+h*h)||null},
  is_finite:function(t){var r="";if(t===1/0||t===-(1/0))return!1;if("object"==typeof t?r="[object Array]"===Object.prototype.toString.call(t)?"array":"object":"string"!=typeof t||t.match(/^[\+\-]?\d/)||(r="string"),r)throw new Error("Warning: is_finite() expects parameter 1 to be double, "+r+" given");return!0},
  is_infinite:function(t){var r="";if(t===1/0||t===-(1/0))return!0;if("object"==typeof t?r="[object Array]"===Object.prototype.toString.call(t)?"array":"object":"string"!=typeof t||t.match(/^[\+\-]?\d/)||(r="string"),r)throw new Error("Warning: is_infinite() expects parameter 1 to be double, "+r+" given");return!1},
  is_nan:function(r){var t="";if("number"==typeof r&&isNaN(r))return!0;if("object"==typeof r?t="[object Array]"===Object.prototype.toString.call(r)?"array":"object":"string"!=typeof r||r.match(/^[\+\-]?\d/)||(t="string"),t)throw new Error("Warning: is_nan() expects parameter 1 to be double, "+t+" given");return!1},
  lcg_value:function(){return Math.random()},
  log:function(o,t){return"undefined"==typeof t?Math.log(o):Math.log(o)/Math.log(t)},
  log10:function(n){return Math.log(n)/2.302585092994046},
  log1p:function(r){var t=0,n=50;if(-1>=r)return"-INF";if(0>r||r>1)return Math.log(1+r);for(var o=1;n>o;o++)t+=Math.pow(-r,o)/o;return-t},
  max:function(){var r,t,e=0,n=0,o=arguments,a=o.length,f=function(r){if("[object Array]"===Object.prototype.toString.call(r))return r;var t=[];for(var e in r)r.hasOwnProperty(e)&&t.push(r[e]);return t},i=function(r,t){var e=0,n=0,o=0,a=0,u=0;if(r===t)return 0;if("object"==typeof r){if("object"==typeof t){if(r=f(r),t=f(t),u=r.length,a=t.length,a>u)return 1;if(u>a)return-1;for(e=0,n=u;n>e;++e){if(o=i(r[e],t[e]),1==o)return 1;if(-1==o)return-1}return 0}return-1}return"object"==typeof t?1:isNaN(t)&&!isNaN(r)?0==r?0:0>r?1:-1:isNaN(r)&&!isNaN(t)?0==t?0:t>0?1:-1:t==r?0:t>r?1:-1};if(0===a)throw new Error("At least one value should be passed to max()");if(1===a){if("object"!=typeof o[0])throw new Error("Wrong parameter count for max()");if(r=f(o[0]),0===r.length)throw new Error("Array must contain at least one element for max()")}else r=o;for(t=r[0],e=1,n=r.length;n>e;++e)1==i(t,r[e])&&(t=r[e]);return t},
  min:function(){var r,t,e=0,n=0,o=arguments,i=o.length,f=function(r){if("[object Array]"===Object.prototype.toString.call(r))return r;var t=[];for(var e in r)r.hasOwnProperty(e)&&t.push(r[e]);return t},a=function(r,t){var e=0,n=0,o=0,i=0,u=0;if(r===t)return 0;if("object"==typeof r){if("object"==typeof t){if(r=f(r),t=f(t),u=r.length,i=t.length,i>u)return 1;if(u>i)return-1;for(e=0,n=u;n>e;++e){if(o=a(r[e],t[e]),1==o)return 1;if(-1==o)return-1}return 0}return-1}return"object"==typeof t?1:isNaN(t)&&!isNaN(r)?0==r?0:0>r?1:-1:isNaN(r)&&!isNaN(t)?0==t?0:t>0?1:-1:t==r?0:t>r?1:-1};if(0===i)throw new Error("At least one value should be passed to min()");if(1===i){if("object"!=typeof o[0])throw new Error("Wrong parameter count for min()");if(r=f(o[0]),0===r.length)throw new Error("Array must contain at least one element for min()")}else r=o;for(t=r[0],e=1,n=r.length;n>e;++e)-1==a(t,r[e])&&(t=r[e]);return t},
  mt_getrandmax:function(){return 2147483647},
  mt_rand:function(r,e){var n=arguments.length;if(0===n)r=0,e=2147483647;else{if(1===n)throw new Error("Warning: mt_rand() expects exactly 2 parameters, 1 given");r=parseInt(r,10),e=parseInt(e,10)}return Math.floor(Math.random()*(e-r+1))+r},
  octdec:function(e){return e=(e+"").replace(/[^0-7]/gi,""),parseInt(e,8)},
  pi:function(){return 3.141592653589793},
  pow:function(n,o){return Math.pow(n,o)},
  rad2deg:function(n){return 57.29577951308232*n},
  rand:function(r,e){var n=arguments.length;if(0===n)r=0,e=2147483647;else if(1===n)throw new Error("Warning: rand() expects exactly 2 parameters, 1 given");return Math.floor(Math.random()*(e-r+1))+r},
  round:function(a,r,_){var e,t,o,D;if(r|=0,e=Math.pow(10,r),a*=e,D=a>0|-(0>a),o=a%1===.5*D,t=Math.floor(a),o)switch(_){case"PHP_ROUND_HALF_DOWN":a=t+(0>D);break;case"PHP_ROUND_HALF_EVEN":a=t+t%2*D;break;case"PHP_ROUND_HALF_ODD":a=t+!(t%2);break;default:a=t+(D>0)}return(o?a:Math.round(a))/e},
  sin:function(n){return Math.sin(n)},
  sinh:function(n){return(Math.exp(n)-Math.exp(-n))/2},
  sqrt:function(t){return Math.sqrt(t)},
  tan:function(n){return Math.tan(n)},
  tanh:function(n){return 1-2/(Math.exp(2*n)+1)}
 };
 if($().php){$.extend(true,$.fn.php,functions);}
 if($.php){$.extend(true,$.php,functions);}
 if(!$().php){$.fn.php=functions;}
 if(!$.php){$.php=functions;}
}));
