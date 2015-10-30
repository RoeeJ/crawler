var util = Npm.require('util');
var Horseman = Meteor.npmRequire('node-horseman');
var VidSpot = new _Crawler();
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
		var filename = link.substring(link.lastIndexOf('/')+1).replace('?v2','')
		Crawler.emit('addDownload',{
			providerId: VidSpot.id,
			link: link,
			filename: filename
		});
	})
	.close();
});
VidSpot.matcher = function(url) {
    return url.toLowerCase().indexOf('vidspot.net') > -1;
}
VidSpot.id = 'vidspot';
Crawler.emit('addProvider', VidSpot);
