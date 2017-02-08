var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan'); // HTTP request logger middleware for node.js
var path = require('path');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var mongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 3000;
var app = express();
var fs = require('fs');
var dbUrl = 'mongodb://localhost:27017/movies';
var compression = require('compression');

mongoose.connect(dbUrl); //连接数据库

// models loading
var models_path = __dirname + '/app/models';
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath);
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath);
      }
    });
};
walk(models_path);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(session({
  secret: 'ethan',
  /*cookie:{
  	maxAge: 1000 * 60 * 60 * 24 * 1, //默认1天
  	domain:'/'
  },*/
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  }),
  resave: false,
  saveUninitialized: true
}));
app.use(compression()); //启用gzip压缩
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('body-parser').urlencoded({ extended: true }));
app.locals.moment = require('moment');
app.listen(port);

if ('development' === app.get('env')) {
  app.set('showStackError', true);
  app.use(morgan(':method :url :status'));
  app.locals.pretty = true;
  //mongoose.set('debug', true);
}
//引入路由模块
require('./config/routes')(app);
console.log('server is listening port' + port + '!');
