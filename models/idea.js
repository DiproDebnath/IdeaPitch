"use strict";
const { Model } = require("sequelize");



module.exports = (sequelize, DataTypes) => {
  class Idea extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Clap, User}) {
      this.hasMany(Clap, {foreignKey: "ideaId"} );
      this.belongsTo(User, {foreignKey: "userId"})
    }
  }

  Idea.init(
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      slug: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      thumbnail: {
        allowNull: false,
        type: DataTypes.STRING
      },
      budget: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      totalFund: {
       
        type: DataTypes.STRING,
      },
      userId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      isApproved: {
        type: DataTypes.ENUM(["approved", "pending", "rejected"]),
        defaultValue: "pending"
      },
      note: {
        type: DataTypes.STRING
      },
    },
    {
      sequelize,
      modelName: "Idea",
    }
  );

  

  return Idea;
};
