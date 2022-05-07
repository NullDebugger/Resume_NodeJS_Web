const express = require('express');

// add user and feedback route
const usersRoute = require('./users');
const feedbackRoute = require('./feedback');

const req = require('express/lib/request');
const { Template } = require('ejs');

const router = express.Router();

module.exports = (params) => {
  const { usersService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const artwork = await usersService.getAllPhotos();
      const topusers = await usersService.getList();
      return response.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topusers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/users', usersRoute(params));
  router.use('/feedback', feedbackRoute(params));

  return router;
};
