'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const filmDao = require('../models/film-dao');
const reviewDao = require('../models/review-dao');

//tramite passport, gestisce il login dell'utente e dell'admin
router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      const isLoggedIn = req.isAuthenticated();
      return res.render('login', { title: 'Login', isLoggedIn, message: 'Utente inesistente', user: null });
    }
    req.login(user, function (err) {
      if (err) { return next(err); }
      // se è utente
      if (user.admin == 0) {
        filmDao.getAllUserTicketsInfo(user.id).then((tickets) => {
          reviewDao.getAllUserReviews(user.id).then((reviews) => {
            const isLoggedIn = req.isAuthenticated();
            res.render('user', { title: 'Area Personale', tickets, user, reviews, isLoggedIn });
          });
        });
      }
      // se è admin
      else {
        filmDao.getAllTicketsInfo().then((tickets) => {
          reviewDao.getAllReviews().then((reviews) => {
            const isLoggedIn = req.isAuthenticated();
            res.render('admin-users-area', { title: 'Area Utenti', tickets, user, reviews, isLoggedIn });
          });
        });
      }
    });
  })(req, res, next);
});

//gestisce il logout
router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
