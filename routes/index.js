var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: '首页',
        layout:'layout' 
    });
});

/* 注册*/
router.get('/reg', function(req, res, next) {
    res.render('reg', { 
       title: '注册',
       layout:'layout'
   });
});
router.post('/reg', function(req, res, next) {
    
});

/* 发布消息 */
router.get('/post', function(req, res, next) {
  res.render('index', { title: '发布消息' });
});

/* 登录*/
router.get('/login', function(req, res, next) {
    res.render('login', { 
  	    title: '登录',
  	    layout:'layout'  
    });
});
router.post('/login', function(req, res, next) {
    var password = req.body.password;
    var username = req.body.username;
    console.log("password:"+password,",username:"+username);
    // req.flash('success', '登入成功');
    res.redirect('/');
});



/* 退出登录*/
router.get('/doLogout', function(req, res, next) {
  res.render('index', { title: '退出登录' });
});

module.exports = router;
