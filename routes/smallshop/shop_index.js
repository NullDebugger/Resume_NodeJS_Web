const express = require('express');
const storeRoute = require('./store/shop_store');

const router = express.Router();

module.exports = (params) => {
  router.get('/', (request, response, next) => {
    try {
      response.render('layout', {
        pageTitle: 'Small Shop',
        template: 'smallshop/shop_layout/index',
        shop_template: 'shop_home',
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/store', storeRoute(params));
  return router;
};
