const mongoose = require('mongoose');

const toughtSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const Tought = mongoose.model('tought', toughtSchema, 'tought');

module.exports = Tought;