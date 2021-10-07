const User = require("../models/user");
const { registerUser, loginUser } = require("../utils/validation");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// POST ROUTS
exports.postRegisterRoute = async (req, res) => {
  const isValid = registerUser(req.body);
  if (isValid) {
    res.status(400).json({
      title: "Error",
      success: false,
      error: isValid.details[0].message,
    });
  } else {
    const emailExhists = await User.findOne({ email: req.body.email });
    if (emailExhists) {
      return res.status(200).json({
        title: "Error",
        success: false,
        error: "User " + req.body.email + " already exhists",
      });
    } else {
      // HASH PWD
      const salt = await bcrypt.genSalt(12);
      const hashPwd = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPwd,
      });
      try {
        const savedUser = await user.save();
        const token = JWT.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
        res
          .cookie("jwtauth", token, { httpOnly: true })
          .send(200)
          .json({ success: true, token });
      } catch (error) {
        // TODO: system debug - send error template
        res.status(400).json(error);
      }
    }
  }
};
exports.postSignInRoute = async (req, res) => {
  const isValid = await loginUser(req.body);
  const { password, email } = req.body;
  if (isValid) {
    return res.status(401).json({
      success: false,
      error: isValid.details[0].message,
    });
  } else {
    // Find the user from DB
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      // TODO: ERROR HANDLE ON PAGE
      return res.status(404).json({
        success: false,
        error: "Sorry email address " + email + " isn't in here",
      });
    } else {
      const matchPwd = await bcrypt.compare(password, foundUser.password);
      if (!matchPwd) {
        return res.status(401).json({
          success: false,
          error: "Sorry password is wrong. Please slow down and relax.",
        });
      } else {
        const token = JWT.sign({ _id: foundUser._id }, process.env.JWT_SECRET);
        // TODO: use secure:true
        res
          .status(200)
          .cookie("jwtauth", token, { httpOnly: true })
          .cookie("name", foundUser.name, { httpOnly: true })
          .json({ success: true, token, user: foundUser.name });
      }
    }
  }
};
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
