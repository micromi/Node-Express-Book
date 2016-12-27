var express = require('express');
var expresshbs = require('express-handlebars');
var fortune = require('./lib/fortune.js');
var toursApi = require('./apis/tours.json');

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
app.get('', function (req, res) {
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

/*
 * 提供一个API
 */
app.get('/api/tours', function(req, res) {
  res.json(toursApi);
});
// GET节点,返回JSON、XML或text (测试未通过)
/*app.get('/api/tours', function (req, res) {
  var touresXml = '<?xml version="1.0"?><tours>' +
    toursApi.map(function (p) {
      return '<tour price="' + p.price +
        '" id="' + p.id + '">' + p.name + '<tour>';
    }).join('') + '</tours>';
  var toursText = tours.map(function (p) {
    return p.id + ': ' + p.name + '(' + p.price + ')';
  }).join('\n');
  res.format({
    'application/json': function () {
      res.json(tours);
    },
    'application/xml': function () {
      res.type('application/xml');
      res.send(touresXml);
    },
    'text/xml': function () {
      res.type('text/xml');
      res.send(touresXml);
    },
    'text/plain': function () {
      res.type('text/plain');
      res.send(toursText);
    },
    'default': function () {
      res.json(toursText);
    }
  })
});*/
// 用于更新put节点 (测试未通过)
/*app.put('/api/tour/:id', function (req, res) {
  var p = toursApi.some(function (p) {
    return p.id = req.params.id;
  });
  if (p) {
    if (req.query.name) {
      p.name = req.query.name;
    }
    if (req.query.price) {
      p.price = req.params.price;
    }
    res.json({success: true});
  } else {
    res.json({error: 'No such tour exists.'});
  }
});*/
// 用于删除的DEL节点 (测试未通过)
/*app.del('/api/tour/:id', function (req, res) {
  var i;
  var tours = toursApi;
  for (var i = tours.length - 1; i >= 0; i--) {
    if (tours[i].id == req.params.id) break;
  }
  if (i >= 0) {
    tours.split(i, 1);
    res.json({success: true});
  } else {
    res.json({ error: 'No such tour exists.'});
  }
});*/

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