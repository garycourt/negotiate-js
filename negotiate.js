/**
 * Negotiate.js
 * 
 * @fileOverview HTTP Content Negotiation in JavaScript
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 0
 */

/*
 * Copyright 2010 Gary Court. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*jslint white: true, onevar: true, undef: true, eqeqeq: true, newcap: true, immed: true */

var exports = exports || this,
	require = require || function () {
		return exports;
	};

(function () {
	
	function toArray(o) {
		return o !== undefined && o !== null ? (o instanceof Array && !o.callee ? o : (typeof o.length !== 'number' || o.split || o.setInterval || o.call ? [ o ] : Array.prototype.slice.call(o))) : [];
	}
	
	function filterArray(arr, func, scope) {
		var x = 0, xl = arr.length, newArr = [];
		for (; x < xl; ++x) {
			if (func.call(scope, arr[x], x, arr)) {
				newArr[newArr.length] = arr[x];
			}
		}
		return newArr;
	}
		
	if (Array.prototype.filter) {
		filterArray = function (arr, func, scope) {
			return Array.prototype.filter.call(arr, func, scope);
		};
	}
	
	function lc(str, deflt) {
		return (str || deflt || '').toLowerCase();
	}
	
	function choose(variants, request) {
		var requestMethod = lc(request.method, 'GET');
		
		variants = clone(variants, true);
		variants = toArray(variants);
		
		//filter by request method
		variants = filterArray(variants, function (variant) {
			return lc(variant.method, 'GET') === requestMethod;
		});
		
		//filter by media type
		variants = filterArray(variants, function (variant) {
			var matches = false, qt, mediaType, type,
				accepts = toArray(request.accept), x, xl,
				variantType = lc(variant.type);
			
			for (x = 0, xl = accepts.length; x < xl; ++x) {
				mediaType = toArray(accepts[x]);
				type = lc(mediaType[0]);
				
				if (type === '*' || type === '*/*' || type === variantType || (/^(.+\/)\*$/.test(type) && variantType.indexOf(RegExp.$1) === 0)) {
					qt = (typeof mediaType[1] === 'object' && isNumeric(mediaType[1].q) ? parseFloat(mediaType[1].q, 10) : 1.0);
					variant.qt = Math.max(variant.qt || 0, qt);
					matches = true;
				}
			}
			
			return matches;
		});
		
		//filter by language
		variants = filterArray(variants, function (variant) {
			var matches = false, ql, language, lang,
				accepts = toArray(request.accept), x, xl,
				variantLanguage = lc(variant.language);
			
			//never reject solely on language
			variant.ql = 0.001;
			matches = true;
			
			for (x = 0, xl = accepts.length; x < xl; ++x) {
				language = toArray(accepts[x]);
				lang = lc(language[0]);
				
				if (lang === '*' || lang === variantLanguage || (/^([a-z]+)\-[a-z]+$/.test(lang) && variantLanguage === RegExp.$1)) {
					ql = (typeof language[1] === 'object' && isNumeric(language[1].q) ? parseFloat(language[1].q, 10) : 1.0);
					variant.ql = Math.max(variant.ql || 0, ql);
					matches = true;
				}
			}
			
			return matches;
		});
		
		//filter by charset
	}
	
	this.Negotiate = {
		choose : choose
	};
	
	exports.choose = choose;
	
}());