const {
  HTTP_CODE_422_CODE,
  HTTP_CODE_400_MESSAGE,
  HTTP_CODE_400_CODE,
  HTTP_CODE_500_MESSAGE,
  HTTP_CODE_422_MESSAGE,
  HTTP_CODE_500_CODE,
  USER_ALREADY_EXISTS,
  USERNAME_OR_PASSWORD_INVALID,
  TOKEN_GENERATION_FAILD,
  HTTP_CODE_401_CODE,
  SESSION_EXPIRED,
} = require("../utils/constants");
const {
  createUser,
  isUserExists,
  getUserByUsername,
  validatePassword,
  generateAccessAndRefreshToken,
  saveRefreshToken,
  getUserById,
} = require("./auth.service");
const throwError = require("../utils/errorHandler");
const applyMiddleware = require("../middleware/applyMIddleware");
const { authValidator } = require("../auth/auth.validator");

const { generateToken, validateToken } = require("../utils/jwt");
const requestValidator = require("../utils/resquestValidator");

const authResolvers = {
  Mutation: {
    signIn: applyMiddleware([requestValidator(authValidator), signIn]),
    signUp: applyMiddleware([requestValidator(authValidator), signUp]),
    refreshToken,
  },
};

async function signUp(_, args, ctx) {
  try {
    const userRequestData = ({ username, password } = args.userAuthInput);

    const isUserExistsRes = await isUserExists({ username });
    if (isUserExistsRes) {
      return throwError(HTTP_CODE_422_CODE, USER_ALREADY_EXISTS);
    }

    const createUserRes = await createUser(userRequestData);

    const { token, refreshToken } = await generateAccessAndRefreshToken({
      id: createUserRes.id,
      username: createUserRes.username,
      role: createUserRes.role,
    });

    if (!token || !refreshToken) {
      return throwError(HTTP_CODE_400_CODE, TOKEN_GENERATION_FAILD);
    }
    const getRTDeviceId = await saveRefreshToken(createUserRes, refreshToken);

    ctx.setCookie("rt", refreshToken);
    ctx.setCookie("deviceId", getRTDeviceId);

    return {
      ...createUserRes.toJSON(),
      accessToken: token,
    };
  } catch (err) {
    console.log(err);
    return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
  }
}
async function signIn(_, args, ctx) {
  const { username, password } = args.userAuthInput;
  try {
    const getUserRes = await getUserByUsername(username);
    if (!getUserRes) {
      return throwError(HTTP_CODE_400_CODE, HTTP_CODE_400_MESSAGE);
    }

    const isValidPassword = await getUserRes.comparePassword(password);

    if (!isValidPassword) {
      return throwError(HTTP_CODE_400_CODE, USERNAME_OR_PASSWORD_INVALID);
    }

    const { token, refreshToken } = await generateAccessAndRefreshToken({
      id: getUserRes.id,
      username: getUserRes.username,
      role: getUserRes.role,
    });
    if (!token || !refreshToken) {
      return throwError(HTTP_CODE_400_CODE, TOKEN_GENERATION_FAILD);
    }
    const getRTDeviceId = await saveRefreshToken(getUserRes, refreshToken);

    ctx.setCookie("rt", refreshToken);
    ctx.setCookie("deviceId", getRTDeviceId);

    return { ...getUserRes.toJSON(), accessToken: token };
  } catch (err) {
    console.log(err);
    return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
  }
}

async function refreshToken(_, args, ctx) {
  try {
    const rt = ctx.getCookie("rt");
    const deviceId = ctx.getCookie("deviceId");

    if (!rt || !deviceId) {
      return throwError(HTTP_CODE_401_CODE, SESSION_EXPIRED);
    }
    const decoded = await validateToken(rt);
    console.log("decoded", decoded);
    if (!decoded) {
      return throwError(HTTP_CODE_401_CODE, SESSION_EXPIRED);
    }

    const user = await getUserById(decoded.id, [
      "id",
      "username",
      "role",
      "refreshToken",
    ]);

    if (!user) {
      return throwError(HTTP_CODE_401_CODE, SESSION_EXPIRED);
    }

    const refreshToken = user.get(`refreshToken.${deviceId}`);
    console.log("decoded user", refreshToken);
    if (!refreshToken || rt !== refreshToken) {
      return throwError(HTTP_CODE_401_CODE, SESSION_EXPIRED);
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return {
      ...user.toJSON(),
      accessToken: token,
    };
  } catch (err) {
    console.log(err);
    return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
  }
}

module.exports = authResolvers;
