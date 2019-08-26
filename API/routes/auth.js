const router = require('express').Router();
const db = require('../database');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var mkdirp = require('mkdirp');
const fileDestination = process.env.FILE_DESTINATION;
// GENERATE UNIQUE ID
function generateID() {
    var length = 15,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

// REGISTER
router.post('/register', async (req, res) => {    
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const sizeLimit = 50;
    const path = req.body.username.trim().toLowerCase();
    const _id = generateID();
    
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).json({"Response": error.details[0].message});


    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userExistSql = `SELECT COUNT(*) FROM Users WHERE username = '${username}' `;
    db.query(userExistSql, (err, response) => {
        if(response[0]['COUNT(*)'] >= 1) {
            return res.status(400).json({"Response": "This username is already taken!"});
        } else {
            const sql = `INSERT INTO Users(_id, username, email, password, sizeLimit, userPath) 
            VALUES('${_id}' , '${username}', '${email}', '${hashPassword}', ${sizeLimit}, '${path}')`;
            db.query(sql, (err, response) => {
                mkdirp(fileDestination + `/${_id}`, function(err) { console.log(err); });
                return res.json(response);
            });
        }
    }); 

});


// LOGIN
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).json({"Response": error.details[0].message});

    const username = req.body.username;
    const password = req.body.password;
    const checkUserSql = `SELECT username, password, _id, id FROM Users WHERE username = '${username}'`; 
    db.query(checkUserSql, async (err, response) => {
        if(response[0] == null) {
            return res.status(400).json({"Response": "User did not found!"});
        } else {
            const validPass = await bcrypt.compare(password, response[0].password);
            if(!validPass) return res.status(400).json({"Response": "Invalid password!"});

            // Create Token
            const token = jwt.sign({ _id: response[0]._id, unique_name: response[0].username}, process.env.TOKEN_SECRET );
            res.header('Authorization', token).json({"Token": token });

        }
        
    });
});



module.exports = router;