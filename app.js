
var express = require('express');

var path = require('path');

var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

//命令行设置环境变量
var port = process.env.PORT || 3000;

//启动web服务 把实例赋值 app
var app = express();

//连接数据库mongodb

mongoose.connect('mongodb://localhost/imooc');


//设置视图的根目录

app.set('views',  './views/pages');

//设置默认的模版引擎

app.set('view engine', 'jade');

//app.use(express.bodyParser());
app.use(bodyParser.urlencoded());
app.locals.moment = require('moment');
//app.use(express.static(path.jojn(__dirname, 'public')));
app.use(serveStatic('public'));

//监听端口
app.listen(port);


console.log('nodeStation started on port ' + port);

// index page

app.get('/', function (req, res) {

    Movie.fetch(function (err, movies) {
        if(err){
            console.log(err);
        }
        res.render('index',{
            title: 'imooc 首页',
            movies: movies
        })
    });

});

// list page

app.get('/admin/list', function (req, res) {

    Movie.fetch(function (err, movies) {
        if(err){
            console.log(err);
        }
        res.render('list',{
            title: 'imooc 列表页',
            movies: mocves
        })
    });

});

// detail page

app.get('/movie/:id', function (req, res) {

    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        
        res.render('index',{
            title: 'imooc' + movie.title,
            movie: movie
        })
    })
});

// admin page

app.get('/admin/movie', function (req, res) {
    res.render('index',{
        title: 'imooc 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flashe: '',
            summary: '',
            language: ''
        }
    })
});

//admin update movie

app.get('admin/update/:id', function (req, res) {
    var id = req.params.id;
    
    if(id){
        Movie.findById(id, function (err, movie) {
            res.render('admin',{
                title: "imooc "
            })
        })
    }
})

// admin post movie

app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if(id !== undefined){
        Movie.findById(id, function (err, movie) {
            if(err){
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err){
                    console.log(err);
                }
                // 成功重定向
                res.redirect('/movie/' + movie._id)
            })
        })
    }
    else{
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash

        });
        _movie.save(function (err, movie) {
          if (err){
              console.log(err);
          }
          res.redirect('/movie/' + movie._id);
        })
    }
});

//list delete movie

app.delete('/admin/list', function (req, res) {
    var id = req.query.id;

    if(id){
        Movie.remove({_id:id},function (err, movie) {
            if(err){
                console.log(err)
            }
            else{
                res.json({success: 1})
            }
        })
    }
});