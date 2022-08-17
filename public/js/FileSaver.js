/*! FileSaver.js v1.3.6
 *
 * A saveAs() FileSaver implementation.
 *
 * By Travis Clarke, https://travismclarke.com
 * By Eli Grey, http://eligrey.com
 *
 * License: MIT (https://github.com/clarketm/FileSaver.js/blob/master/LICENSE.md)
 */ !function(a,b){"object"==typeof exports&&"string"!=typeof exports.nodeName?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("FileSaver requires a window with a document");return b(a)}:b(a)}(window||this,function(b,d){"use strict";if(!(void 0===b||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){var e=b.document,h=function(){return b.URL||b.webkitURL||b},f=e.createElementNS("http://www.w3.org/1999/xhtml","a"),i="download"in f,j=function(a){var b=new MouseEvent("click");a.dispatchEvent(b)},k=/constructor/i.test(b.HTMLElement)||b.safari,l=/CriOS\/[\d]+/.test(navigator.userAgent),m=function(a){(b.setImmediate||b.setTimeout)(function(){throw a},0)},n=function(a){setTimeout(function(){"string"==typeof a?h().revokeObjectURL(a):a.remove()},4e4)},o=function(a,b,e){for(var c=(b=[].concat(b)).length;c--;){var d=a["on"+b[c]];if("function"==typeof d)try{d.call(a,e||a)}catch(f){m(f)}}},p=function(a){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a},g=function(a,g,d){d||(a=p(a));var e,c=this,m="application/octet-stream"===a.type,q=function(){o(c,"writestart progress write writeend".split(" "))};if(c.readyState=c.INIT,i){e=h().createObjectURL(a),setTimeout(function(){f.href=e,f.download=g,j(f),q(),n(e),c.readyState=c.DONE});return}!function(){if((l||m&&k)&&b.FileReader){var d=new FileReader;d.onloadend=function(){var a=l?d.result:d.result.replace(/^data:[^;]*;/,"data:attachment/file;");b.open(a,"_blank")||(b.location.href=a),a=void 0,c.readyState=c.DONE,q()},d.readAsDataURL(a),c.readyState=c.INIT;return}(e||(e=h().createObjectURL(a)),m)?b.location.href=e:b.open(e,"_blank")||(b.location.href=e),c.readyState=c.DONE,q(),n(e)}()},a=g.prototype,c=function(a,b,c){return new g(a,b||a.name||"download",c)};return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob&&(c=function(a,b,c){return b=b||a.name||"download",c||(a=p(a)),navigator.msSaveOrOpenBlob(a,b)}),a.abort=function(){},a.readyState=a.INIT=0,a.WRITING=1,a.DONE=2,a.error=a.onwritestart=a.onprogress=a.onwrite=a.onabort=a.onerror=a.onwriteend=null,"function"==typeof define&&define.amd&&define("file-saverjs",[],function(){return c}),void 0===d&&(b.saveAs=c),c}})