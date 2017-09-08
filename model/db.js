var setting = require('../setting');
var mongodb = require('mongodb');
var Db = mongodb.Db,
    Connection = mongodb.Connection,
    Server = mongodb.Server;

var micdb = new Db(setting.db, new Server(setting.host, Connection.DEFAULT_PORT, {}),{
	w:1
})
