const express = require('express');
// Get Service from services/Smallshop/UserService
const UserService = require('../../../../services/Smallshop/UserService');

module.exports = () => {
  const router = express.Router();

  /* Get the href"/smallshop/admin/user" */
  router.get('/:userId?', async (request, response, next) => {
    try {
      const all_users = await UserService.getAllUsers();

      let edit_user = null;
      if (request.params.userId) {
        edit_user = await UserService.getOneUser(request.params.userId);
      }

      // Get the error or success information from request session
      const shopUser_info = request.session.shop_messages.pop();

      return response.render('layout', {
        pageTitle: 'Manage Item',
        template: 'smallshop/shop_layout/index',
        shop_template: 'admin/user',
        all_users,
        edit_user,
        shopUser_info,
      });
    } catch (err) {
      return next(err);
    }
  });

  /* Save(Create) or Update User */
  router.post('/', async (req, res, next) => {
    // Get the information from request body
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    if (!email || (!password && req.body.userId)) {
      req.session.shop_messages.push({
        type: 'alert alert-warning',
        text: 'Please enter email address and password!',
      });
      return res.redirect('/smallshop/admin/user');
    }

    try {
      // if there is no exsiting user, then create new one
      if (!req.body.edit_userId) {
        await UserService.create({ email, password });
        req.session.shop_messages.push({
          type: 'alert alert-success',
          text: 'The user was created successfully!',
        });
      } else {
        const userData = {
          email,
        };
        // If the password does not need to change
        if (password) {
          userData.password = password;
        }
        await UserService.update(req.body.edit_userId, userData);
        req.session.shop_messages.push({
          type: 'alert alert-success',
          text: 'The user was updated successfully!',
        });
      }
      return res.redirect('/smallshop/admin/user');
    } catch (err) {
      req.session.shop_messages.push({
        type: 'alert alert-danger',
        text: 'There was am error while saving the user!',
      });
      console.error(err);
      return res.redirect('/smallshop/admin/user');
    }
  });
  /* Delte User */
  router.get('/delete/:userId', async (req, res, next) => {
    try {
      await UserService.remove(req.params.userId);
      req.session.shop_messages.push({
        type: 'alert alert-success',
        text: 'The user was successfully deleted!',
      });
      return res.redirect('/smallshop/admin/user');
    } catch (err) {
      req.session.shop_messages.push({
        type: 'alert alert-danger',
        text: 'There was an error while deleting the user',
      });
      return res.redirect('/smallshop/admin/user');
    }
  });
  return router;
};
