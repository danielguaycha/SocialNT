const express = require('express')
const api = express.Router();

const auth = require('./../middleware/auth');
const followController = require('./../controllers/follow');

api.post('/follow', auth, followController.follow);
api.post('/unfollow', auth, followController.unfollow);
api.get('/followed/:user?', auth, followController.followedUsers);
api.get('/follower/:user?', auth, followController.followerUsers);
api.get('/follow/stats/:user?', auth, followController.getStats)
module.exports = api;