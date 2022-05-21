const express = require('express');

// add user and feedback route
const usersRoute = require('./resume/users');
const feedbackRoute = require('./feedback');
const smallshopRoute = require('./smallshop/shop_index');

const req = require('express/lib/request');
const { Template } = require('ejs');

const router = express.Router();

module.exports = (params) => {
  // console.log(params);
  const { resumeUserService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const artwork = await resumeUserService.getAllPhotos();
      const topusers = await resumeUserService.getList();
      return response.render('layout', {
        pageTitle: 'Welcome',
        template: '/resume/index',
        topusers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/users', usersRoute(params));
  router.use('/feedback', feedbackRoute(params));
  router.use('/smallshop', smallshopRoute(params));

  return router;
};
