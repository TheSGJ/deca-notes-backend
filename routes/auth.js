const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

// Creating user with POST method on endpoint /api/auth/createuser
const JWT_SECRET = process.env.JWT_SECRET

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters. ").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check whether the email exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email already exists!" });
      }
      const salt = await bcrypt.genSalt(10);

      const securePass = await bcrypt.hash(req.body.password, salt) 
      // Create a User
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });
      const data = {
        user:{
          id: user.id
        }
      }
      const authToken =  jwt.sign(data, JWT_SECRET);
      res.json({authToken})

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// login user on endpoint /api/auth/login
router.post(
  "/login",
  [
    body("email", "Enter a valid email!").isEmail(),
    body("password", "Password cannot be blank!").exists(),
  ],
  async (req, res) => {
    // if encountered any errors, return error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   const {email, password} = req.body;
   try {
    let user = await User.findOne({email})
    if(!user){
      return res.status(400).json({error: "Wrong Credentials!"})
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if(!passwordCompare){
      return res.status(400).json({error: "Wrong Credentials!"})
    }
    
    const data = {
      user:{
        id: user.id
      }
    }
    const authToken =  jwt.sign(data, JWT_SECRET);
    res.json({authToken})
   } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
   }
  })
  // Get Logged in user details using 3rd endpoint for auth. /api/auth/getuser (Login required)
  router.post(
    "/getuser",
    fetchuser,
    async (req, res) => {
  try {
    userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }})
module.exports = router;
