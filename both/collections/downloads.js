this.Downloads = new Mongo.Collection("downloads");

this.Downloads.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","uploader","supermod","mod"]);
};

this.Downloads.userCanUpdate = function(userId, doc) {
	return true;
};

this.Downloads.userCanRemove = function(userId, doc) {
	return true;
};
this.Downloads.before.insert(function (userId, doc) {
  doc.createdAt = Date.now();
});
