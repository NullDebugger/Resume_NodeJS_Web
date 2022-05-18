const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/* Define A User Schema */
const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  // Add the Ceated Time and Update Time Stamps
  { timestamps: true }
);

/* Hash The password */
async function generateHash(password) {
  const COST = 12;
  return bcrypt.hash(password, COST);
}

/* Middleware which are passed control during execution of asynchronous functions */
UserSchema.pre('save', function preSave(next) {
  /*
        "this" refers to: 
    1. aggregation object
    2. refers to the model.
    3. refers to the document.
    4. refers to the query.
     */
  const user = this;
  if (user.isModified('password')) {
    return generateHash(user.password)
      .then((hash) => {
        user.password = hash;
        return next();
      })
      .catch((error) => {
        return next(error);
      });
  }
  return next();
});

/* Compare Password */
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
