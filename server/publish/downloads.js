Meteor.publish("all_downloads", function() {
	return Downloads.find({}, {sort:{createdAt:-1}});
});

Meteor.publish("in_progress", function() {
	return Downloads.find({status:1}, {sort:{createdAt:-1}});
});

Meteor.publish("completed_downloads", function() {
	return Downloads.find({status:2}, {sort:{createdAt:-1}});
});

Meteor.publish("unclaimed_download", function() {
	return Downloads.find({status:0}, {sort:{createdAt:1}});
});

