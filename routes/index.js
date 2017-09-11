var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../model/user.js');
var post = require('../model/post.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: '首页',
        layout:'layout' 
    });
});

/* 注册*/
router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res) {
    res.render('reg', { 
       title: '注册',
       layout:'layout'
   });
});

router.post("/reg",checkNotLogin);
router.post('/reg', function(req, res) {

    var name = req.body['username'];
    var password = req.body['password'];
    
    console.log('reg password:' + password +",name:"+name + ",epeat:" +req.body['password-repeat'])
    if(req.body['password-repeat'] != password) {
        req.flash('error', '俩次口令不一致');
        return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5');
    var pass = md5.update(password).digest('base64');

    var uuser = new User({
        name: name,
        pass: pass
    });

    User.get(name, function(error, user) {
        if(user) {
            console.log('用户已存在')
            req.flash('error', '用户已存在');
            return res.redirect('/reg');
        }

        if(error) {
            console.log('reg error:' +error)
            req.flash('error', error);
            return res.redirect('/reg');
        }

        uuser.save(function(err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }

            req.session.user = user;
            req.flash('success', '注册成功');
            console.log('注册成功')
            res.redirect('/');
        });
    })
});

/* 发布消息 */
router.get('/post', function(req, res, next) {
  res.render('index', { title: '发布消息' });
});

/* 登录*/
router.post("/login",checkNotLogin);
router.get('/login', function(req, res, next) {
    res.render('login', { 
  	    title: '登录',
  	    layout:'layout'  
    });
});

router.post("/login",checkNotLogin);
router.post('/login', function(req, res) {
    var password = req.body.password;
    var username = req.body.username;
    console.log("password:"+password,",username:"+username);
    var md5 = crypto.createHash('md5');
    var pass = md5.update(password).digest('base64');

    User.get(username, function(error, user) {
        if(!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/login');
        }

        req.session.user = user;
        req.flash('success', '登入成功');
        res.redirect('/');
    })
});



/* 退出登录*/
router.get('/logout', checkLogin);
router.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', '退出登录');
    res.redirect('/');
});
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登入');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
    if(req.session.user) {
        req.flash('error','已登录');
        res.redirect('/');
    }
    console.log('into checkNotLogin')
    next();
}

module.exports = router;
