const express = require('express');
const config = require('../../../../config/index');
const OrderService = require('../../../../services/Smallshop/OrderService');

module.exports = (params) => {
  const router = express.Router();
  // Connect to MySQL get the order by given client
  const order = new OrderService(config.mysql.client);

  router.get('/', async (request, response, next) => {
    try {
      // get all orders
      const orderResult = await order.getAll();
      // Run map on the data to convert it into nested arrays with orders and orderitems
      const all_orders = orderResult.map((item) => item.get({ plain: true }));
      response.render('layout', {
        pageTitle: 'Manage Item',
        template: 'smallshop/shop_layout/index',
        shop_template: 'admin/order',
        all_orders,
      });
    } catch (err) {
      req.session.shop_messages.push({
        type: 'alert alert-danger',
        text: 'There was an error fetching the orders',
      });
      console.error(err);
      return next(err);
    }
  });

  /* Router used to set the order status */
  router.get('/setShipped/:orderId', async (req, res, next) => {
    try {
      await order.setStatus(req.params.orderId, 'Shipped');
      req.session.shop_messages.push({
        type: 'alert alert-success',
        text: 'Status updated',
      });
      return res.redirect('/smallshop/admin/order');
    } catch (err) {
      req.session.shop_messages.push({
        type: 'alert alert-danger',
        text: 'There was an updaeting the order',
      });
      console.error(err);
      return res.redirect('/smallshop/admin/order');
    }
  });
  return router;
};
