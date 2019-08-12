const Sequelize = require('sequelize');
module.exports = class Notification extends Sequelize.Model {

    static init(sequelize ){
        return super.init({
            id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },    
            type: Sequelize.STRING,
            description: Sequelize.STRING,
            to: Sequelize.BIGINT,
            from: Sequelize.BIGINT,
            url: Sequelize.STRING,
            resource_id: Sequelize.BIGINT,
            resource: Sequelize.STRING,
            created_at: Sequelize.STRING,
            status: Sequelize.INTEGER,
        },
        {
            sequelize: sequelize,
            modelName: 'notification',
            timestamps: false,    
        })
    }

    static associate(models){
        this.notification_user = this.belongsTo(models.User, { foreignKey: 'to', as: 'toUser'})
        this.notification_user2 = this.belongsTo(models.User, { foreignKey: 'from', as: 'fromUser'})
        //this.message_user2 = this.belongsTo(models.User, { foreignKey: 'receiver', as: 'user_receiver'})
    }

}