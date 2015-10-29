var util = Meteor.npmRequire('util');
var EventEmitter = Meteor.npmRequire('events').EventEmitter;
var assert = Meteor.npmRequire('assert');
var Fiber = Meteor.npmRequire('fibers');
_Crawler = function() {
    var self = this;
    var mtd = Meteor.npmRequire('mt-downloader');
    EventEmitter.call(self);
    var state = -1;
    this.on('init', function() {
    //perform initialization, placeholder for now
    self.state = 1;
    self.emit('ready');
    });
    
    this.on('abortDownload',function(id) {
    });

    this.on('addDownload', function(doc) {
        check(doc,Object);
        var url = doc.link;
        check(url, String);
        var filename = doc.filename;
        check(filename, String);
        assert.equal(url.isURL(),true,'url is not a valid URL!');
        var dl = new mtd('/Users/cipher/Developer/Meteor/'+filename,url, {
            count: 1,
            headers: {other: 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56'},
            onStart: function(meta) {

            },
            onEnd: function(err, res) {
                if(err) {
                    console.error(err);
                } else {
                    //update Downloads collection
                }
            }
        });
        dl.start();
    })

    this.on('addProvider', function(provider) {
        //null check
        if(!provider) {
            throw new Error('provider cannot be undefined/null!');
        }
        //make sure the provider has a handler on the 'processURL' event
        assert(provider.listeners('processURL').length > 0, true)
        //matcher function
        check(provider.matcher, Function);
        //id check
        check(provider.id,String);

        if(!self.providers) {
            self.providers = {};
        }
        //make sure we don't have a duplicate provider
        if(!self.providers[provider.id]){
            self.providers[provider.id] = provider;
        }
    });
    this.on('addLink', function(url) {
        var pf = false
        _.each(self.providers,function(provider){
            if(provider.matcher(url)) {
                provider.emit('processURL',{link:url,id:guid()});
                pf = true;
            }
        }, self);
        if(!pf){console.error('no providers found!')}
    });
}
_Crawler.prototype.abort = function(id) {
    check(id,String);
    var provider = Downloads.findOne(id).providerId;
    this.providers[provider].emit('abort',id);
}
_Crawler.prototype.providers = [];

_Crawler.prototype.process = function(url) {
    throw new Error('Must override process');
}
_Crawler.prototype.getVideo = function(id) {

}
_Crawler.prototype.getThumbnail = function(id) {

}
util.inherits(_Crawler,EventEmitter);
Crawler = new _Crawler();
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
