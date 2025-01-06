const express = require('express');
const { testPost } = require('../controllers/testController');
const { userAuth } = require('../middlewares/authmiddleware');

const troute = express.Router();

troute.post('/test-post', userAuth, testPost);


module.exports = {
    troute
}