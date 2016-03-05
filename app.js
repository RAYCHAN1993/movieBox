var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var _ = require('underscore');
var MovieBox = require('./models/movie');

var port = process.env.PORT || 3000;
var app = express();
app.listen(port);

mongoose.connect('mongodb://127.0.0.1:27017/imooc');

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.locals.moment = require('moment');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));

console.log('nodeSite started on port ' + port);

//index page 首页
app.get('/',function(req,res){
	MovieBox.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		res.render('index',{
			title: '电影人生',
			movies: movies
		});
	});
});

// detail page 详细页
app.get('/movie/:id',function(req,res){
	var id = req.params.id;

	MovieBox.findById(id, function(err, movie){		
		if(err){
			console.log(err);
		}
		res.render('detail', {
			// title: 'imooc ' + movie.title,
			movie: movie
		});
	});
});

//admin update movie
app.get('/admin/update/:id', function(req, res){
	var id = req.params.id;
	if(id){
		MovieBox.findById(id, function(err, movie){
			res.render('admin', {
				title: 'imooc 后台更新页',
				movie: movie
			});
		});
	}
});

//admin post movie
app.post('/admin/movie/new', function(req, res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(id !== 'undefined'){
		MovieBox.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}

			// 创建文档对象实例并保存
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			});
		});
	}else{
		_movie = new MovieBox({
			// _id 	 :  movieObj._id,
			director : 	movieObj.director,
			title 	 : 	movieObj.title,
			country  : 	movieObj.country,
			language : 	movieObj.language,
			year     : 	movieObj.year,
			poster   : 	movieObj.poster,
			summary  : 	movieObj.summary,
			flash    : 	movieObj.flash
		});

		_movie.save(function(err, movie){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/' + movie._id);
		});
	}
});

//list page
app.get('/admin/list',function(req,res){
	
	MovieBox.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title : 'imooc 列表页',
			movies: movies
		});
	});
});

//admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title : 'imooc 后台录入页',
		movie : {
			director : '',
			country  : '',
			title    : '',
			year     : '',
			poster   : '',
			language : '',
			flash    : '',
			summary  : ''
		}
	});
});

//list delete movie
app.delete('/admin/list', function(req,res){
	var id = req.query.id;

	if(id){
		MovieBox.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err);
			}else{
				res.json({success: 1});
			}
		});
	}
});
