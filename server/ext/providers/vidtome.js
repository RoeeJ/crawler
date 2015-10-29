var util = Npm.require('util');
var Horseman = Meteor.npmRequire('node-horseman');
var VidToMe = new _Crawler();
var self = this;
VidToMe.on('processURL',function(doc) {
	var url = doc.link;
	var horseman = Horseman({
		webSecurity: false
	});
	horseman
	.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
	.open(url)
	.evaluate(function(){
		$('#btn_download').attr('disabled',null)
	})
	.click('#btn_download')
	.waitForNextPage()
	.html()
	.then(function(html) {
		console.log(html);
		//var link = html.match('http://\\d{2,3}\\.+\\d{2,3}.+mp4');
		//console.log(link);
		/*Crawler.emit('addDownload',{
			providerId: self.id,
			link: link[link.length-1]
		});*/
	})
	.close();
});
VidToMe.matcher = function(url) {
    return url.toLowerCase().indexOf('vidto.me') > -1;
}
VidToMe.id = 'vidtome';
Crawler.emit('addProvider', VidToMe);