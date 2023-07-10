"use strict"

const db = require('../db.js');

// inserisce una recensione
exports.insertReview = function (review) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Recensione(idUtente, idFilm, Testo, Stelle)  VALUES (?,?,?,?)';
        db.run(sql, [
            review.idUtente,
            review.idFilm,
            review.testo,
            review.stelle
        ], function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}

//aggiorna la recensione specificata
exports.updateReview = function (review) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Recensione SET Testo=?, Stelle=?  WHERE idRecensione=?';
        db.run(sql, [
            review.testo,
            review.stelle,
            review.idRecensione
        ], function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}

//ritorna una lista contenente tutte le recensioni riferite al film specificato
exports.getAllFilmReviews = function (idFilm) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Utente.Nome AS Nome, Utente.Cognome AS Cognome, Testo, Stelle FROM Recensione JOIN Utente ON Recensione.idUtente=Utente.idUtente WHERE idFilm=?';
        db.all(sql, [idFilm], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const reviews = rows.map((e) => ({
                nome: e.Nome,
                cognome: e.Cognome,
                testo: e.Testo,
                stelle: e.Stelle
            }));
            resolve(reviews);
        });
    });
};

//ritorna una lista contenente tutte le recensioni create dall'utente specificato
exports.getAllUserReviews = function (idUser) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT idRecensione, idFilm, Utente.Nome AS Nome, Utente.Cognome AS Cognome, Testo, Stelle FROM Recensione JOIN Utente ON Recensione.idUtente=Utente.idUtente WHERE Recensione.idUtente=?';
        db.all(sql, [idUser], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const reviews = rows.map((e) => ({
                idRecensione: e.idRecensione,
                idFilm: e.idFilm,
                nome: e.Nome,
                cognome: e.Cognome,
                testo: e.Testo,
                stelle: e.Stelle
            }));
            resolve(reviews);
        });
    });
};

//ritorna una lista contenente tutte le recensioni 
exports.getAllReviews = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT idRecensione, idFilm, Utente.Nome AS Nome, Utente.Cognome AS Cognome, Testo, Stelle FROM Recensione JOIN Utente ON Recensione.idUtente=Utente.idUtente';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const reviews = rows.map((e) => ({
                idRecensione: e.idRecensione,
                idFilm: e.idFilm,
                nome: e.Nome,
                cognome: e.Cognome,
                testo: e.Testo,
                stelle: e.Stelle
            }));
            resolve(reviews);
        });
    });
};

//ritorna la recensione con l'id specificato
exports.getReviewById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Recensione WHERE idRecensione=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            else if (row === undefined)
                resolve({ error: 'Review not found' });
            else {
                const review =
                {
                    idRecensione: row.idRecensione,
                    idFilm: row.idFilm,
                    nome: row.Nome,
                    cognome: row.Cognome,
                    testo: row.Testo,
                    stelle: row.Stelle
                };
                resolve(review);
            }
        });
    });
};

//rimuove la recensione specificata
exports.deleteUserReview = function (idRecensione) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Recensione WHERE idRecensione=?';
        db.run(sql, [idRecensione], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};