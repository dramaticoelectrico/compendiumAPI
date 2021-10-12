const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

function auth(req, res, next) {
  const { jwtauth } = req.cookies;
  const token = req.header("auth-token") || jwtauth;
  if (!token) return res.redirect("/auth/signin");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.json({ success: false, error });
  }
}
const registerUser = (formData) => {
  const schema = {
    name: Joi.string().min(6).required(),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(220).required(),
  };
  const { error } = Joi.validate(formData, schema);
  return error;
};
const loginUser = (formData) => {
  const schema = {
    email: Joi.string().email(),
    password: Joi.string().min(8).max(220).required(),
  };
  const { error } = Joi.validate(formData, schema);
  return error;
};
module.exports = { auth, registerUser, loginUser };
