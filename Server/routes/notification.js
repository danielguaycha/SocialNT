
const express = require('express');
const api = express.Router();

const notifyController = require('./../controllers/notification');
const auth = require('./../middleware/auth');

api.get('/notifies', auth, notifyController.getNotifications)
api.get('/notify/view/:id', auth, notifyController.changeToView)
api.post('/notify/market', auth, notifyController.notifyMarket)
api.delete('/notify/:id', auth, notifyController.deleteNotification)

module.exports = api;
