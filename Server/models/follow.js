const Sequelize = require('sequelize')

module.exports = class Follow extends Sequelize.Model {
  static init(sequelize, DataTypes){
    return super.init({
      id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },    
      user_id: DataTypes.INTEGER,
      followed: DataTypes.INTEGER    
    },
    {
      sequelize: sequelize,
      modelName: 'follows',
      timestamps: false,    
    })
  }

  static associate(models){
    this.follow_user = this.belongsTo(models.User, { foreignKey: 'followed', as: 'person'})
    this.follow_user2 = this.belongsTo(models.User, { foreignKey: 'user_id', as: 'person2'})
  }
}