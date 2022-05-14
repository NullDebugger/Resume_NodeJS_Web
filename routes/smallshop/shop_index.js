const express = require('express');
const storeRouter = require('./store/shop_store');
const basketRouter = require('./basket/shop_basket');
const itemRouter = require('./admin/item/shop_item');
const userRouter = require('./admin/user/shop_user');
const orderRouter = require('./admin/order/shop_order');

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

  router.use('/store', storeRouter(params));
  router.use('/basket', basketRouter(params));
  router.use('/admin/item', itemRouter(params));
  router.use('/admin/user', userRouter(params));
  router.use('/admin/order', orderRouter(params));
  return router;
};
