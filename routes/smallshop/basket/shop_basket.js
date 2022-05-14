const express = require('express');

const router = express.Router();

module.exports = (params) => {
  router.get('/', (request, response, next) => {
    try {
      response.render('layout', {
        pageTitle: 'basket',
        template: 'smallshop/shop_layout/index',
        shop_template: 'shop_basket',
      });
    } catch (err) {
      return next(err);
    }
  });
  return router;
};
