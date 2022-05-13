const express = require('express');

const router = express.Router();

module.exports = (params) => {
  router.get('/', (request, response, next) => {
    try {
      response.render('layout', {
        pageTitle: 'Small Shop',
        template: '/smallshop/index',
      });
    } catch (err) {
      return next(err);
    }
  });
  return router;
};
