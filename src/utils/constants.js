const role = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  REVIEWER: 'reviewer',
  SUPER_USER: 'super_user',
  MEMBER: 'member',
};

module.exports = {
  HTTP_CODE_400_MESSAGE: "Bad Request",
  HTTP_CODE_400_CODE: "400",
  HTTP_CODE_403_MESSAGE: "Forbidden",
  HTTP_CODE_403_CODE: "403",
  HTTP_CODE_404_MESSAGE: "Not Found",
  HTTP_CODE_404_CODE: "404",
  HTTP_CODE_406_MESSAGE: "Not Acceptable",
  HTTP_CODE_406_CODE: "406",
  HTTP_CODE_401_MESSAGE: "Unauthorized",
  HTTP_CODE_401_CODE: "401",
  HTTP_CODE_422_MESSAGE: "Unprocessable Entity",
  HTTP_CODE_422_CODE: "422",
  HTTP_CODE_500_MESSAGE: "Internal Server Error",
  HTTP_CODE_500_CODE: "500",
  HTTP_CODE_429_MESSAGE: "Too Many Requests",
  HTTP_CODE_429_CODE: "429",
  USER_ALREADY_EXISTS: "User already Exists",
  NOT_AUTHORIZED: "User is not authorized",
  THUMBNAIL_REQUIRED: "thumbnail is required",
  REQUIRED_THUMBNAIL_TYPE: "thumbnail type must be jpeg or png or webp",
  THUMBNAIL_MAXIMUM_SIZE: "maximum file size limit 2MB",
  role
};
