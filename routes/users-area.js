'use strict';

let express = require('express');
let router = express.Router();
const filmDao = require('../models/film-dao');
const reviewDao = require('../models/review-dao');

//get della pagina dell'admin per la gestione degli utenti
router.get('/', function (req, res, next) {
    const user = req.user;
    filmDao.getAllTicketsInfo().then((tickets) => {
        reviewDao.getAllReviews().then((reviews) => {
            const isLoggedIn = req.isAuthenticated();
            res.render('admin-users-area', { title: 'Area Utenti', tickets, user, reviews, isLoggedIn });
        });
    });
});

module.exports = router;
