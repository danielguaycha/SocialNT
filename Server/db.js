const dotenv = require('dotenv');
dotenv.config();
const Sequelize = require('sequelize');

const db = process.env.DB_DATABASE || 'socialnt';
const driver = process.env.DB_DRIVER || 'postgres';
const password = process.env.DB_PASSWORD || '1234';
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 5432;

let sequelize = new Sequelize(db, driver, password,
    {  host, dialect: 'postgres', logging: false, port  }) ;

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

sequelize
  .authenticate()
  .then(() => {
    console.log(`Connected to ${db} on port ${port}`);
  })
  .catch((err) => {
    console.log(`Error`, err.message);
  });

  

module.exports  = {
    User, Follow, Message, Reaction, Comment, Notification, Publication, Market,
    PasswordReset,
    sequelize
};
