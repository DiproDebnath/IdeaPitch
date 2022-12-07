const express = require("express");
const app = express();
const { sequelize } = require("./models");

const fileUpload = require('express-fileupload');

app.use(fileUpload({
  createParentPath: true
}));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.get("/", (req, res) => {
  res.json("IdeaPitch Project");
});

const authRouter = require("./routes/auth");
const ideaRouter = require("./routes/idea");


app.use("/", authRouter);
app.use("/idea", ideaRouter);

// Error Handler
app.use((err, req, res, next) => {
 
  if (err.status && err.status !== 500) {
    return res.status(err.status).json({
      error: {
        status: err.status,
        message: err.message,
      },
    });
  }
  res.status(500);
  res.json({
    error: {
      status: 500,
      message: "Internal server error",
    },
  });
});

app.listen({ port: 3000 }, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
