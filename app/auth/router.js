const router = require('express').Router()
const multer = require('multer')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const controller = require('./controller')
const os = require('os');

passport.use(new LocalStrategy({usernameField: 'email'}, controller.localStrategy))

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: String
 *                 description: User full name
 *                 Example: Test 1
 *               username:
 *                 type: String
 *                 description: User username
 *                 Example: test1 (whitespace not allowed)
 *               email:
 *                 type: String
 *                 description: User email
 *                 Example: test1@gmail.com
 *               password:
 *                 type: String
 *                 description: User password
 *                 Example: passwordinisulit
 *               image:
 *                 type: file
 *                 description: User profile picture
 *               about_me:
 *                 type: String
 *                 description: User description
 *                 Example: Test 1 about me.
 *     summary: Create new user
 *     security:
 *       - none: []
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Unknown path
 *       500:
 *         description: Internal server error
 */
router.post('/register', multer({ dest: os.tmpdir() }).single('image'), controller.register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: String
 *                 description: User email
 *                 Example: test1@gmail.com
 *               password:
 *                 type: String
 *                 description: User password
 *                 Example: passwordinisulit
 *     summary: Login to new session
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Unknown path
 *       500:
 *         description: Internal server error
 */
router.post('/login', multer().none(), controller.login)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     security:
 *       - jwt: [] 
 *     summary: Logout from current session
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Unknown path
 *       500:
 *         description: Internal server error
 */
router.post('/logout', controller.logout)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     security:
 *       - jwt: [] 
 *     summary: Show user details
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Unknown path
 *       500:
 *         description: Internal server error
 */
router.get('/me', controller.me)

module.exports = router