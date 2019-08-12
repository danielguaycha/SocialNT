const express = require('express')
const api = express.Router();

const auth = require('./../middleware/auth');
const messageController = require('../controllers/message');


api.post('/message', auth, messageController.addMessage);
api.get('/message/list/:emitter', auth, messageController.getMessages);
api.get('/messages', auth, messageController.getEmitters);

module.exports =  api;