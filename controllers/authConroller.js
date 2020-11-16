const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports.home = (req, res) => {
  res.render("home");
};

module.exports.smoothies = (req, res) => {
  res.render("smoothies");
};

module.exports.singup_get = (req, res) => {
  res.render("signup");
};

const handlerErrors = (err) => {
  let errors = { email: "", password: "" };

  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = "that email is not a register";
  }

  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "that password is not correct";
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "my secret", {
    expiresIn: maxAge,
  });
};

module.exports.singup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    const saveUser = await user.save();
    const token = createToken(saveUser.id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: saveUser });
  } catch (err) {
    let errors = handlerErrors(err);
    res.status(404).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user.id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user });
  } catch (error) {
    const errors = handlerErrors(error);
    res.status(400).json({ errors });
  }
};
module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.logout_get = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
