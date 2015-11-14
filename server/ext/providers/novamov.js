
var util = require('util');
var Horseman = require('node-horseman');
var request = require('sync-request');
var MultiLazy = new _Doom();
var self = MultiLazy;
MultiLazy.on('processURL',function(doc) {
	var _url = doc.link;
	var horseman = Horseman({
		webSecurity: false
	});
	horseman
	.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
	.open(_url)
	.evaluate(function(){
		return window.flashvars;
	})
	.then(function(fvars) {
		var domain = fvars.domain;
		var key = fvars.filekey;
		var fileId = fvars.file;
		//HERE BE BRAINFARTS 30/10/15
		var brainfart = domain+'/api/player.api.php?user=undefined&key='+key+'&cid3=undefined&numOfErrors=0&cid2=undefined&file='+fileId+'&pass=undefined&cid=undefined';
		var body = request('GET',brainfart).getBody('utf8');
		try {
			var url = body.match('url=([^&]+)')[1];
			var title = body.match('title=([^&]+)')[1];
			var filename = url.substring(url.lastIndexOf('/')+1);
			Doom.emit('addDownload',{
				providerId: MultiLazy.id,
				link: url,
				filename: filename,
				title: title
			});
		} catch(err) {
			console.log(body);
		}
	})
	.close();
});
MultiLazy.matcher = function(url) {
		var lazy_faggots = [
			'movshare',
			'videoweed',
			'videowood',
			'nowvideo',
			'novamov'
		];
    for(var i=0;i<lazy_faggots.length;i++){
			if(url.toLowerCase().indexOf(lazy_faggots[i]) > -1) {
				return true;
			}
		}
		return false;
}
MultiLazy.id = 'MultiLazy';
Doom.emit('addProvider', MultiLazy);
