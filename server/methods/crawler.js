Meteor.methods({
  getCrawlerState:function(){
     return Crawler.state;
  },
  addLink: function(doc) {
    if(doc.client){
      return Crawler.emit('addLink',doc);
    }
  }
});
