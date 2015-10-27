var url = Npm.require('util');
var EventEmitter = require('events').EventEmitter;
var Crawler = function() {
    var self = this;
    EventEmitter.call(self);
    var state = -1;
    this.on('addProvider', function(provider) {
        if(!provider) {
            throw new Error('provider cannot be undefined/null!');
        }
        //type checks
        check(provider.process, Function);
        check(provider.regex, Regexp);
        self.providers.push(provider);
    });
    this.on('addLink', function(url)) {
        _.each(provider,function(provider){
            if(provider.regex.test(url)) {
                provider.emit('processURL',url);
                return;
            }
        }, self);
    }
    this.on('init', function() {
        //perform initialization, placeholder for now
        self.state = 1;
        self.emit('ready');
    });
}
util.inherits(Crawler,EventEmitter);
Crawler.prototype.abort = function(id) {
    check(id,String);
    var provider = Downloads.findOne(id).providerId;
    this.providers[provider].emit('abort',id);  
}
Crawler.prototype.providers = [];
Crawler.prototype.listProviders = function() {
    return this.providers;
}
Crawler.prototype.process = function(url) {
    throw new Error('Must override process');
}
Crawler.prototype.getVideo = function(id) {

}
Crawler.prototype.getThumbnail = function(id) {
    
}