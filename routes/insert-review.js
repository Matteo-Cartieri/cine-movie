'use strict';

let express = require('express');
let router = express.Router();
const reviewDao = require('../models/review-dao');
const filmDao = require('../models/film-dao');
const { check, validationResult } = require('express-validator');

//get della pagina per l'inserimento di una recensione
router.get('/:idFilm', function (req, res, next) {
    filmDao.getFilmById(req.params.idFilm).then((film) => {
        const user = req.user;
        const isLoggedIn = req.isAuthenticated();
        res.render('insert-review', { title: 'Scrivi recensione', message: null, isLoggedIn, film, user });
    });
});

// salvataggio dei dati della recensione sul database
router.post('/:idFilm/insert', [
    check('stars').isInt({ min: 0, max: 5 }).withMessage('La valutazione deve essere compresa tra 0 e 5'),
    check('review').notEmpty().withMessage('Inserire una recensione')
], async function (req, res, next) {
    const errors = validationResult(req);

    //se l'utente non è loggato, stampa errore
    const isLoggedIn = req.isAuthenticated();
    if (!isLoggedIn)
        filmDao.getFilmById(req.params.idFilm).then((film) => {
            res.render('insert-review', { title: 'Scrivi recensione', message: 'Effettuare il login', isLoggedIn, film, user: null });
        });

    else {
        if (!errors.isEmpty()) {
            // campi non validi, errore
            filmDao.getFilmById(req.params.idFilm).then((film) => {
                const messages = errors.array().map(error => error.msg);
                const isLoggedIn = req.isAuthenticated();
                const user = req.user;
                res.render('insert-review', { title: 'Scrivi recensione', message: messages[0], isLoggedIn, film, user });
            });
        } else {
            try {
                //crea una recensione
                const user = req.user;
                const review = {
                    idUtente: user.id,
                    idFilm: parseInt(req.params.idFilm),
                    stelle: parseInt(req.body.stars),
                    testo: req.body.review
                };
                //inserisce la recensione nel database
                await reviewDao.insertReview(review);
                res.redirect('/film-page/' + req.params.idFilm);
            } catch (error) {
                filmDao.getFilmById(req.params.idFilm).then((film) => {
                    const isLoggedIn = req.isAuthenticated();
                    const user = req.user;
                    res.render('insert-review', { title: 'Scrivi recensione', message: 'Errore nel salvataggio della recensione', isLoggedIn, film, user });
                });
            }
        }
    }
});

//elimina la recensione passata come parametro
router.post('/:idRecensione/delete', async function (req, res, next) {
    const isLoggedIn = req.isAuthenticated();
    if (!isLoggedIn)
        filmDao.getFilmById(req.params.idFilm).then((film) => {
            res.render('insert-review', { title: 'Scrivi recensione', message: 'Effettuare il login', isLoggedIn, film, user: null });
        });
    else {
        reviewDao.deleteUserReview(req.params.idRecensione);
        res.redirect('/');
    }
});

//get della pagina di modifica della recensione
router.get('/:idFilm/:idRecensione', function (req, res, next) {
    filmDao.getFilmById(req.params.idFilm).then((film) => {
        reviewDao.getReviewById(req.params.idRecensione).then((recensione) => {
            const isLoggedIn = req.isAuthenticated();
            const user=req.user;
            res.render('insert-review-update', { title: 'Scrivi recensione', message: null, isLoggedIn, film, recensione, user });
        });
    });
});

// salvataggio dei dati della recensione sul database
router.post('/:idFilm/:idRecensione/update', [
    check('stars').isInt({ min: 0, max: 5 }).withMessage('La valutazione deve essere compresa tra 0 e 5'),
    check('review').notEmpty().withMessage('Inserire una recensione')
], async function (req, res, next) {
    const errors = validationResult(req);

    //se l'utente non è loggato, stampa errore
    const isLoggedIn = req.isAuthenticated();
    if (!isLoggedIn)
        filmDao.getFilmById(req.params.idFilm).then((film) => {
            res.render('insert-review', { title: 'Scrivi recensione', message: 'Effettuare il login', isLoggedIn, film, user: null });
        });

    else {
        if (!errors.isEmpty()) {
            // campi non validi, errore
            filmDao.getFilmById(req.params.idFilm).then((film) => {
                reviewDao.getReviewById(req.params.idRecensione).then((recensione) => {
                    const messages = errors.array().map(error => error.msg);
                    const isLoggedIn = req.isAuthenticated();
                    const user = req.user;
                    res.render('insert-review-update', { title: 'Scrivi recensione', message: messages[0], isLoggedIn, film, recensione, user });
                });
            });
        } else {
            try {
                //aggiorna la recensione
                const review = {
                    idRecensione: parseInt(req.params.idRecensione),
                    stelle: parseInt(req.body.stars),
                    testo: req.body.review
                };
                await reviewDao.updateReview(review);
                res.redirect('/film-page/' + req.params.idFilm);
            } catch (error) {
                filmDao.getFilmById(req.params.idFilm).then((film) => {
                    reviewDao.getReviewById(req.params.idRecensione).then((recensione) => {
                        const isLoggedIn = req.isAuthenticated();
                        const user = req.user;
                        res.render('insert-review-update', { title: 'Scrivi recensione', message: 'Errore nel salvataggio della recensione', isLoggedIn, film, recensione, user });
                    });
                });
            }
        }
    }
});

module.exports = router;