const mongoose = require("mongoose");
const { status } = require("./idea.enum");

const { Schema } = mongoose;

const { PENDING } = status;

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
});

const ideaSchema = new Schema(
  {
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
      required: false,
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
    fund: [ideaFund],
    claps: {
      type: String,
      trim: true,
    },
    totalFund: {
      type: Number,
      trim: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(status),
      default: PENDING,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// index
ideaSchema.index({ slug: 1, owner: 1, "fund.user": 1 }, { unique: true });

module.exports = mongoose.model("Idea", ideaSchema);
