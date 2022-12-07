'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IdeaFund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  IdeaFund.init({
    amount: {
      allowNull: false,
      type: DataTypes.STRING
    },
    ideaId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    note: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'IdeaFund',
  });
  return IdeaFund;
};