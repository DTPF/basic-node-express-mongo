const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'Nombre obligatorio'],
    minLength: [3, 'Nombre con un mínimo de 3 carácteres']
  },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
});

module.exports = mongoose.model("User", UserSchema);