var express = require('express');
var expresshbs = require('express-handlebars');
var fortune = require('./lib/fortune.js');
var toursData = require('./apis/tours.json');
// var tours = require('./apis/tours.js');
var watherData = require('./apis/wather.json');
// var wather = require('./apis/wather.js');

var app = express();

//set up handlebars view engine
var hbs = expresshbs.create({
	defaultLayout: 'main',
	layoutsDir: 'views/layouts',
	extname: '.handlebars',
  helpers: {
    section: function (name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//设置端口
app.set('port', process.env.PORT || 3000);
//获取端口
var port = app.get('port');
//静态资源路径
app.use(express.static(__dirname + '/public'));

/*********** 设置路由 ************/
// set 'showTests' context property if the querystring contains test=1
app.use(function (req, res, next) {
	res.locals.showTests = app.get('env') !== 'production' &&
	  req.query.test === '1';
	next();
});

// middleware to add weather data to context
app.use(function (req, res, next) {
  if(!res.locals.partials) { 
    res.locals.partials = {}
  };
  // res.locals.partials.weatherContext = wather.getWeatherData();
  res.locals.partials.weatherContext = watherData;
  next();
});

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/about', function (req, res) {
	res.render('about', { 
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	});
});

app.get('/tours/hood-river', function (req, res){
	res.render('tours/hood-river');
});
app.get('/tours/oregon-coast', function (req, res){
	res.render('tours/oregon-coast');
});
app.get('/tours/request-group-rate', function (req, res){
	res.render('tours/request-group-rate');
});
app.get('/jquery-test', function(req, res){
  res.render('jquery-test');
});
app.get('/nursery-rhyme', function(req, res){
  res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
  res.json({
    animal: 'squirrel',
    bodyPart: 'tail',
    adjective: 'bushy',
    noun: 'heck',
  });
});

/*
 * 提供一个API
 */
app.get('/api/tours', function(req, res) {
  // res.json(tours.tours());
  res.json(toursData);
});

// 404 catch-all handler (middleware)
app.use(function (req, res) {
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
	res.status(500);
	res.render('500');
});
/*********** 设置路由end ************/

app.listen(port, function () {
	console.log('Epress started on http:localhost:' + port  + '; press Ctrl-C terminate...');
});