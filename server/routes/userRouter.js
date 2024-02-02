const express = require("express");
const JWT_SECRET = "mysecret";

const router = express.Router();

const User = require("../models/userModel");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// Middleware function to check if the request has a valid JWT
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ error: "Invalid token." });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;

router.post("/create-user", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    res.status(200).send({ data: savedUser });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    res.status(200).send({ message: "Login successful", user });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
