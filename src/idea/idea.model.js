const mongoose = require("mongoose");
const { status } = require("./idea.enum");
const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const {PENDING} = status;

const userClaps =  new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        trim: true,
    },
    claps: {
      type: Number,
    },
  })
  const ideaFund = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isReturn: {
      type: Boolean,
    },
  })

const ideaSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnail: {
    type: String,
    required: true,
    trim: true,
  },
  budget: {
    type: Number,
    required: true,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    trim: true,
  },
  userClaps: [userClaps],
  fund: [ideaFund],
  claps: {
    type: String,
    trim: true,
  },
  totalFund : {
    type: Number,
    trim: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(status),
    default: PENDING
  },
  note: {
    type: String,
    trim: true,
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });



// index



module.exports = mongoose.model('Idea', ideaSchema);