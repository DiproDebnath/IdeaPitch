const express = require("express");
const app = express();
const { sequelize } = require("./models");

const fileUpload = require("express-fileupload");

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 2 * 1024 * 1024 ,
    },
  })
);
app.use(express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("IdeaPitch Project");
});

const authRouter = require("./routes/auth");
const ideaRouter = require("./routes/idea");
const clapRouter = require("./routes/clap");
const userRouter = require("./routes/user");
const adminIdeaRouter = require("./routes/admin/idea");

app.use("/", authRouter);
app.use("/idea/clap", clapRouter);
app.use("/idea", ideaRouter);
app.use("/user", userRouter);

app.use("/admin/idea", adminIdeaRouter);

// Error Handler
app.use((err, req, res, next) => {
  console.log(err);
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
