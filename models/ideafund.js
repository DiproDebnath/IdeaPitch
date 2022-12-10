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
    static associate({User, Idea}) {
      this.belongsTo(User, {foreignKey: "userId"})
      this.belongsTo(Idea, {foreignKey: "IdeaId"})
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
    isReturn: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'IdeaFund',
  });
  return IdeaFund;
};