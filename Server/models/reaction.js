const Sequelize = require('sequelize');
module.exports = class Reaction extends Sequelize.Model {

    static init(sequelize ){
        return super.init({
            id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },    
            user_id: Sequelize.BIGINT,
            type: Sequelize.STRING,
            pub_id: Sequelize.BIGINT,
            market_id: Sequelize.BIGINT
        },
        {
            sequelize: sequelize,
            modelName: 'reaction',
            timestamps: false,    
        })
    }

    static associate(models){
        this.reaction_user = this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'})
        //this.message_user2 = this.belongsTo(models.User, { foreignKey: 'receiver', as: 'user_receiver'})
    }

}