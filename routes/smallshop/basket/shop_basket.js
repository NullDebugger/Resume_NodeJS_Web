const express = require('express');
const res = require('express/lib/response');
const BasketService = require('../../../services/Smallshop/BasketService');
const ItemService = require('../../../services/Smallshop/ItemService');
const config = require('../../../config/index');
const OrderService = require('../../../services/Smallshop/OrderService');

module.exports = (params) => {
  const router = express.Router();
  const order = new OrderService(config.mysql.client);

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
    // console.log('Iam basket router Test:', response.locals);
    const basket = new BasketService(config.redis.client, response.locals.currentUser.id);
    const basketItems = await basket.getAll();
    console.log('Iam Basket router Test:', basketItems);
    let basket_show_items = [];
    if (basketItems) {
      basket_show_items = await Promise.all(
        Object.keys(basketItems).map(async (itemId) => {
          // console.log('Iam basket router - Item ID test:', itemId);
          const item = await ItemService.getOneItem(itemId);
          // console.log('Iam basket router Item test:', item);
          if (item == null) {
            basket.remove(itemId);
            return response.redirect('/smallshop/basket');
          } else {
            item.quantity = basketItems[itemId];
            return item;
          }
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
  router.get('/buy', async (req, res) => {
    if (!res.locals.currentUser) {
      req.session.shop_messages.push({
        type: 'alert alert-warning',
        text: 'Please log in first',
      });
      return res.redirect('/smallshop/store');
    }
    try {
      const userId = res.locals.currentUser.id;
      const user = res.locals.currentUser;
      // Get all basket item from this user
      const basket = new BasketService(config.redis.client, userId);
      const basketItems = await basket.getAll();

      // Be defensive
      if (!basketItems) {
        throw new Error('No items found in basket');
      }
      /* 
      1. Find the item for each basket entry and add the quantity for it
      2. Return a new sturcture array with new properties
       */
      const items = await Promise.all(
        Object.keys(basketItems).map(async (key) => {
          // Get the item's name, price, sku
          const item = await ItemService.getOneItem(key);
          return {
            sku: item.sku,
            qty: basketItems[key],
            price: item.price,
            name: item.name,
          };
        })
      );
      // Run this in a sequelize transaction
      await order.inTransaction(async (t) => {
        // Create a new order and add all items
        await order.create(user, items, t);
        // clear the users basket
        await Promise.all(
          Object.keys(basketItems).map(async (itemId) => {
            await basket.remove(itemId);
          })
        );
      });
      // If Successful, sent message to alert
      req.session.shop_messages.push({
        type: 'alert alert-success',
        text: 'Thank you for your business',
      });

      return res.redirect('/smallshop/store');
    } catch (err) {
      req.session.shop_messages.push({
        type: 'alert alert-danger',
        text: 'There was an error finishing your order',
      });
      console.error(err);
      return res.redirect('/smallshop/basket');
    }
  });
  return router;
};
