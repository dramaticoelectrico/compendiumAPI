const User = require("../models/user");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { registerUser, loginUser } = require("../helpers");

// API JS ENABLED
exports.apiRegister = async (req, res) => {
  const isValid = registerUser(req.body);
  if (isValid) {
    return res.status(400).send(isValid.details[0].message);
  } else {
    const emailExhists = await User.findOne({ email: req.body.email });
    if (emailExhists) {
      return res
        .status(400)
        .send("User " + req.body.email + " already exhists");
    } else {
      // HASH PWD
      const salt = await bcrypt.genSalt(12);
      const hashPwd = await bcrypt.hash(req.body.password, salt);

      // return res.status(200).send(req.body)
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPwd,
      });
      try {
        const savedUser = await user.save();
        res.status(200).send(savedUser);
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
};
exports.apiSignIn = async (req, res) => {
  const isValid = loginUser(req.body);
  const { password, email } = req.body;
  if (isValid) {
    return res.status(400).json(isValid.details[0].message);
  } else {
    // Find the user from DB
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      return res.status(400).json({
        success: false,
        message: "Sorry, email " + email + " was not found",
      });
    } else {
      const matchPwd = await bcrypt.compare(password, foundUser.password);
      if (!matchPwd) {
        return res
          .status(400)
          .json({ success: false, message: "Sorry, password is not correct" });
      } else {
        const token = JWT.sign({ _id: foundUser._id }, process.env.JWT_SECRET);

        res
          .header("auth-token", token)
          .status(200)
          .send({ success: true, name: foundUser.name });
      }
    }
  }
};
