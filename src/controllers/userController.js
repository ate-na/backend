const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    return res.status(402).json({ data: "this user already exist" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  let user;
  try {
    user = await User.create({
      email,
      name,
      password: hashPassword,
    });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }

  const token = createToken(email);

  res.status(200).json({ token, user });
};

exports.signIn = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(402)
      .json({ data: "email or password is required", status: 402 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(402).json({ data: "email is required", status: 402 });
  }

  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    return res
      .status(402)
      .json({ data: "user or  password is not correct", status: 402 });
  }

  const token = createToken(user.email);

  res.status(201).json({ data: { token, user }, status: 200 });
};

exports.authentication = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({
      data: "You are not logged in! Please log in to get access.",
      status: 402,
    });
  }

  let decode;
  try {
    decode = jwt.verify(token, process.env.JWT_SECERT, {});
  } catch (error) {
    console.log(error);
  }

  if (!decode || !decode.email) {
    return res.status(401).json({
      data: "token is not valid",
      status: 401,
    });
  }

  const user = await User.findOne({ email: decode.email });

  if (!user) {
    return res.status(401).json({
      data: "token is not valid",
      status: 401,
    });
  }

  req.user = user;

  next();
};

exports.changePassword = async (req, res, next) => {
  const user = req.user;
  const password = req.body.password;

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await User.findByIdAndUpdate(user._id, {
    password: hashPassword,
  });

  return res.status(200).json({ data, status: 200 });
};
