const express = require('express');

const { check, validationResult } = require('express-validator');

const router = express.Router();

const validation = [
  check('name').trim().isLength({ min: 3 }).escape().withMessage('A name is required'),
  check('email').trim().isEmail().normalizeEmail().withMessage('A valid eamil adress is require'),
  check('title').trim().isLength({ min: 3 }).escape().withMessage('A title is require'),
  check('message').trim().isLength({ min: 5 }).escape().withMessage('A Message is required'),
];

module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const feedback = await feedbackService.getList();
      const errors = request.session.feedback ? request.session.feedback.errors : false;

      const successMessage = request.session.feedback ? request.session.feedback.message : false;

      request.session.feedback = {};

      return response.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
        errors,
        successMessage,
      });
    } catch (err) {
      return next(err);
    }
  });
  router.post('/', validation, async (request, response, next) => {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.session.feedback = {
          errors: errors.array(),
        };
        return response.redirect('/feedback');
      }
      const { name, email, title, message } = request.body;
      await feedbackService.addEntry(name, email, title, message);

      request.session.feedback = {
        message: 'Thank you for you feedback',
      };
      return response.redirect('/feedback');
    } catch (err) {
      return next(err);
    }
  });

  // //   Create a simple API
  // router.post('/api', validation, async (request, response, next) => {
  //   try {
  //     const errors = validationResult(request);
  //     if (!errors.isEmpty()) {
  //       return response.json({ errors: errors.array });
  //     }
  //     const { name, email, title, message } = request.body;
  //     await feedbackService.addEntry(name, email, title, message);
  //     //   update feedback entry
  //     const feedback = await feedbackService.getList();
  //     return response.json({ feedback, successMessage: 'Thank you for you feedback!' });
  //   } catch (err) {
  //     return next(err);
  //   }
  // });
  return router;
};
