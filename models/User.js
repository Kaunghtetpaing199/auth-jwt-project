const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Pelease enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Pelase enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Pelease enter an password"],
    minlength: [6, "Minimun password length is 6 character"],
  },
});

//fire a function before doc saved to do
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

module.exports = mongoose.model("user", userSchema);