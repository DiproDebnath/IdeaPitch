const mongoose = require("mongoose");
const { mongoDB } = require("../config/config");

mongoose.connect(
  mongoDB.URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("mongdb is connected");
  }
);

module.exports = mongoose;
