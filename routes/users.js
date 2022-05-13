const express = require('express');
const req = require('express/lib/request');

const router = express.Router();

module.exports = (params) => {
  const { usersService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const users = await usersService.getList();
      const artwork = await usersService.getAllPhotos();
      return response.render('layout', {
        pageTitle: 'users',
        template: 'users',
        users,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:title', async (request, response, next) => {
    try {
      const information = await usersService.getInformation(request.params.title);
      // console.log(information);
      const artwork = await usersService.getArtwork_title(request.params.title);
      return response.render('layout', {
        pageTitle: 'users',
        template: 'users-detail',
        information,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
