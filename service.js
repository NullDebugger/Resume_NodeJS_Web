const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

const bodyParser = require('body-parser');

const FeedbackService = require('./services/FeedbackService');
const UsersService = require('./services/UserService');

const feedbackService = new FeedbackService('./data/feedback.json');
const usersService = new UsersService('./data/users.json');

const routes = require('./routes');
const { response } = require('express');
const res = require('express/lib/response');

const app = express();

app.locals.siteName = 'Ken';

const port = 3000;

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['sajndaj', 'skajbdkajs'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Tell Express to use EJS
app.set('view engine', 'ejs');

// Tell Express where to find those views
app.set('views', path.join(__dirname, './views'));

/* 
middleware, 
This will instruct Express to look into the static folder for each request
it receives and if it found the matching file, it will send to the browser 
 */
app.use(express.static(path.join(__dirname, './static')));

app.use(async (request, response, next) => {
  // Get all of the
  try {
    const all_users = await usersService.getList();
    response.locals.all_users = all_users;
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    usersService,
  })
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

app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});
