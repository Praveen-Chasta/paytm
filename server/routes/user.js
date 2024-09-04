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
    const { success, error } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            error: "Incorrect inputs",
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            error: "Email already taken",
            
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;
    const username = user.username

    await Account.create({
        userId,
        username,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' })
    
    console.log(token)

    res.json({
        message: "User created successfully",
        token: token
    })
})


router.post('/signin', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username, password });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const account = await Account.findOne({ userId: user._id });
  
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
  
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  
      res.json({
        message: 'Login successful',
        token,
        balance: account.balance, // Include balance in response
        userId: user._id
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });


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




// Assuming you have a middleware to decode the JWT and add the userId to req.user
router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";
    const loggedInUserId = req.user.userId; // Access userId from req.user

    try {
        const users = await User.find({
            _id: { $ne: loggedInUserId }, // Exclude the logged-in user
            $or: [
                { firstName: { "$regex": filter, "$options": "i" } }, // Include case-insensitive flag
                { lastName: { "$regex": filter, "$options": "i" } }  // Include case-insensitive flag
            ]
        });

        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

module.exports = router;