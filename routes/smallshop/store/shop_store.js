const express = require('express');
const ItemService = require('../../../services/Smallshop/ItemService');
const BasketService = require('../../../services/Smallshop/BasketService');
const config = require('../../../config/index');
const router = express.Router();

module.exports = (params) => {
  router.get('/', async (request, response, next) => {
    try {
      // Get all of the item from databse
      const all_items = await ItemService.getAllItem();

      // Get the error or success information from request session
      const store_info = request.session.shop_messages.pop();

      response.render('layout', {
        pageTitle: 'Store',
        template: 'smallshop/shop_layout/index',
        shop_template: 'shop_store',
        all_items,
        store_info,
      });
    } catch (err) {
      return next(err);
    }
  });

  /* Add item to basket */
  router.get('/tobasket/:itemId', async (req, res) => {
    // Check the login User first
    if (!res.locals.currentUser) {
      req.session.shop_messages.push({
        type: 'alert alert-warning',
        text: 'Please log in first',
      });
      return res.redirect('/smallshop/store');
    }

    try {
      const basket = new BasketService(config.redis.client, res.locals.currentUser.id);
      await basket.add(req.params.itemId);
      req.session.shop_messages.push({
        type: 'alert alert-success',
        text: 'The item was added too the basket',
      });
    } catch (err) {
      req.session.shop_messages.push({
        type: 'alert alert-danger',
        text: 'There was an error adding the item to basket',
      });
      console.error(err);
    }
    return res.redirect('/smallshop/store');
  });

  return router;
};
