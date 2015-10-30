Meteor.methods({
  getCrawlerState:function(){
     return Crawler.state;
  },
  addLink: function(link) {
    Crawler.emit('addLink',link);
  }
});
