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
  console.log([serie,season,episode]);
	var horseman = Horseman({
		webSecurity: false
	});
  var firstRun = Async.runSync(function(done){
    horseman
    .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56')
    .headers({
      'X-Requested-With' : 'XMLHttpRequest'
    })
  	.post('http://sdarot.pm/ajax/watch','watch=true&serie=59&season=1&episode=2')
    .html("body")
    .then(function(html){
      var md = JSON.parse(html);
      if(md.watch && md.watch.url){
        done(null,md);
      } else {
        done(md,null);
      }
    })
    .screenshot('/Users/cipher/test.png')
  	.close();
  });
  if(!firstRun.result) {
    var _horseman = Horseman({
  		webSecurity: false
  	});
    _horseman
    .userAgent('Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/30.0.1599.12 Mobile/11A465 Safari/8536.25 (3B92C18B-D9DE-4CB7-A02A-22FD2AF17C8F')
    .post('http://mobile.sdarot.wf/mobile.php?do=searchServer','vid='+firstRun.error.VID)
    .headers({
      'X-Requested-With' : 'XMLHttpRequest'
    })
    .html("body")
    .then(function(html){
      console.log(html);
    })
    .close();
  } else {

  }
});
Sdarot.matcher = function(url) {
    return url.toLowerCase().indexOf('sdarot') > -1;
};
Sdarot.id = 'Sdarot';
Doom.emit('addProvider', Sdarot);
