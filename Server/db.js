const Sequelize = require('sequelize');
let sequelize = new Sequelize('socialnt', 'postgres' , '12345', 
    {  host: 'localhost', dialect: 'postgres', logging: false  }) 

// Install models
global.Op = Sequelize.Op;

const Follow = require('./models/follow')
const User = require('./models/user')
const Publication = require('./models/publication')
const Message = require('./models/message');
const Reaction = require('./models/reaction');
const Comment = require('./models/comment');
const Market = require('./models/market');
const Notification = require('./models/notification');
const PasswordReset = require('./models/password_reset');

const models = {
    User: User.init(sequelize, Sequelize.DataTypes),
    Follow: Follow.init(sequelize, Sequelize.DataTypes),
    Publication: Publication.init(sequelize, Sequelize.DataTypes),
    Message: Message.init(sequelize, Sequelize.DataTypes),
    Reaction: Reaction.init(sequelize),
    Comment: Comment.init(sequelize),
    Notification: Notification.init(sequelize),
    Market: Market.init(sequelize),
    PasswordReset: PasswordReset.init(sequelize),
}

PasswordReset.removeAttribute('id');

Object.values(models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));

//sequelize.authenticate().then( () => {
    //console.log(`Good`);
//}).catch(err => {
    //console.log(`Error`);
//})


  

module.exports  = {
    User, Follow, Message, Reaction, Comment, Notification, Publication, Market,
    PasswordReset,
    sequelize
};