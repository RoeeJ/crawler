var util = require('util');
var Horseman = require('node-horseman');
var VidSpot = new _Doom();
var self = VidSpot;
VidSpot.on('processURL',function(doc) {
	var url = doc.link;
	var horseman = Horseman({
		webSecurity: false
	});
	horseman
	.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
	.open(url)
	.html()
	.then(function(html) {
		var links = html.match(new RegExp('https{0,1}://\\w\\d{4}.+\\.mp4\\?v2','g'));
		var link = links[links.length-1];
		doc.providerId = VidSpot.id;
		doc.link = link;
		doc.filename = link.substring(link.lastIndexOf('/')+1).replace('?v2','');
		Doom.emit('addDownload',doc);
	})
	.close();
});
VidSpot.matcher = function(url) {
    return url.toLowerCase().indexOf('vidspot.net') > -1;
}
VidSpot.id = 'vidspot';
Doom.emit('addProvider', VidSpot);
