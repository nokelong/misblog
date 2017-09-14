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
					var time = formatDate('yyyy-MM-dd hh:mm:ss', doc.time);
					console.log(time)
					var post = new Post(doc.user, doc.message, time);
					posts.push(post);
				});
				callback(null, posts);
			});
        });
    });
};
/**
   *格式化日期文本，如yyyy-MM-dd hh:mm:ss
 */
function formatDate(format, date) {
    if (!date)
        return "";
    if (typeof date == "number")
        date = new Date(date * 1000);
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds(),
        "w": "日一二三四五六".charAt(date.getDay())
    };
    format = format.replace(/y{4}/, date.getFullYear())
        .replace(/y{2}/, date.getFullYear().toString().substring(2));
    for (var k in o) {
        var reg = new RegExp(k);
        format = format.replace(reg, match);
    }
    function match(m) {
        return m.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length);
    }
    return format;
}
module.exports = Post;