var util = Meteor.npmRequire('util');
var EventEmitter = Meteor.npmRequire('events').EventEmitter;
_Crawler = function() {
    var self = this;
    EventEmitter.call(self);
    var state = -1;
    this.on('addProvider', function(provider) {
        if(!provider) {
            throw new Error('provider cannot be undefined/null!');
        }
        //type checks
        check(provider.process, Function);
        check(provider.matcher, Function);
        if(!self.providers) {
            self.providers = [];
        }
        self.providers.push(provider);
        console.log('provider added!')
    });
    this.on('addLink', function(url) {
        _.each(self.providers,function(provider){
            if(provider.matcher(url)) {
                provider.emit('processURL',url);
                return;
            }
        }, self);
    });
    this.on('init', function() {
        //perform initialization, placeholder for now
        self.state = 1;
        self.emit('ready');
    });
    this.on('processURL', function(url) {
        this.process(url);
    });
}
_Crawler.prototype.abort = function(id) {
    check(id,String);
    var provider = Downloads.findOne(id).providerId;
    this.providers[provider].emit('abort',id);  
}
_Crawler.prototype.providers = [];
_Crawler.prototype.listProviders = function() {
    return this.providers;
}
_Crawler.prototype.process = function(url) {
    throw new Error('Must override process');
}
_Crawler.prototype.getVideo = function(id) {

}
_Crawler.prototype.getThumbnail = function(id) {
    
}
util.inherits(_Crawler,EventEmitter);
Crawler = new _Crawler();