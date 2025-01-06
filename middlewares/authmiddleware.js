const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

function userAuth(req, resp, next) {
    const authheader = req.headers.authorization
    if (!authheader || !authheader.startsWith('Bearer')) {
        next('Auth Failed');
    }

    const token = authheader.split(' ')[1];
    if (!token) {
        return next('Auth Failed: Token Not Provided');
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.user = { userId: payload._id }
        return next();
    } catch (error) {
        next('Auth Failed Invalid Token');
    }
}


module.exports = {
    userAuth
}



