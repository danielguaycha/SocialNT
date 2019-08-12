const express = require('express')
const api = express.Router();
const userController =require('./../controllers/user');
const auth = require('./../middleware/auth');

api.post('/user', userController.saveUser);
api.get('/user/:id', auth ,userController.findUser);
api.put('/user', auth ,userController.updateUser);
api.post('/user/avatar', auth, userController.uploadAvatar);
api.get('/users/:data', auth, userController.findAll);
api.get('/avatar/:imageFile', userController.getImage);
api.put('/user/password',auth, userController.changePassword);
api.get('/user/confirm/:user/:token', userController.confirmMail);
// chat
api.get('/user/online/:username', auth, userController.getUserForOnline);
api.post('/users/online', auth, userController.getAllUsersForOnline);
//login
api.post('/login', userController.login);

module.exports = api;
