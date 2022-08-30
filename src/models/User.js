const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    toughts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tought'
      }
    ]
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const User = mongoose.model('user', userSchema, 'user');

module.exports = User;