'use strict';

let express = require('express');
let router = express.Router();
const dao = require('../models/film-dao');
const { check, validationResult } = require('express-validator');

//get della pagina dell'admin per la gestione dei film
router.get('/', function (req, res, next) {
    dao.getAllFilms().then((films) => {
        const user = req.user;
        const isLoggedIn = req.isAuthenticated();
        res.render('admin-films-area', { title: 'Area Film', films, isLoggedIn, user });
    });
});

module.exports = router;