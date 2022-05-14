const express = require('express');

const router = express.Router();

module.exports = (params) => {
  router.get('/', (request, response, next) => {
    try {
      response.render('layout', {
        pageTitle: 'Store',
        template: 'smallshop/shop_layout/index',
        shop_template: 'shop_store',
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
