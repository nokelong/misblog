var mongoDb = require('./db');

function Post(username, message, time) {
    this.user = username;
    this.message = message;
    this.time = time ? time : new Date();
}
/**
 * [save 保存发布的消息]
 * @param  {Function} callback [回调方法]
 * @return {[type]}            [description]
 */
Post.prototype.save = function(callback) {
	var post = {
	    user: this.user,
	    message: this.message,
	    time: this.time
	}

	mongoDb.open(function(error, db) {
	    if(error) {
	    	return callback(error);
	    }

	    mongoDb.collection('posts', function(error,collection) {
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
/**
 * [get 根据用户获取发布的消息]
 * @param  {[type]}   username [用户名]
 * @param  {Function} callback [回调方法]
 * @return {[type]}            [description]
 */
Post.get = function(username, callback) {

    mongoDb.open(function(error,db) {
        if(error) {   //是否打开失败
        	return callback(error);
        }
        mongoDb.collection('posts', function(error, collection) {
            if(error) {
            	mongoDb.close();
            	return callback(error);
            }

            var query = {};
			if (username) {
				query.user = username;
			}
			collection.find(query).sort({time: -1}).toArray(function(error, docs) {
                mongoDb.close();
                if (error) {
					callback(error, null);
				}
				var posts = [];
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.message, doc.time);
					posts.push(post);
				});
				callback(null, posts);
			});
        });
    });
};

module.exports = Post;