const express = require('express');
const zod = require('zod');
const jwt = require("jsonwebtoken")
const router = express.Router();
const { User, Account } = require('../db/database');
const { JWT_SECRET } = require('../config');
const  { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    username  : zod.string().email(),
    firstName : zod.string(),
    lastName  : zod.string(),
    password  : zod.string().min(6)
})

const signinBody = zod.object({
    username : zod.string().email(),
    password : zod.string().min(6)
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;
    
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1M' })
    
    console.log(token)

    res.json({
        message: "User created successfully",
        token: token
    })
})


router.post('/signin', async (req,res) => {
    const {success, error} = signinBody.safeParse(req.body)

    if(!success){
        return res.status(411).json({
            msg : "Invalid Inputs",
            error : error.errors
        })
    }

    const user = await User.findOne({
        username : req.body.username,
        password : req.body.password
    })

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            msg : "Login successfully",
            token: token
        })
        return;
    }


    res.status(411).json({
        message: "Error while logging in"
    })

})

router.put("/update", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    const updatedUser = await User.updateOne({ _id: req.userId }, req.body);

    res.status(200).json({
        message: "Updated successfully",
        updatedUser : updatedUser
    })
})

router.get('/bulk', async (req,res) => {
    const filter = req.query.filter || "";

    const user = await User.find({
        $or : [{
            firstNmae : {
                "$regex" : filter               // $ regex ==> regular expression
            },
            lastName : {
                "$regex" : filter               // $ regex ==> regular expression
            }
        }]
    })

    res.json({
        user : user.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router;