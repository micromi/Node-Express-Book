var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

// set up handlebars view engine
var hbs = exphbs.create({
      defaultLayout: "main",
      layoutsDir:'views/layouts',
      extname:'.handlebars'
	  }); 

app.engine('handlebars', hbs.engine);
app.set('view engine','handlebars');

app.set('port', process.env.PORT || 3003); // 设置端口
var port = app.get('port'); // 获取端口
// 静态资源路径
app.use(express.static(__dirname + "/public"));

/*********** 设置路由 ************/
//主页路由
app.get('/', function(req, res) {
	// res.type("text/plain");
	// res.send("MeadowLark Travel");
	res.render('home');
});

var fortuneCookies = [
	"Conquer your fears or they will conquer you.",
	"Rivers need springs.",
	"Do not fear what you don't know.",
	"You will have a pleasant surprise.",
	"Whenever possible, keep it simple.",
];
//about路由
app.get('/about', function(req, res) {
	// res.type("text/plain");
	// res.send("About MeadowLark Travel");
	var randomFortune = 
	    fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)];
	res.render('about', {fortune: randomFortune});
});

//定制404页面
app.use(function (req, res) {
	// res.type("text/plain");
	res.status(404);
	res.render('404');
});

//定制500页面
app.use(function(err, req, res, next) {
	// res.type("text/plain");
	res.status(500);
	res.render('500');
});
/*********** 设置路由end ************/

app.listen(port, function () {
	console.log("Express started on http://localhost:" + port + ";press Ctrl-C terminate...");
})