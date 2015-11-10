Meteor.publish("all_downloads", function() {
	if(this.userId){
		return Downloads.find({}, {sort:{createdAt:-1}});
	}
});
