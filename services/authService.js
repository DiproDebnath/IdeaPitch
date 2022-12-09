const jwt = require("jsonwebtoken");
const { User, sequelize, UserFund } = require("../models");
const bcrypt = require("bcryptjs");
const API_SECRET = require("../config/config.json")["apiSecret"];
module.exports = {
  signIn: async (userData) => {
    try {
      const user = await User.findOne({
        where: { username: userData.username },
      });

      if (!user) {
        return {
          success: false,
          status: 401,
          message: "username or password is not valid",
        };
      }

      const { id, username, password, isAdmin } = user;
      const passwordIsValid = bcrypt.compareSync(userData.password, password);

      if (!passwordIsValid) {
        return {
          success: false,
          status: 401,
          message: "username or password is not valid",
        };
      }

      return {
        success: true,
        data: {
          id,
          username,
          isAdmin,
        },
      };
    } catch (err) {
    
      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
    }
  },

  signUp: async (userData) => {
    const t = await sequelize.transaction();
    try {
      const user = await User.create(
        {
          username: userData.username,
          password: bcrypt.hashSync(userData.password, 8),
        },
        { transaction: t }
      );

      const { id, username, isAdmin } = user;

      await UserFund.create(
        { amount: 1000000, userId: id },
        { transaction: t }
      );

      await t.commit();

      return {
        success: true,
        data: {
          id,
          username,
          isAdmin,
        },
      };
    } catch (err) {
      await t.rollback();

      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
    }
  },
  generateToken: (id, username, isAdmin) => {
    return jwt.sign(
      {
        id,
        username,
        isAdmin,
      },
      API_SECRET,
      {
        expiresIn: "24h",
      }
    );
  },

  checkUserExist: async (userData) => {
    try {
      const user = await User.findOne({
        where: { username: userData.username },
      });

      if (!user) {
        return {
          success: true,
          message: null,
        };
      }

      return {
        success: false,
        status: 422,
        message: "User already Exists",
      };
    } catch (err) {
      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
    }
  },
};
