var express = require('express');
var expresshbs = require('express-handlebars');
var fortune = require('./lib/fortune.js');

var app = express();

// set up handlebars view engine
var hbs = expresshbs.create({
	defaultLayout: 'main',
	layoutsDir: 'views/layouts',
	extname: '.handlebars'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// 设置端口
app.set('port', process.env.PORT || 3003);
// 获取端口
var port = app.get('port');
// 静态资源路径
app.use(express.static(__dirname + '/public'));

/*********** 设置路由 ************/
app.get('', function (req, res) {
	res.render('home');
});

app.get('/about', function (req, res) {
	res.render('about', { fortune: fortune.getFortune() });
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