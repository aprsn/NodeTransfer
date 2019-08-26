const express = require('express');
const router = express.Router();
var mysql = require('mysql');
require('dotenv/config');

var conn = mysql.createConnection({
    host: "192.168.1.3",
    user: process.env.DB_Username,
    password: process.env.DB_Password,
    database: process.env.DB_Database
  });
  
  conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!");
  });

  module.exports = conn;