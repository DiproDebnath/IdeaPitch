'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Idea, User}) {
      this.belongsTo(Idea, {foreignKey: "ideaId"} );
      this.belongsTo(User, {foreignKey: "userId"} );
    }
  }
  Clap.init({
    claps: {
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
  }, {
    sequelize,
    modelName: 'Clap',
  });
  return Clap;
};