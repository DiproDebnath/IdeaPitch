/* eslint-disable consistent-return */
const mongoose = require("mongoose");

const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const { role } = require("../utils/constants");

const { MEMBER } = role;

const ideaClaps = new Schema({
  idea: {
    type: Schema.Types.ObjectId,
    ref: "Idea",
    required: true,
    trim: true,
  },
  claps: {
    type: Number,
  },
});
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    ideaClaps: [ideaClaps],
    refreshToken: {
      type: Map,
      of: String,
    },
    role: {
      type: String,
      trim: true,
      required: true,
      default: MEMBER,
      enum: Object.values(role),
    },
    userFund: {
      amount: {
        type: Number,
        default: 100000,
        required: true,
        trim: true,
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.index({ username: 1 }, { unique: true });

userSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);
      user.password = hash;
      return next();
    });
  });
});

userSchema.methods.comparePassword = function comparePassword(inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// index

module.exports = mongoose.model("User", userSchema);
