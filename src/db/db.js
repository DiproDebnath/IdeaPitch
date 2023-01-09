const {mongoDB} = require("../config/config");
const mongoose = require("mongoose");


mongoose.connect(mongoDB.URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log("mongdb is connected");
      }
)

module.exports = mongoose;