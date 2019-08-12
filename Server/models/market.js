const Sequelize = require('sequelize');
module.exports = class Market extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },    
            title: Sequelize.STRING,
            price: Sequelize.DOUBLE,
            description: Sequelize.STRING,
            image: Sequelize.STRING,        
            dir: Sequelize.STRING,        
            user_id: Sequelize.BIGINT,        
            category_id: Sequelize.BIGINT,        
            created_at: Sequelize.STRING,  
            updated_at: Sequelize.STRING,  
        },
        {
            sequelize: sequelize,
            modelName: 'market',
            timestamps: false,    
        })
    }

    static associate(models){

    }
}