const {mongoDB} = require("../config/config");
const mongoose = require("mongoose");


mongoose.connect(mongoDB.URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

module.exports = mongoose;