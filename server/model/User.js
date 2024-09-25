const mongoose = require('mongoose');
const LoginSchema = new mongoose.Schema({
    name: {
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
  },
}, { timestamps: true });

const UserModel = mongoose.model('User', LoginSchema);

module.exports = UserModel;
