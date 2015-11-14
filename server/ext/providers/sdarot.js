var url = require('url');
var util = require('util');
var Horseman = require('node-horseman');

var Sdarot = new _Doom();
var self = Sdarot;

Sdarot.on('processURL', function(doc) {

	var endpoint = 'sdarot.pm';

	var horseman = Horseman({
		webSecurity: false
	});

	horseman
		.userAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36')
		.cookies({
			name:	'remember',
			value:	'a%3A2%3A%7Bs%3A8%3A%22username%22%3Bs%3A10%3A%22oshers1994%22%3Bs%3A5%3A%22check%22%3Bs%3A32%3A%22d25dceb3cf7dbc463fa126772013504a%22%3B%7D',
			domain:	'.' + endpoint
		})
		.open('http://' + endpoint + url.parse(doc.link).pathname)
		.waitForSelector('#loading')
		.evaluate(function() {

			$(function(){
				console.log(download);
			});

			console.log(download);

			return {
				url: download.pop(),
				id:  VID
			};
		})
		.then(function(video){
			doc.providerId	= Sdarot.id;
			doc.link		= video.url;
			doc.filename	= 'sdarot_' + video.id + '.mp4';
			Doom.emit('addDownload', doc);
		})
		.close();
});

Sdarot.matcher = function(url) {
		console.log(url);
    return url.toLowerCase().indexOf('sdarot') > -1;
};

Sdarot.id = 'Sdarot';

Doom.emit('addProvider', Sdarot);
