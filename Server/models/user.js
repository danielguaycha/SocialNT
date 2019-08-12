const Sequelize = require('sequelize');
const PROTECTED_ATTRIBUTES = ['password', 'hash']

module.exports = class User extends Sequelize.Model {
    static init(sequelize, DataTypes){
    return super.init({
            id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            name: Sequelize.STRING,
            lastname: Sequelize.STRING,
            username: Sequelize.STRING,
            email: Sequelize.STRING,
            avatar: Sequelize.STRING,
            profile: Sequelize.STRING,
            status: Sequelize.INTEGER,
            hash: Sequelize.STRING,
            password:  Sequelize.STRING,
            confirmation_code: Sequelize.STRING,
            confirmed: Sequelize.INTEGER,
            created_at: Sequelize.DATE,
            genero: Sequelize.STRING
        },
        {
            sequelize: sequelize,
            modelName: 'users',
            timestamps: false,    
        })    
    }

    static associate(models){
        this.user_followed = this.hasMany(models.Follow,  { foreignKey: 'followed', as: 'person'});
        this.user_followed2 = this.hasMany(models.Follow, { foreignKey: 'user_id', as: 'person2'});
        this.user_publication = this.hasMany(models.Publication, { foreignKey: 'user_id'})
        // messages
        this.user_message = this.hasMany(models.Message,  { foreignKey: 'emitter', as: 'user_emitter'});
        this.user_message2 = this.hasMany(models.Message,  { foreignKey: 'receiver', as: 'user_receiver'});
        // reactions
        this.user_reaction = this.hasMany(models.Reaction,  { foreignKey: 'user_id', as: 'user'});
        // comments
        this.user_comment = this.hasMany(models.Comment,  { foreignKey: 'user_id', as: 'commentor'});
        // notifications
        this.user_notification = this.hasMany(models.Notification,  { foreignKey: 'to', as: 'toUser'});
        this.user_notification = this.hasMany(models.Notification,  { foreignKey: 'from', as: 'fromUser'});
    }

    toJSON () {        
        let attributes = Object.assign({}, this.get())
        for (let a of PROTECTED_ATTRIBUTES) {
            delete attributes[a]
        }
        return attributes
    }
}


  //User.hasMany(sequelize.models.follows, {as: 'followed'}); 
  //User.hasMany(Follows, {foreignKey: 'followed'});
/*
module.exports = sequelize.define("users", {
    id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING,
    lastname: Sequelize.STRING,
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    avatar: Sequelize.STRING,
    profile: Sequelize.STRING,
    status: Sequelize.INTEGER,
    hash: Sequelize.STRING,
    password: {type: Sequelize.STRING, scope: 'self'},
    confirmation_code: Sequelize.STRING,
    confirmed: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
},{ instanceMethods: {
        toJSON: function () {
            let values = Object.assign({}, this.get());

            delete values.password;
            return values;
        }
    },
    privateColumns:['password'],
    timestamps: false,    
})*/