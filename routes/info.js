'use strict';

let express = require('express');
let router = express.Router();

//get della pagina di info
router.get('/', function(req, res, next) {
    const isLoggedIn = req.isAuthenticated();
    const user=req.user;
    res.render('info', {title: 'Info', isLoggedIn, user});
});

module.exports = router;