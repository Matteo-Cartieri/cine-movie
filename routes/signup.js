'use strict';

let express = require('express');
const bodyParser = require('body-parser');
const userDao = require('../models/user-dao.js');
const { check, validationResult } = require('express-validator');
let router = express.Router();

//get della pagina di registrazione 
router.get('/', function (req, res, next) {
  const isLoggedIn = req.isAuthenticated();
  const user=req.user;
  res.render('signup', { title: 'Registrati', message: null, isLoggedIn, user });
});


// salvataggio delle informazioni di un nuovo utente sul database
router.post('/', [
  check('name').notEmpty().withMessage('Inserire il nome'),
  check('surname').notEmpty().withMessage('Inserire il cognome'),
  check('email').isEmail().withMessage('Inserire indirizzo email valido'),
  check('password').isLength({ min: 8 }).withMessage('La password deve contenere almeno 8 caratteri'),
  check('checkbox').custom((value, { req }) => {
    if (!req.body.checkbox) {
      throw new Error('Accettare le condizioni di utilizzo');
    }
    return true;
  })
], async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Campi non validi
    const messages = errors.array().map(error => error.msg);
    const isLoggedIn = req.isAuthenticated();
    const user=req.user;
    res.render('signup', { title: 'Registrati', message: messages[0], isLoggedIn, user });
  } else {
    try {
      // Campi validi, creo nuovo utente
      const user = {
        nome: req.body.name,
        cognome: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        admin: 0
      };
      await userDao.insertUser(user);
      res.redirect('/');
    } catch (error) {
      const isLoggedIn = req.isAuthenticated();
      const user=req.user;
      res.render('signup', { title: 'Registrati', message: 'Email già utilizzata', isLoggedIn, user });
    }
  }
});

module.exports = router;