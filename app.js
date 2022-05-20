const express = require('express');
const path = require('path');

const session = require('express-session');
const cookieSession = require('cookie-session');
const RedisStore = require('connect-redis')(session);

const createError = require('http-errors');

const bodyParser = require('body-parser');

/* Resumee Services */
const FeedbackService = require('./services/Resume/FeedbackService');
const AboutmeService = require('./services/Resume/AboutmeService');

const feedbackService = new FeedbackService('./data/feedback.json');
const resumeUserService = new AboutmeService('./data/users.json');

/* Smallshop Serviices */
const ShopUserService = require('./services/Smallshop/UserService');
const BasketService = require('./services/Smallshop/BasketService');

const routes = require('./routes');
const { response } = require('express');
const res = require('express/lib/response');
const { resolve } = require('path');

module.exports = (config) => {
  const app = express();

  // -------- Start view engine setup --------
  // Tell Express where to find those views
  app.set('views', path.join(__dirname, './views'));
  // Tell Express to use EJS
  app.set('view engine', 'ejs');

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Trust first proxy
  app.set('trust proxy', 1);
  app.use(
    cookieSession({
      name: 'session',
      keys: ['sajndaj', 'skajbdkajs'],
    })
  );
  app.use(
    session({
      store: new RedisStore({ client: config.redis.client }),
      secret: 'very secret secret to encyrpty session',
      resave: false,
      saveUninitialized: false,
    })
  );
  /* 
  middleware, 
  This will instruct Express to look into the static folder for each request
  it receives and if it found the matching file, it will send to the browser 
  */
  app.use(express.static(path.join(__dirname, './static')));
  // -------- End view engine setup --------
  // -------- Start Define 'global' template variables --------
  app.use(async (request, response, next) => {
    app.locals.siteName = 'Ken';

    // Get all of the information for resume pages
    try {
      const all_informations = await resumeUserService.getList();
      response.locals.all_informations = all_informations;
    } catch (err) {
      return next(err);
    }

    // console.log('I am app.js request Test:', request.session);

    // Check the User for add item to basket (Store & Redis)
    if (request.session.userId) {
      try {
        response.locals.currentUser = await ShopUserService.getOneUser(request.session.userId);
        // console.log('I am app.js Try resonpse Test:', response.locals);
        // console.log('Iam app.js redis client:', config.redis.client);

        // const testclient = new Redis(7379);
        // console.log('Iam app.js test redis client:', testclient);
        const basket = new BasketService(config.redis.client, request.session.userId);
        // console.log('Iam confiig: ', config.redis.client, 'Iam sessionId', request.session.userId);
        // console.log('Iam App.js basket', basket);

        let basketCount = 0;
        // console.log('Iam basket test:', basket);

        const basketContents = await basket.getAll();

        // console.log('Test:', basketContents);
        if (basketContents) {
          Object.keys(basketContents).forEach((itemId) => {
            basketCount += parseInt(basketContents[itemId], 10);
          });
        }
        response.locals.basketCount = basketCount;
      } catch (err) {
        // console.log('I am app.js Catch error resonpse Test:', response.locals);
        return next(err);
      }
    }

    response.locals.shop_messages = request.session.shop_messages.pop();
    // console.log('Iam response locals shop messages', response.locals.shop_messages);
    return next();
  });

  app.use(
    '/',
    routes({
      feedbackService,
      resumeUserService,
    })
    // Catch 404 and forward to error handler
  );

  app.use((request, response, next) => {
    return next(createError(404), 'File not found');
  });

  app.use((err, request, response, next) => {
    response.locals.message = err.message;
    console.error(err);
    const status = err.status || 500;
    response.locals.status = status;
    response.status(status);
    response.render('error');
  });
  return app;
};
