const express = require('express');
const res = require('express/lib/response');
const ItemService = require('../../../../services/Smallshop/ItemService');

module.exports = (params) => {
  const router = express.Router();

  router.get('/:itemId?', async (request, response, next) => {
    try {
      const all_items = await ItemService.getAllItem();
      let edit_item = null;
      // Get the Edit Item by Given Item Id
      if (request.params.itemId) {
        edit_item = await ItemService.getOneItem(request.params.itemId);
      }

      // Get the error information from request session
      const shop_info = request.session.shop_messages.pop();
      return response.render('layout', {
        pageTitle: 'Manage Item',
        template: 'smallshop/shop_layout/index',
        shop_template: 'admin/item',
        shop_info,
        all_items,
        edit_item,
      });
    } catch (err) {
      return next(err);
    }
  });

  /* Save(Create) or update item */
  router.post('/', async (req, res, next) => {
    // Get the data passed in form
    const sku = req.body.sku.trim();
    const name = req.body.name.trim();
    const price = req.body.price.trim();

    // Make sure the data is complete
    if (!sku || !name || !price) {
      req.session.shop_messages.push({
        type: 'alert alert-warning',
        text: 'Please enter SKU, name and price!',
      });
      return res.redirect('/smallshop/admin/item');
    }

    // Create Item or Update Item
    try {
      // If there was no existing item, then we will create it
      if (!req.body.edit_itemId) {
        await ItemService.createItem({ sku, name, price });
        // Send the successful message
        req.session.shop_messages.push({
          type: 'alert alert-success',
          text: 'The item was created successfully!',
        });
      } else {
        // If there was a existing item, then it will update it
        const itemData = {
          sku,
          name,
          price,
        };
        await ItemService.updateItem(req.body.edit_itemId, itemData);
        // Send the successful message
        req.session.shop_messages.push({
          type: 'alert alert-success',
          text: 'The item was updated successfully!',
        });
      }
      return res.redirect('/smallshop/admin/item');
    } catch (err) {
      // Handling Error
      req.session.shop_messages.push({
        type: 'alert alert-danger',
        text: 'There was an error while saving the item!',
      });
      console.error(err);
      return res.redirect('/smallshop/admin/item');
    }
  });
  /* Deletee Item */
  router.get('/delete/:itemId', async (request, response, next) => {
    console.log('I am test', request.params.itemId);
    try {
      await ItemService.removeItem(request.params.itemId);
    } catch (err) {
      // Error Handling
      request.session.shop_messages.push({
        type: 'alert alert-danger',
        text: 'There was an error while deleting the item!',
      });
      console.error(err);
      return response.redirect('/smallshop/admin/item');
    }
    // Sent the Successful Messages
    request.session.shop_messages.push({
      type: 'alert alert-success',
      text: 'The Item was successfully deleted!!',
    });
    return response.redirect('/smallshop/admin/item');
  });

  return router;
};
