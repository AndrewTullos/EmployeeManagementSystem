// Inside connection.js
const mysql = require('mysql2');
const express = require('express')


const connection = mysql.createConnection({
    host     : '127.0.0.1', // or the appropriate hostname
    user     : 'root',
    password : 'guitar',
    database : 'company_db',
    port     : 3306 // Default MySQL port. Change if different.
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});


module.exports = connection;