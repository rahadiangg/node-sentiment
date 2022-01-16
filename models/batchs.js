'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class batchs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // batchs.hasMany(models.sentiments, {
      //   onDelete: "cascade",
      //   foreignKey: "batch_id"
      // });
    }
  };
  batchs.init({
    name: DataTypes.TEXT,
    status: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'batchs',
  });
  return batchs;
};