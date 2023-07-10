"use strict"

const db = require('../db.js');

//inserisce un film
exports.insertFilm = function (film) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Film(Titolo,Regia,Anno,CastFilm,Durata,Genere,Trama,Data,Ora) VALUES (?,?,?,?,?,?,?,?,?)';
        db.run(sql, [
            film.titolo,
            film.regia,
            film.anno,
            film.castfilm,
            film.durata,
            film.genere,
            film.trama,
            film.data,
            film.ora
        ], function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}

//ritorna una lista contenente tutti i film
exports.getAllFilms = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Film';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const films = rows.map((e) => (
                {
                    idFilm: e.idFilm,
                    titolo: e.Titolo,
                    regia: e.Regia,
                    anno: e.Anno,
                    cast: e.CastFilm,
                    durata: e.Durata,
                    genere: e.Genere,
                    trama: e.Trama,
                    data: e.Data,
                    ora: e.Ora
                }));
            resolve(films);
        });
    });
};

//ritorna una lista contenente i film che rispettano i parametri di ricerca
exports.getSearchedFilms = function (search) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Film where Titolo like ? or Regia like ? or CastFilm like ? or Genere like ? or Data like ? or Ora like ? or Anno like ? or Durata like ?';
        const params = Array(8).fill(search);
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const films = rows.map((e) => (
                {
                    idFilm: e.idFilm,
                    titolo: e.Titolo,
                    regia: e.Regia,
                    anno: e.Anno,
                    cast: e.CastFilm,
                    durata: e.Durata,
                    genere: e.Genere,
                    trama: e.Trama,
                    data: e.Data,
                    ora: e.Ora
                }));
            resolve(films);
        });
    });
};

//ritorna il film identificato dall'id passato come parametro
exports.getFilmById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM film WHERE idFilm=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            else if (row === undefined)
                resolve({ error: 'Film not found' });
            else {
                const film =
                {
                    idFilm: row.idFilm,
                    titolo: row.Titolo,
                    regia: row.Regia,
                    anno: row.Anno,
                    cast: row.CastFilm,
                    durata: row.Durata,
                    genere: row.Genere,
                    trama: row.Trama,
                    data: row.Data,
                    ora: row.Ora
                };
                resolve(film);
            }
        });
    });
};

//ritorna una lista contenente tutti i generi dei film
exports.getAllGenres = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT DISTINCT genere FROM film';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const genres = rows.map((e) => ({ genere: e.Genere }));
            resolve(genres);
        });
    });
};

//ritorna una lista contenente tutte le date dei film
exports.getAllDates = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT DISTINCT data FROM film';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const dates = rows.map((e) => ({ data: e.Data }));
            resolve(dates);
        });
    });
};

//ritorna una lista contenente tutte le ore dei film
exports.getAllHours = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT DISTINCT ora FROM film';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const hours = rows.map((e) => ({ ora: e.Ora }));
            resolve(hours);
        });
    });
};

// ritorna una lista contenente tutti i biglietti dell'utente specificato
exports.getAllUserTickets = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT idFilm,Posto FROM Biglietto WHERE idUtente=?';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                const tickets = rows.map((e) => (
                    {
                        idFilm: e.idFilm,
                        posto: e.Posto
                    }));
                resolve(tickets);
            }
        });
    });
};

// ritorna una lista contenente tutti i biglietti dell'utente specificato con le informazioni del film ad esso riferito
exports.getAllUserTicketsInfo = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Film.idFilm AS idFilm,Posto,Titolo,Data,Ora FROM Biglietto JOIN Film ON Biglietto.idFilm=Film.idFilm WHERE idUtente=?';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            else {
                const ticketInfo = rows.map((e) => ({
                    idFilm: e.idFilm,
                    posto: e.Posto,
                    titolo: e.Titolo,
                    data: e.Data,
                    ora: e.Ora
                }));
                resolve(ticketInfo);
            }
        });
    });
};

// ritorna una lista contenente tutti i biglietti con le informazioni del film ad essi riferiti
exports.getAllTicketsInfo = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT idBiglietto, Film.idFilm AS idFilm,Posto,Titolo,Film.Data AS Data,Ora,Nome,Cognome FROM Biglietto JOIN Film ON Biglietto.idFilm=Film.idFilm JOIN Utente ON Biglietto.idUtente=Utente.idUtente';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                const ticketInfo = rows.map((e) => ({
                    idBiglietto: e.idBiglietto,
                    idFilm: e.idFilm,
                    posto: e.Posto,
                    titolo: e.Titolo,
                    data: e.Data,
                    ora: e.Ora,
                    nome: e.Nome,
                    cognome: e.Cognome
                }));
                resolve(ticketInfo);
            }
        });
    });
};

// ritorna una lista contenente tutti i biglietti 
exports.getAllFilmTickets = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Posto FROM Biglietto WHERE idFilm=?';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                const tickets = rows.map((e) => ({ posto: e.Posto }));
                resolve(tickets);
            }
        });
    });
};

//inserisce un biglietto
exports.insertTicket = function (ticket) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Biglietto(idUtente, idFilm, Posto) VALUES (?,?,?)';
        db.run(sql, [
            ticket.idUtente,
            ticket.idFilm,
            ticket.posto
        ], function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}

//rimuove il biglietto specificato
exports.deleteUserTicket = function (idBiglietto) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Biglietto WHERE idBiglietto=?';
        db.run(sql, [idBiglietto], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

//rimuove il film specificato
exports.deleteFilm = function (idFilm) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Film WHERE idFilm=?';
        db.run(sql, [idFilm], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};