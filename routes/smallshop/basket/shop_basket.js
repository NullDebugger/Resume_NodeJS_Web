const express = require('express');
const res = require('express/lib/response');
const BasketService = require('../../../services/Smallshop/BasketService');
const ItemService = require('../../../services/Smallshop/ItemService');
const config = require('../../../config/index');

module.exports = (params) => {
  const router = express.Router();

  /* /smallshop/store */
  router.get('/', async (request, response, next) => {
    // Check the User frist
    if (!response.locals.currentUser) {
      request.session.shop_messages.push({
        type: 'alert alert-warning',
        text: 'Please log in first',
      });
      return response.redirect('/smallshop/store');
    }
    console.log('Iam basket router Test:', response.locals);
    const basket = new BasketService(config.redis.client, response.locals.currentUser.id);
    const basketItems = await basket.getAll();
    let basket_show_items = [];
    if (basketItems) {
      basket_show_items = await Promise.all(
        Object.keys(basketItems).map(async (itemId) => {
          const item = await ItemService.getOneItem(itemId);
          item.quantity = basketItems[itemId];
          return item;
        })
      );
    }
    try {
      response.render('layout', {
        pageTitle: 'basket',
        template: 'smallshop/shop_layout/index',
        shop_template: 'shop_basket',
        basket_show_items,
      });
    } catch (err) {
      return next(err);
    }
  });

  /* Used to remove item from basket '/smallshop/basket/remove/:itemId' */
  router.get('/remove/:itemId', async (req, res) => {
    if (!res.locals.currentUser) {
      req.session.shop_messages.push({
        type: 'alert alert-warning',
        text: 'Please log in first',
      });
      return res.redirect('/smallshop/store');
    }

    try {
      const basket = new BasketService(config.redis.client, res.locals.currentUser.id);
      await basket.remove(req.params.itemId);
      req.session.shop_messages.push({
        type: 'alert alert-success',
        text: 'The item was removed from the the basket',
      });
    } catch (err) {
      req.session.shop_messages.push({
        type: 'alert alert-danger',
        text: 'There was an error removing the item from the basket',
      });
      console.error(err);
      return res.redirect('/smallshop/basket');
    }
    return res.redirect('/smallshop/basket');
  });
  /* Used to Buy the itme from basket, it will related to 'Order' page */

  return router;
};
