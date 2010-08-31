var global = this;

//calls ok(true) if no error is thrown
function okNoError(func, msg) {
	try {
		func();
		ok(true, msg);
	} catch (e) {
		ok(false, msg + ': ' + e);
	}
}

//calls ok(true) if an error is thrown
function okError(func, msg) {
	try {
		func();
		ok(false, msg);
	} catch (e) {
		ok(true, msg + ': ' + e);
	}
}

test("Acquire Negotiator", function () {
	ok(Negotiate, "Negotiate.js is loaded");
});

test("No Variants", function () {
	var variants = [],
		request = {
			method : 'GET',
			headers : {}
		};
	
	equal(Negotiate.choose(variants, request).length, 0, "No variants, minimal request");
});

test("Full Test", function () {
	var variants = [
		{
			"method" : "GET",
			"type" : "text/html",
			"language" : "en-ca",
			"charset" : "UTF-8",
			"encoding" : "identity",
			"quality" : 1.0,
			"length" : 100000
		},
		{
			"method" : "GET",
			"type" : "application/xhtml+xml",
			"language" : "en-ca",
			"charset" : "UTF-8",
			"encoding" : "identity",
			"quality" : 1.0,
			"length" : 100000
		},
		{
			"method" : "GET",
			"type" : "application/json",
			"quality" : 0.3,
			"length" : 1000
		}
	],
		firefox = {
			url : '/article/1',
			method : 'GET',
			headers : {
				'accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				'accept-language' : 'en-us,en;q=0.5',
				'accept-encoding' : 'gzip,deflate',
				'accept-charset' : 'ISO-8859-1,utf-8;q=0.7,*;q=0.7'
			}
		},
		chrome = {
			url : '/article/1',
			method : 'GET',
			headers : {
				'accept' : 'application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
				'accept-language' : 'en-US,en;q=0.8',
				'accept-encoding' : 'gzip,deflate,sdch',
				'accept-charset' : 'ISO-8859-1,utf-8;q=0.7,*;q=0.3'
			}
		},
		opera = {
			url : '/article/1',
			method : 'GET',
			headers : {
				'accept' : 'text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1',
				'accept-language' : 'en-CA,en;q=0.9',
				'accept-encoding' : 'deflate, gzip, x-gzip, identity, *;q=0',
				'accept-charset' : 'iso-8859-1, utf-8, utf-16, *;q=0.1'
			}
		},
		ie8 = {
			url : '/article/1',
			method : 'GET',
			headers : {
				'accept' : 'image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, application/x-shockwave-flash, */*',
				'accept-language' : 'en-CA',
				'accept-encoding' : 'gzip, deflate'
			}
		};
	
	global.fullTest = {
		firefox : Negotiate.choose(variants, firefox),
		chrome : Negotiate.choose(variants, chrome),
		opera : Negotiate.choose(variants, opera),
		ie8 : Negotiate.choose(variants, ie8)
	}
	
	ok(Negotiate.choose(variants, firefox)[0].q, "Firefox Test");
	ok(Negotiate.choose(variants, chrome)[0].q, "Chrome Test");
	ok(Negotiate.choose(variants, opera)[0].q, "Opera Test");
	ok(Negotiate.choose(variants, ie8)[0].q, "IE8 Test");
	
});