const mongoose = require("mongoose");
const { Schema } = mongoose;
const {role} = require("./user.enum");
mongoose.Promise = global.Promise;

const {MEMBER} = role;

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


// userSchema.pre('save', function(next) {
//   const user = this;
//   if (!user.isModified('password')) return next();

//   bcrypt.genSalt(10, (err, salt) => {
//       if (err) return next(err);
//       bcrypt.hash(user.password, salt, (err, hash) => {
//           if (err) return next(err);
//           user.password = hash;
//           next();
//       });
//   });
// });

// userSchema.methods.comparePassword = function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };




module.exports = mongoose.model("User", userSchema);