
const express = require('express');
const api = express.Router();

const commentController = require('./../controllers/comment');
const auth = require('./../middleware/auth');

api.post('/comment', auth, commentController.addComment)
api.get('/comment/last/:type/:id', auth, commentController.getLastComment)
api.get('/comments/:type/:id', auth, commentController.getComments);
api.delete('/comment/:id', auth, commentController.destroyComment)
module.exports = api;
