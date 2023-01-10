const {
  HTTP_CODE_422_CODE,
  HTTP_CODE_401_CODE,
  HTTP_CODE_500_MESSAGE,
  HTTP_CODE_500_CODE,
  HTTP_CODE_401_MESSAGE,
  THUMBNAIL_REQUIRED,
  REQUIRED_THUMBNAIL_TYPE,
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
console.log(req.files);
      if (!req.files) {
        return res.status(HTTP_CODE_422_CODE).json({
          success: false,
          message: THUMBNAIL_REQUIRED,
        });
      } else {
        const file = req.files.thumbnail;

        const checkFileType =
          file.mimetype == "image/jpeg" ||
          file.mimetype == "image/png" ||
          file.mimetype == "image/webp";

        if (!checkFileType) {
          return res.status(HTTP_CODE_422_CODE).json({
            success: false,
            message: REQUIRED_THUMBNAIL_TYPE,
          });
        }

        if (file.size > maxFileSize) {
          res.status(HTTP_CODE_422_CODE).json({
            success: false,
            message: THUMBNAIL_MAXIMUM_SIZE,
          });
        }

        const fileUrl = await handleFileUpload();
        return fileUrl;
      }
    } catch (error) {
      res.status(HTTP_CODE_500_CODE).json({
        success: false,
        message: HTTP_CODE_500_MESSAGE,
      });
    }
  },
};

module.exports = ideaController;