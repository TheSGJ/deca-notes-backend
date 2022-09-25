const express = require('express');
// const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
// Creating user with POST method on endpoint /api/auth/

router.post('/', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password').isLength({ min: 5 }),
], (req, res)=>{
    // const user = User(req.body);
    // user.save();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send(req.body)
})

module.exports = router;