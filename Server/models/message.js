const Sequelize = require('sequelize');
module.exports = class Message extends Sequelize.Model {
    static init(sequelize, DataTypes){
        return super.init({
            id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },    
            emitter: DataTypes.BIGINT,
            receiver: DataTypes.BIGINT,
            text: DataTypes.TEXT,
            status: DataTypes.INTEGER,
            created_at: DataTypes.STRING,  
        },
        {
            sequelize: sequelize,
            modelName: 'message',
            timestamps: false,    
        })
    }

    static associate(models){
        this.message_user = this.belongsTo(models.User, { foreignKey: 'emitter', as: 'user_emitter'})
        this.message_user2 = this.belongsTo(models.User, { foreignKey: 'receiver', as: 'user_receiver'})
    }
}