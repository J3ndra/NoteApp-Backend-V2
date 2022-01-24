const router = require('express').Router();
const multer = require('multer');
const os = require('os');

const noteController = require('./controller');

/**
 * @swagger
 * /api/notes:
 *   get:
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: q
 *         description: Search note using note title.
 *         schema:
 *           type: query
 *     summary: Retreive list notes
 *     responses:
 *       200:
 *         description: Success return if get list note
 *       404:
 *         description: Unknown path
 *       500:
 *         description: Internal server error
 */
router.get('/notes', noteController.index);

/**
 * @swagger
 * /api/note/{id}:
 *   get:
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note Id.
 *         schema:
 *           type: string
 *     summary: Retreive list notes
 *     responses:
 *       200:
 *         description: Success return if get list note
 *       404:
 *         description: Unknown path
 *       500:
 *         description: Internal server error
 */
router.get('/note/:id', noteController.note);

/**
 * @swagger
 * /api/note:
 *   post:
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: String
 *                 description: Note title
 *                 Example: Mabar DoTA 2
 *               description:
 *                 type: String
 *                 description: Note description
 *                 Example: Mabar DoTA 2 bareng temen temen kantor yang berendingkan loss streak.
 *               image:
 *                 type: file
 *                 description: Note image
 *               color:
 *                 type: String
 *                 description: Note color
 *               latitude:
 *                 type: Number
 *                 description: Maps testing
 *               longitude:
 *                 type: Number
 *                 description: Maps testing
 *     summary: Create new note
 *     responses:
 *       200:
 *         description: Note created!
 *       404:
 *         description: Unknown path
 *       500:
 *         description: Internal server error
 */

router.post('/note', multer({ dest: os.tmpdir() }).single('image'), noteController.store);

/**
 * @swagger
 * /api/note/{id}:
 *   put:
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: text
 *                 description: Note title
 *                 Example: Mabar DoTA 2
 *               description:
 *                 type: text
 *                 description: Note description
 *                 Example: Mabar DoTA 2 bareng temen temen kantor yang berendingkan loss streak.
 *               image:
 *                 type: file
 *                 description: Note image
 *               color:
 *                 type: String
 *                 description: Note color
 *               latitude:
 *                 type: Number
 *                 description: Maps testing
 *               longitude:
 *                 type: Number
 *                 description: Maps testing
 *     summary: Update a note
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note Id.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note updated!
 *       404:
 *         description: Unknown path
 *       500:
 *         description: Internal server error
 */
router.put('/note/:id', multer({ dest: os.tmpdir() }).single('image'), noteController.update);

/**
 * @swagger
 * /api/note/{id}:
 *   delete:
 *     tags: [Notes]
 *     summary: Delete a note
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note Id.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted!
 *       404:
 *         description: Unknown path
 *       500:
 *         description: Internal server error
 */
router.delete('/note/:id', noteController.destroy);

module.exports = router;