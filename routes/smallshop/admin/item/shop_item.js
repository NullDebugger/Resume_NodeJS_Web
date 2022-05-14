const express = require('express');

const router = express.Router();

module.exports = (params) => {
  router.get('/', (request, response, next) => {
    response.render('layout', {
      pageTitle: 'Manage Item',
      template: 'smallshop/shop_layout/index',
      shop_template: 'admin/item',
    });
  });
  return router;
};
