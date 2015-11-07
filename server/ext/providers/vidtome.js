var util = Npm.require('util');
var Horseman = Meteor.npmRequire('node-horseman');
var VidToMe = new _Doom();
var self = VidToMe;
VidToMe.on('processURL',function(doc) {
	var url = doc.link;
	var horseman = Horseman({
		webSecurity: false
	});
	horseman
	.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
	.open(url)
	.wait(5000)
	.evaluate(function(){
		$('#btn_download').attr('disabled',null)
	})
	.click('#btn_download')
	.waitForNextPage()
	.html()
	.then(function(html) {
		var links = html.match(new RegExp('http:\\/\\/\\d{2,3}\\.+\\d{2,3}.+(mp4|mov)','gi'));
		var link = links[links.length-1];
		var filename = link.substring(link.lastIndexOf('/')+1)
		Doom.emit('addDownload',{
			providerId: VidToMe.id,
			link: link,
			filename: filename
		});
	})
	.close();
});
VidToMe.matcher = function(url) {
    return url.toLowerCase().indexOf('vidto.me') > -1;
		//broken wtf
		//return false;
}
VidToMe.id = 'vidtome';
Doom.emit('addProvider', VidToMe);
