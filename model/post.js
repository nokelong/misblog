var mongoDb = require('./db');

function Post(username, message, time) {
    this.user = username;
    this.message = message;
    this.time = time ? time : new Date();
}

Post.prototype.save = function(callback) {
	var post = {
	    user: this.user;
	    message: this.message;
	    time: this.time
	}

	mongoDb.open(function(error, db) {
	    if(error) {
	    	return callback(error);
	    }

	    mongoDb.collection('post', function(error,collection) {
	        if(error) {
	        	mongoDb.close();
	        	return callback(error);
	        }

	        collection.insert(post, {safe: true}, function(error, post) {
                mongoDb.close();
                callback(error, post)
	        });
	    })
	})
}