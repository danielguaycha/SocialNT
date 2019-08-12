const express = require('express')
const api = express.Router();

const auth = require('./../middleware/auth');
const publicationController = require('./../controllers/publications');

api.post('/publication', auth, publicationController.savePublication);
api.get('/publication', auth, publicationController.list);
api.get('/publication/:id', auth, publicationController.viewPublication);
api.delete('/publication/:id', auth, publicationController.removePublication)
api.get('/publication/image/:imageFile', publicationController.getImage)
api.get('/publication/user/:id', auth, publicationController.getPublicationsForUser);

module.exports = api;