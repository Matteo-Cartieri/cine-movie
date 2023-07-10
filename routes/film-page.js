'use strict';

let express = require('express');
let router = express.Router();
const userDao = require('../models/film-dao');
const revDao = require('../models/review-dao');

//get della scheda di un film (in base al parametro)
router.get('/:idFilm', function (req, res, next) {
    userDao.getFilmById(req.params.idFilm).then((film) => {
        revDao.getAllFilmReviews(req.params.idFilm).then((reviews) => {
            const user=req.user;
            const isLoggedIn = req.isAuthenticated();
            res.render('film-page', { title: 'Scheda'+' '+film.titolo, film, reviews, isLoggedIn, user });
        });
    });
});

module.exports = router;