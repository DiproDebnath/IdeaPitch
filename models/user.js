'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Clap, Idea, IdeaFund}) {
      this.hasMany(Clap, {foreignKey: "userId"} );
      this.hasMany(Idea, { as: "userIdea", foreignKey: "userId"} );
      this.belongsToMany(Idea, { as: "DonatedIdea", foreignKey: "userId", otherKey: "ideaId", through: IdeaFund})
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    isAdmin: {    
      defaultValue: 0,
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};