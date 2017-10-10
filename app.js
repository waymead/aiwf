require('dotenv').load({
	silent: true
});

const Koa = require('koa');
const serve = require('koa-static');
const helmet = require('koa-helmet');
const favicon = require('koa-favicon');
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const views = require('koa-views');
const redisStore = require('koa-redis');
const { errorHandler } = require('./lib/middleware');

const app = new Koa();
app.use(serve('public', {}));

app.use(helmet());
app.use(
	helmet.referrerPolicy({
		policy: 'unsafe-url'
	})
);

app.use(bodyParser());
app.use(favicon(__dirname + '/public/images/logo.png'));

app.keys = [process.env.REDIS_SESSION_SECRET];
app.use(session({
	store: redisStore({
		url: process.env.REDIS_URL
	})
}, app));

require('./lib/auth0-strategy');
const passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(views(__dirname + '/views', { extension: 'pug' }));

// Error handling
app.use(errorHandler());

const router = require('./routes');
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT);

module.exports = app;
