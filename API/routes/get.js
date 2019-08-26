const express = require('express');
const router = express.Router();
const db = require('../database');
const verify = require('./verifyToken');

router.get('/', async (req, res) => {
        res.json({"Response": "It works - (get)"});
});


router.get('/listUsers/:n', async (req, res) => {
        const name = req.params.n;
        const sql = `SELECT username FROM Users WHERE public = 1 AND username LIKE '${name}%' `;
        db.query(sql, (err, result) => {
                // if(err) throw err;
                res.json(result);
        });
});


router.get('/userInfo/:id', verify,  async (req, res) => {
        const id = req.params.id;
        const verifyId = req.user._id;
        if(id != verifyId) { return res.status(401).json({ "Repsonse": "Access denied for this information!"});}
        const sql = `SELECT username, sizeLimit, usedSize, totalFile, public FROM Users WHERE _id = '${verifyId}'`;
        db.query(sql, (err, response) => {
          return res.json({"Response": response});
        }, err => {
                return res.json({"Error" : err});
        });
});

router.get('/listUploads/:id', verify, async (req, res) => {
        const id = req.params.id;
        const verifyId = req.user._id;
        if(id != verifyId) { return res.status(401).json({ "Repsonse": "Access denied for this information!"});}

        const sql = `SELECT * FROM Uploads WHERE uploader = '${verifyId}' AND isDeleted = 0`;
        db.query(sql, (err, response) => {
          return res.json({"Response": response});
        }, err => {
                return res.json({"Error" : err});
        });

});

router.get('/userFiles/:username', async (req, res) => {
        const username = req.params.username;

        const sql = `SELECT _id FROM Users WHERE username = '${username}' AND public = 1 `;
        db.query(sql, (err, response) => {
                if(response[0] == undefined) { return res.status(400).json({Response: "This user is not public anymore or does not exists"}) }
                const uniqId = response[0]._id;
                const sql = `SELECT filename, path, size, date FROM Uploads WHERE uploader = '${uniqId}' AND public = 1 AND isDeleted = 0 `;
                db.query(sql, (err, response) => {

                        if(response.length == 0) { return res.status(400).json({Response: "There is no any public file found."}) }
                        return res.json({"Response": response});
                }, err => {
                        return res.status(400).json({"Error": err});
                });

        });

});

router.get('/publicFile/:username/:file', async (req, res) => {

        const username = req.params.username;
        const file = req.params.file;

        const sql = `SELECT _id FROM Users WHERE username = '${username}' `;
        db.query(sql, (err, response) => {
                const uniqId = response[0]._id;

                const sql = `SELECT public FROM Uploads WHERE uploader = '${uniqId}' AND filename = '${file}' AND isDeleted = 0 `;
                db.query(sql, (err, response) => {
                        if(err) { return res.json({Response: err}); }
                        if(response[0] == undefined) { return res.status(400).json({Response: "This does not exists anymore"}); }
                        if(response[0].public == 0) { return res.status(400).json({Response: "This file is not public anymore"}); }
                        res.download(`./uploads/${uniqId}/${file}`);
                });

        });

});

router.get('/userFile/:uniqId/:file', verify, async (req, res) => {
        const uniqId = req.params.uniqId;
        const filename = req.params.file;
        const verifyId = req.user._id;
        if(uniqId != verifyId) { return res.status(401).json({ "Repsonse": "Access denied for this information!"});}
        res.download(`./uploads/${uniqId}/${filename}`);

});



module.exports = router;