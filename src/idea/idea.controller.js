const {
  HTTP_CODE_422_CODE,
  HTTP_CODE_401_CODE,
  HTTP_CODE_500_MESSAGE,
  HTTP_CODE_500_CODE,
  HTTP_CODE_401_MESSAGE,
  THUMBNAIL_REQUIRED,
  REQUIRED_THUMBNAIL_TYPE,
  MAX_FILE_SIZE,
  THUMBNAIL_MAXIMUM_SIZE,
} = require("../utils/constants");
const { validateAccessToken } = require("../utils/jwt");

const { handleFileUpload } = require("./idea.service");

const ideaController = {
  thumbnailUpload: async (req, res) => {
    try {
      const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(HTTP_CODE_401_CODE).json({
          success: false,
          message: HTTP_CODE_401_MESSAGE,
        });
      }
      const decoded = await validateAccessToken(token);

      if (!decoded) {
        return res.status(HTTP_CODE_401_CODE).json({
          success: false,
          message: HTTP_CODE_401_MESSAGE,
        });
      }

      if (!req.files) {
        return res.status(HTTP_CODE_422_CODE).json({
          success: false,
          message: THUMBNAIL_REQUIRED,
        });
      }

      const file = req.files.thumbnail;

      const checkFileType =
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp";

      if (!checkFileType) {
        return res.status(HTTP_CODE_422_CODE).json({
          success: false,
          message: REQUIRED_THUMBNAIL_TYPE,
        });
      }

      if (file.size > MAX_FILE_SIZE) {
        res.status(HTTP_CODE_422_CODE).json({
          success: false,
          message: THUMBNAIL_MAXIMUM_SIZE,
        });
      }

      const fileUrl = await handleFileUpload(file);
      return res.json({ url: fileUrl });
    } catch (error) {
      return res.status(HTTP_CODE_500_CODE).json({
        success: false,
        message: HTTP_CODE_500_MESSAGE,
      });
    }
  },
};

module.exports = ideaController;
