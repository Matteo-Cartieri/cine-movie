'use strict';

let express = require('express');
let router = express.Router();
const filmDao = require('../models/film-dao');
const reviewDao = require('../models/review-dao');

//get della pagina di prenotazione dei biglietti
router.get('/:idFilm', function (req, res, next) {
    filmDao.getFilmById(req.params.idFilm).then((film) => {
        filmDao.getAllFilmTickets(req.params.idFilm).then((tickets) => {
            const user = req.user;
            const isLoggedIn = req.isAuthenticated();
            res.render('seat-booking', { title: 'Prenota' + ' ' + film.titolo, film, tickets, message: null, isLoggedIn, user });
        });
    });
});

// salvataggio dei biglietti sul database
router.post('/:idFilm/:ticket/:oneSeat', async function (req, res, next) {
    const oneSeat = req.params.oneSeat;
    //se il posto selezionato non è uno solo, errore
    if (oneSeat == 0) {
        res.status(400).json({ message: 'Selezionare solo 1 posto' });
    }
    else {
        //se l'utente non è loggato, errore
        const isLoggedIn = req.isAuthenticated();
        if (!isLoggedIn) {
            res.status(400).json({ message: 'Effettuare il login' });
        }
        else {
            try {
                //crea il biglietto
                const user = req.user;
                const ticket = {
                    idUtente: user.id,
                    idFilm: req.params.idFilm,
                    posto: req.params.ticket
                }
                //inserisce il biglietto nel database
                await filmDao.insertTicket(ticket);
                res.redirect('/user');
            } catch (error) {
                res.status(400).json({ message: 'Errore nell\'acquisto del biglietto' });
            }
        }
    }
});

//elimina il biglietto
router.post('/:idBiglietto/delete', async function (req, res, next) {
    filmDao.deleteUserTicket(req.params.idBiglietto);
    res.redirect('/');
});

module.exports = router;