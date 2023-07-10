'use strict';

const express = require('express');
const router = express.Router();

// get della pagina di login
router.get('/', function (req, res, next) {
  const user = req.user;
  const isLoggedIn = req.isAuthenticated();
  res.render('login', { title: 'Login', message: null, isLoggedIn, user });
});

module.exports = router;