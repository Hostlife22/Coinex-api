const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { addMethods } = require('../../utils/toResponse');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    }
  },
  { collection: 'users' }
);

User.index({ email: 1 }, { unique: true });

User.pre('save', async function preSave(next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

User.pre('findOneAndUpdate', async function preUpdate(next) {
  if (this._update.$set.password) {
    this._update.$set.password = await bcrypt.hash(
      this._update.$set.password,
      10
    );
  }

  next();
});

addMethods(User);

module.exports = mongoose.model('users', User);
