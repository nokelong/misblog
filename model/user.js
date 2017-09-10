var mongoDb = require('./db');
function User(user) {
    this.name = user.name;
    this.pass = user.pass;
}

module.exports = User;

/**
 * [User对象原型上增加save方法]
 * 保存用户数据到MongoDB中
 * @param  {Function} callback [回调处理方法]
 * @return {[type]}            [description]
 */
User.prototype.save = function(callback) {
    var user = {
    	name : this.name;
    	pass : this.pass;
    }
    mongoDb.open(function(error, db) {
        if(error) {
        	return callback(error);
        }
        //
        db.collection('users', function(error, collection) {
            if(error) {
                mongoDb.close();
                return callback(error);
            }

            collection.insert(user, {safe: true}, function(error, user) {
            	mongoDb.close();
            	callback(error, user);
            })
        })
    })
};
/**
 * 根据用户名获取用户
 * @param  {[type]}   username [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
User.get = function(username, callback) {
    mongoDb.open(function(error, db) {
        if(error) {
            return callback(error);
        }

        db.collection('users', function(error, collection) {
            if(error) {
            	mongoDb.close();
            	return callback(error);
            }
            collection.findOne({name:username}, function(error, doc) {
                mongoDb.close();
                if(doc) {
                	var user = new User(doc);
                	callback(error, user);
                } else {
                	callback(error, null);
                }
            })
        })
    })
}