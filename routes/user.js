'use strict';

let express = require('express');
let router = express.Router();
const filmDao = require('../models/film-dao');
const reviewDao = require('../models/review-dao');

//get della pagina di per l'area utente
router.get('/', function (req, res, next) {
    const user = req.user;
    filmDao.getAllUserTicketsInfo(user.id).then((tickets) => {
        reviewDao.getAllUserReviews(user.id).then((reviews) => {
            const isLoggedIn = req.isAuthenticated();
            res.render('user', { title: 'Area Personale', tickets, reviews, isLoggedIn, user });
        });
    });
});

module.exports = router;