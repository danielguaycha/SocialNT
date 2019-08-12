const express = require('express')
const api = express.Router();

const auth = require('./../middleware/auth');
const reactionController = require('./../controllers/reaction');

api.post('/reaction', auth, reactionController.addReaction);
api.get('/reactions/users/:type/:id', auth, reactionController.getUsersReactions)
api.get('/reactions/:type/:id', auth, reactionController.getPublicationReactions);
module.exports = api;