const jwt = require('jsonwebtoken');


module.exports = function(req, res, next) {
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({"Response" : "Access Denied!"});

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
}