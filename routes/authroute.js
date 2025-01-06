const express = require('express');
const { userregister, login } = require('../controllers/userController');
const authroute = express.Router();

const ratelimit = require('express-rate-limit');

const limiter = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window (15 minutes)
    standardHeaders: 'draft-8', // Use the draft-8 RateLimit header
    legacyHeaders: false, // Disable the legacy X-RateLimit headers
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - lastname
 *         - email
 *         - password
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           example: 123daafdjdbye1
 *         name:
 *           type: string
 *           description: User name
 *         lastname:
 *           type: string
 *           description: User last name
 *         email:
 *           type: string
 *           description: User email address
 *         password:
 *           type: string
 *           description: User password
 *         location:
 *           type: string
 *           description: User location
 *       example:
 *         id: jds12343
 *         name: awais
 *         lastname: rana
 *         email: a@gmil.com
 *         password: 123sda
 *         location: sargodha
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication APIs
 */

/**
 * @swagger
 * /job/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 *  components:
 *   schemas:
 *     User:
 *      type: object
 *      required:
 *       - email
 *       - password
 *      properties:
 *        id:
 *          type: string
 *          description: auto incremented id
 *        email:
 *          type: string
 *          description: user email address
 *        password:
 *          type: string
 *          description: user password 
 *        
 */

/**
 * @swagger
 *  tags:
 *    Auth:
 *    description: authentication apis
 *   
 */
/**
 * @swagger
 *  /job/login:
 *    post:
 *      summary: user login
 *      tags:
 *       - Auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: login successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: internal server error
 */

// Register route
authroute.post('/register', limiter, userregister);

// Login route
authroute.post('/login', limiter, login);

module.exports = {
    authroute,
};
