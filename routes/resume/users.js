const express = require('express');
const req = require('express/lib/request');

const router = express.Router();

module.exports = (params) => {
  const { resumeUserService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const users = await resumeUserService.getList();
      const artwork = await resumeUserService.getAllPhotos();
      return response.render('layout', {
        pageTitle: 'users',
        template: '/resume/users',
        users,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:title', async (request, response, next) => {
    try {
      const information = await resumeUserService.getInformation(request.params.title);
      // console.log(information);
      const artwork = await resumeUserService.getArtwork_title(request.params.title);
      return response.render('layout', {
        pageTitle: 'users',
        template: 'resume/users-detail',
        information,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
