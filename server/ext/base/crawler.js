var util = Meteor.npmRequire('util');
var EventEmitter = Meteor.npmRequire('events').EventEmitter;
var assert = Meteor.npmRequire('assert');
var Fiber = Meteor.npmRequire('fibers');
var URL = Meteor.npmRequire('url');
var fs = Meteor.npmRequire('fs');
var request = Meteor.npmRequire('request');
var progress = Meteor.npmRequire('request-progress');
_Crawler = function() {
    var self = this;
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
        assert.equal(url.isURL(),true,'url is not a valid URL!');
        var filepath = Config.BASE_PATH+ Meteor.npmRequire('crypto').createHash('md5').update(url).digest('hex').substring(0,15)+doc.filename.match(new RegExp('\\.[0-9a-z]+$','i'))[0];
        progress(request({uri:URL.parse(url)}).on('response', function(res){
            Fiber(function(){
                doc.state = 1;
                doc.path = filepath;
                doc.docId = Downloads.insert(doc);
              }).run();
        })
        .on('error',function(err){
            Fiber(function(){
                Downloads.update(doc.docId,{$set:{state:-1, error:err}})
            }).run();
            //Downloads.update(dl.meta.docId,{$set:{state:-1,error:err}});
        }),{
            throttle: 1000,
            delay: 1000
        }).on('progress',function(state) {
            Fiber(function(){
                Downloads.update(doc.docId,{$set:{progress:state.percent}})
            }).run();
        })
        .on('close',function(err){
            if(!err) {
                Fiber(function(){
                Downloads.update(doc.docId,{$set:{state:2,progress:'finished!'}})
                }).run();
            }
        }).pipe(fs.createWriteStream(filepath));
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
