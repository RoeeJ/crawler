var util = Npm.require('util');
var Horseman = Meteor.npmRequire('node-horseman');
var Sdarot = new _Doom();
var self = Sdarot;
Sdarot.on('processURL',function(doc) {
	var url = doc.link;
  var _temp = url.match(new RegExp('\/(\\d)','g')).map(function(n){return n.substring(1);});
  var serie = _temp[0];
  var season = _temp[1];
  var episode = _temp[2];
	var horseman = Horseman({
		webSecurity: false
	});
  var firstRun = Async.runSync(function(done){
    horseman
    .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
    .headers({
      'X-Requested-With' : 'XMLHttpRequest'
    })
  	.post('http://sdarot.pm/ajax/watch','watch=false&serie=59&season=1&episode=2')
    .html("body")
    .then(function(html){
			try{
				var md = JSON.parse(html);
	      if(md.watch && md.watch.url){
	        done(null,md);
	      } else {
	        done(md,null);
	      }
			}catch(_err) {
				console.error(html);
			}
    })
  	.close();
  });
  if(!firstRun.result) {
    var _horseman = Horseman({
  		webSecurity: false
  	});
    _horseman
    .userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16')
    .post('http://mobile.sdarot.wf/mobile.php?do=searchServer','vid='+firstRun.error.VID)
    .headers({
      'X-Requested-With' : 'XMLHttpRequest'
    })
    .html("body")
    .then(function(html){
			doc.providerId = Sdarot.id;
			doc.link = html;
			doc.filename = html.match('.d\\/(.+)\\?')[1];
			Doom.emit('addDownload',doc);
    })
    .close();
  } else {

  }
});
Sdarot.matcher = function(url) {
		console.log(url);
    return url.toLowerCase().indexOf('sdarot') > -1;
};
Sdarot.id = 'Sdarot';
Doom.emit('addProvider', Sdarot);
