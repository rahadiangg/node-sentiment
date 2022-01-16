'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sentiments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  sentiments.init({
    batch_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    tokens: DataTypes.JSON,
    positive_text: DataTypes.JSON,
    negative_text: DataTypes.JSON,
    score: DataTypes.INTEGER,
    comparative: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'sentiments',
  });
  return sentiments;
};