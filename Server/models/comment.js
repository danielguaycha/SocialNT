const Sequelize = require('sequelize');

module.exports = class comment extends Sequelize.Model {
    static init(sequelize){
      return super.init({
        id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },    
        user_id: Sequelize.INTEGER,
        text: Sequelize.TEXT,
        publication_id: Sequelize.BIGINT,
        market_id: Sequelize.BIGINT,
        parent: Sequelize.INTEGER,
        extrainfo: Sequelize.STRING,
        created_at: Sequelize.STRING,
        updated_at: Sequelize.STRING
      },
      {
        sequelize: sequelize,
        modelName: 'comment',
        timestamps: false,    
      })
    }
  
    static associate(models){
      this.user_commet = this.belongsTo(models.User, { foreignKey: 'user_id', as: 'commentor'})
    }
  }