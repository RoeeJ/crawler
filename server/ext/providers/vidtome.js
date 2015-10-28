this.megawin = undefined;
var util = Npm.require('util');
var Horseman = Meteor.npmRequire('node-horseman');
var VidToMe = new _Crawler();
VidToMe.process = function(url) {
	var horseman = Horseman({
		webSecurity: false
	});
	horseman
	.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
	.open('http://vidspot.net/embed-c1zgdrjxi1n1.html')
	.waitFor(function(){
		return !!jwplayer().getPlaylistItem();
	},true)
	.evaluate(function(){
		return jwplayer().getPlaylistItem();
	})
	.then(function(ret){
		console.log(ret);
	})
	.screenshot('/Users/cipher/Developer/Meteor/wat.png')
	.close();
}
VidToMe.matcher = function(url) {
    return url.toLowerCase().indexOf('vidspot.net') > -1;
}
Crawler.emit('addProvider', VidToMe);