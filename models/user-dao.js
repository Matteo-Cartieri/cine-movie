"use strict";

const db = require('../db.js');
const bcrypt = require('bcrypt');

//ritorna un utente dato il suo id
exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utente WHERE idUtente = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = {
                    id: row.idUtente,
                    nome: row.Nome,
                    cognome: row.Cognome,
                    email: row.Email,
                    admin: row.Admin
                }
                resolve(user);
            }
        });
    });
};

//ritorna un utente date email e password
exports.getUser = function (email, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utente WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = {
                    id: row.idUtente,
                    nome: row.Nome,
                    cognome: row.Cognome,
                    email: row.Email,
                    admin: row.Admin
                }
                let check = false;

                if (user.admin === 0) { //se è un utente, la password è criptata
                    if (bcrypt.compareSync(password, row.Psw))
                        check = true;
                }
                else //se è un admin, non è criptata
                    check = true;
                resolve({ user, check });
            }
        });
    });
};

// inserisce un nuovo utente
exports.insertUser = function (user) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Utente(nome, cognome, email, psw, admin) VALUES (?,?,?,?,?)';
        user.password = bcrypt.hashSync(user.password, 10);
        db.run(sql, [
            user.nome,
            user.cognome,
            user.email,
            user.password,
            user.admin
        ], function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}