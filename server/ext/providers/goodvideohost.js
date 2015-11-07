var util = Npm.require('util');
var Horseman = Meteor.npmRequire('node-horseman');
var GoodVideoHost = new _Doom();
var self = GoodVideoHost;
GoodVideoHost.on('processURL',function(doc) {
	var url = doc.link;
	var horseman = Horseman({
		webSecurity: false
	});
	horseman
	.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
	.open(url)
	.html()
	.then(function(html) {
		var link = html.match('file:"([^"]+)"')[1];
		var thumbnail = html.match('image:\\s*"([^"]+)"')[1];
		var filename = link.substring(link.lastIndexOf('/')+1)
		Doom.emit('addDownload',{
			providerId: GoodVideoHost.id,
			link: link,
			filename: filename,
			thumbnail: thumbnail || ''
		});
	})
	.close();
});
GoodVideoHost.matcher = function(url) {
    return url.toLowerCase().indexOf('goodvideohost') > -1;
}
GoodVideoHost.id = 'GoodVideoHost';
Doom.emit('addProvider', GoodVideoHost);
