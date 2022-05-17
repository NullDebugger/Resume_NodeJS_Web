const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');

const createError = require('http-errors');

const bodyParser = require('body-parser');

const FeedbackService = require('./services/Resume/FeedbackService');
const UsersService = require('./services/Resume/AboutmeService');

const feedbackService = new FeedbackService('./data/feedback.json');
const usersService = new UsersService('./data/users.json');

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

    // Get all of the users
    try {
      const all_users = await usersService.getList();
      response.locals.all_users = all_users;
    } catch (err) {
      return next(err);
    }

    response.locals.shop_messages = request.session.shop_messages;
    return next();
  });

  app.use(
    '/',
    routes({
      feedbackService,
      usersService,
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
