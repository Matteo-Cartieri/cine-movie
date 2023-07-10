'use strict';

let express = require('express');
let router = express.Router();
const dao = require('../models/film-dao');
const { check, validationResult } = require('express-validator');

// get della homepage
router.get('/', function (req, res, next) {
    dao.getAllFilms().then((films) => {
        dao.getAllGenres().then((genres) => {
            dao.getAllDates().then((dates) => {
                dao.getAllHours().then((hours) => {
                    const user=req.user;
                    const isLoggedIn = req.isAuthenticated();
                    res.render('index', { films, genres, dates, hours, isLoggedIn, user });
                });
            });
        });
    });
});

router.post('/search', [
    check('search').notEmpty()
], async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Ricerca non valida
        res.redirect('/');
    } else {
        try {
            //crea un parametro di ricerca
            const search='%'+req.body.search+'%';
            dao.getSearchedFilms(search).then((films) => {
                dao.getAllGenres().then((genres) => {
                    dao.getAllDates().then((dates) => {
                        dao.getAllHours().then((hours) => {
                            const user=req.user;
                            const isLoggedIn = req.isAuthenticated();
                            res.render('index', { films, genres, dates, hours, isLoggedIn, user });
                        });
                    });
                });
            });
        } catch (error) {
            res.redirect('/');
        }
    }
});

module.exports = router;

