Meteor.subscribe("all_downloads");
Template.downloads.helpers({
  allDownloads: function(){
    return Downloads.find();
  },
  shortenLink: function(link){
    return '<p><abbr title='+link+'>'+link.substring(0,15)+'...</abbr>'
  }
});
Template.downloads.events({
  "click .delBtn": function(event, template){
    Materialize.modalize.display({
      template: "delModal",
      docId: this['_id']
    });
  },
  "click #addBtn": function(e,tmpl) {
    var link = $('#linkTxt').val();
    if(link){
      $('#linkTxt').fadeOut(100,function(){
        $('#linkTxt').val('');
        $('#linkTxt').fadeIn(100, function(){
          Meteor.call('addLink',link);
          Materialize.toast('link added!',2000);
        });
      })
    }
  }
});
Template.delModal.events({
  "click #delBtn": function(event, template){
    Downloads.remove(this.docId)
  }
});
