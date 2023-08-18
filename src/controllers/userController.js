const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = async (req, res, next) => {
  console.log("signUp");
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    res.status(402).json({ data: "this user already exist" });
  }
  console.log(isUserExist);

  const hashPassword = await bcrypt.hash(password, 10);

  console.log("hashPassword", hashPassword);
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

  console.log(user);

  const token = createToken(email);

  res.status(200).json({ token, user });
};

exports.signIn = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log("emai", email);
  console.log("password", password);
  if (!email || !password) {
    res
      .status(402)
      .json({ data: "email or password is required", status: 402 });
  }

  const user = await User.findOne({ email });

  console.log("user is", user);

  if (!user) {
    res.status(402).json({ data: "email is required", status: 402 });
  }

  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    res.status(402).json({ data: "password is required", status: 402 });
  }

  const token = createToken(user.email);

  res.status(201).json({ data: { token, user }, status: 200 });
};

exports.authentication = async (req, res, next) => {
  let token;
  console.log("req.header", req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401).json({
      data: "You are not logged in! Please log in to get access.",
      status: 402,
    });
  }

  const decoded = jwt.decode(token, process.env.JWT_SECERT);

  console.log("decode", decoded);

  next();
};

exports.changePassword = async (req, res, next) => {};
