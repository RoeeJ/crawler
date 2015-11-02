var util = Meteor.npmRequire('util');
var EventEmitter = Meteor.npmRequire('events').EventEmitter;
var assert = Meteor.npmRequire('assert');
var Fiber = Meteor.npmRequire('fibers');
var URL = Meteor.npmRequire('url');
var fs = Meteor.npmRequire('fs');
var Downloader = Meteor.npmRequire('mt-files-downloader');
var downloader = new Downloader();
var downloads = {};
_Crawler = function() {
    var self = this;
    EventEmitter.call(self);
    var state = -1;
    this.on('init', function() {
    //perform initialization, placeholder for now
    self.state = 1;
    if(!this.providers) this.provides = [];
    self.emit('ready');
    });

    this.on('abortDownload',function(id) {
      var doc = self.downloads[id].dl;
      if(doc) {
        if(doc.dl) {
          doc.dl.stop();
        }
        if(doc.path) {
        		if(fs.existsSync(doc.path)){
        			fs.unlinkSync(doc.path);
        		}
        		if(fs.existsSync(doc.path+'.mtd')){
        			fs.unlinkSync(doc.path+'.mtd');
        		}
        }
      }
    });

    this.on('addDownload', function(doc) {
        check(doc,Object);
        var url = doc.link;
        check(url, String);
        assert.equal(url.isURL(),true,'url is not a valid URL!');
        if(!fs.existsSync(Config.BASE_PATH)) {
          fs.mkdirSync(Config.BASE_PATH);
        }
        var filepath = Config.BASE_PATH+getDocHash(doc)+doc.filename.match(new RegExp('\\.[0-9a-z]+$','i'))[0];
        if(fs.existsSync(filepath)) return;
        var dl;
        if(fs.existsSync(filepath+'.mtd')) {
          dl = downloader.resumeDownload(filepath);
        } else {
          dl = downloader.download(url,filepath);
        }
        dl.on('start',function(dl){
          Fiber(function(){
            var hash = getDocHash(doc);
            downloads[hash] = doc;
            downloads[hash].state = 1;
            downloads[hash].path = filepath;
            downloads[hash].docId = Downloads.insert(doc);
            downloads[hash].dl = dl;
            }).run();
        })
        .on('error',function(err){
            Fiber(function(){
                Downloads.update(downloads[getDocHash(doc)].docId,{$set:{state:-1, error:err}});
            }).run();
            //Downloads.update(dl.meta.docId,{$set:{state:-1,error:err}});
        })
        .on('progress',function(prog) {
            Fiber(function(){
                Downloads.update(downloads[getDocHash(doc)].docId,{$set:{progress:prog,speed:dl.stats.present.speed}});
            }).run();
        })
        .on('end',dlStopHandler)
        .on('error', dlStopHandler);
        dl.start();
    });

    this.on('addProvider', function(provider) {
        //null check
        if(!provider) {
            throw new Error('provider cannot be undefined/null!');
        }
        //make sure the provider has a handler on the 'processURL' event
        assert(provider.listeners('processURL').length > 0, true);
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
    this.on('addLink', function(doc) {
        var pf = false;
        _.each(self.providers,function(provider){
            if(provider.matcher(doc.link)) {
                provider.emit('processURL',doc);
                pf = true;
            }
        }, self);
        if(!pf){console.error('no providers found!');}
    });
    this.processSync = function(doc) {
      var pf;
      _.each(self.providers,function(provider){
        if(provider.matcher(doc.link) && !pf) {
            provider.emit('processURL',doc);
            pf = true;
        }
      });
      return pf;
    };
};
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
function getDocHash(doc) {
  return Meteor.npmRequire('crypto').createHash('md5').update(doc.title || doc.olink || doc.link).digest('hex').substring(0,31);
}
