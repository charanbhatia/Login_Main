const express = require("express");
const User = require("../models/userModel");
const bcrypt = require('bcrypt');

const router = express.Router();

router.post("/register", async (req, res) => { 
    try {
        const existUser= await User.findOne({email: req.body.email});
        if(existUser){
            return res.status(400).json("User with this email already exists");
        }

        const salt=await bcrypt.genSalt(10);

        const hashedPassword=await bcrypt.hash(req.body.password, salt);
        req.body.password=hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.json(err);
    }

    
});

router.post("/login", async (req, res) => {
    const user=await User.findOne({email: req.body.email});
    if(!user){
        res.send(
            {
                success: false,
                message: "User not found"

            }
        )
    }
    const validPassword=await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        res.send(
            {
                success: false,
                message: "Invalid password"
            }
        )
    }
     res.status(201).json(user);
});


module.exports = router;