var url = require('url');
var util = require('util');
var Horseman = require('node-horseman');

var Sdarot = new _Doom();
var self = Sdarot;

Sdarot.on('processURL', function(doc) {
	//return console.error(doc);
	var endpoint = 'sdarot.pm';
	var horseman = Horseman({
		webSecurity: false
	});
	if(State.sdarotCookies){
		horseman
			.userAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36')
			.cookies(State.sdarotCookies)
			.open('http://www.' + endpoint + url.parse(doc.link).pathname)
			.waitForSelector('#loading')
			.evaluate(function() {
				return {
					dls: document.download,
					VID: document.VID
				};
			})
			.then(function(video){
				doc.providerId	= Sdarot.id;
				doc.link = video.url;
				doc.filename = 'sdarot_' + video.id + '.mp4';
				Doom.emit('addDownload', doc);
			})
			.close();
	} else {
		horseman
			.userAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36')
			.post('http://www.' + endpoint + '/login', Config.users.sdarot)
			.screenshot('/home/cipher/test.png')
			.cookies()
			.then(function(cookies){
				State.sdarotCookies = cookies;
				Horseman({
					webSecurity: false
				})
				.userAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36')
				.cookies(State.sdarotCookies)
				.open('http://www.' + endpoint + url.parse(doc.link).pathname)
				.waitForSelector('#loading')
				.evaluate(function() {
					function getLinks(){
						var retVal = {};
						$(function(){
	    			retVal.url = download['hd'] || download['sd'];
						retVal.id = VID;
	   				});
						return retVal;
						}
					return getLinks();
				})
				.then(function(video){
					doc.providerId	= Sdarot.id;
					doc.link = video.url;
					doc.filename = 'sdarot_' + video.id + '.mp4';
					Doom.emit('addDownload', doc);
				})
				.close();
			})
			.close();
	}
});

Sdarot.matcher = function(url) {
    return url.toLowerCase().indexOf('sdarot') > -1;
};

Sdarot.id = 'Sdarot';

Doom.emit('addProvider', Sdarot);
