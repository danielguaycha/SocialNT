const Sequelize = require('sequelize');

module.exports = class Publication extends Sequelize.Model {
  static init(sequelize, DataTypes){
    return super.init({
      id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      text: DataTypes.TEXT,
      image: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING
    }, {
      sequelize: sequelize,
      modelName: 'publications',
      timestamps: false      
    })
  }

  static associate(models){
    this.publication_user = this.belongsTo(models.User, { foreignKey: 'user_id' })
  }
}