const jwt = require("jsonwebtoken");
const { User, sequelize, UserFund, UserToken } = require("../models");
const bcrypt = require("bcryptjs");
const API_SECRET = require("../config/config.json")["apiSecret"];

const authService = {
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
  verifyRefreshToken: async (refreshToken) => {
    try {
      const token = await UserToken.findOne({
        where: { token: refreshToken },
      });

      if (!token) {
        return {
          success: false,
          status: 400,
          message: "Invalid refresh token",
        };
      }

      return jwt.verify(refreshToken, API_SECRET, (err, tokenDetails) => {
        if (err)
          return {
            success: false,
            message: "Invalid refresh token",
          };

          return {
            tokenDetails,
            success: true,
            message: "Valid refresh token",
          };
      });

      
    } catch (err) {
      console.log(err);
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
  generateToken: (id, username, isAdmin, ttl, isRefreshToken = false) => {
    
   const token =  jwt.sign(
      {
        id,
        username,
        isAdmin,
      },
      API_SECRET,
      {
        expiresIn: ttl,
      }
    );
    console.log("isRefreshToken", isRefreshToken);
    if(isRefreshToken){
      UserToken.create({
        token,
        userId: id
      })
    } 
    return token
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

module.exports = authService;
