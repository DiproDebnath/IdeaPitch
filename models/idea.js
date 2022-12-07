"use strict";
const { Model } = require("sequelize");
const SequelizeSlugify = require("sequelize-slugify");


module.exports = (sequelize, DataTypes) => {
  class Idea extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
        allowNull: false,
        type: DataTypes.STRING,
      },
      userId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Idea",
    }
  );

  SequelizeSlugify.slugifyModel(Idea, {
    source: ["title"],
  });

  return Idea;
};
