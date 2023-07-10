'use strict';

let express = require('express');
const filmDao = require('../models/film-dao.js');
const { check, validationResult } = require('express-validator');
let router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//get della pagina per l'inserimento dei dati di un film da parte dell'admin
router.get('/', function (req, res, next) {
    const isLoggedIn = req.isAuthenticated();
    const user = req.user;
    res.render('insert-film', { title: 'Carica Film', message: null, isLoggedIn, user });
});

// Controllo dei valori inseriti nel form e inserimento del film
router.post('/', [
    check('title').notEmpty().withMessage('Inserire il titolo'),
    check('direction').notEmpty().withMessage('Inserire la regia'),
    check('year').isLength(4).withMessage('Inserire un anno valido'),
    check('length').isInt().withMessage('Inserire la durata in minuti'),
    check('genre').notEmpty().withMessage('Inserire il genere'),
    check('day').notEmpty().withMessage('Inserire il giorno'),
    check('hour').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Inserire l\'orario nel formato corretto'),
    check('cast').isLength({ max: 25 }).withMessage('Inserire il cast (massimo 25 caratteri)'),
    check('plot').notEmpty().withMessage('Inserire la trama')
], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // campi non validi, errore
        const messages = errors.array().map(error => error.msg);
        const isLoggedIn = req.isAuthenticated();
        const user = req.user;
        res.render('insert-film', { title: 'Carica Film', message: messages[0], isLoggedIn, user });
    } else {
        try {
            // campi validi, crea il film
            const film = {
                titolo: req.body.title,
                regia: req.body.direction,
                anno: parseInt(req.body.year),
                durata: parseInt(req.body.length),
                genere: req.body.genre,
                data: req.body.day,
                ora: req.body.hour,
                castfilm: req.body.cast,
                trama: req.body.plot
            };
            //inserisce il film nel database
            filmDao.insertFilm(film).then((id) => { res.redirect('/insert-film/' + id); });

        } catch (error) {
            const isLoggedIn = req.isAuthenticated();
            const user = req.user;
            res.render('insert-film', { title: 'Carica Film', message: 'Errore nel salvataggio del film', isLoggedIn, user });
        }
    }
});

router.get('/:id', function (req, res, next) {
    const isLoggedIn = req.isAuthenticated();
    const user = req.user;
    const id = req.params.id;
    res.render('insert-film-image', { title: 'Carica Immagine Film', message: null, isLoggedIn, user, id });
});

router.post('/:id', function (req, res, next) {
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/img/');
        },
        filename: function (req, file, callback) {
            var temp_file_arr = file.originalname.split('.');
            var temp_file_extension = temp_file_arr[1];
            callback(null, 'film_' + req.params.id + '.' + temp_file_extension);
        }
    });
    var upload = multer({ storage: storage }).single('image');

    upload(req, res, function (error) {
        if (error) {
            const isLoggedIn = req.isAuthenticated();
            const user = req.user;
            const id = req.params.id;
            res.render('insert-film-image', { title: 'Carica Immagine Film', message: error, isLoggedIn, user, id });
        }
        else {
            res.redirect('/');
        }
    });
});

router.post('/:idFilm/delete', async function (req, res, next) {
    filmDao.deleteFilm(req.params.idFilm);
    res.redirect('/');
});

module.exports = router;