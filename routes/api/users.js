const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")

const router = express.Router()
const User = require("../../models/User")
const { SERVER_ERROR } = require("../../common/messages")
const auth = require("../../middleware/auth")
const permission = require("../../middleware/permission")
const mongoose = require("mongoose")

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  [check("email", "Please include a valid email").exists(), check("password", "Please enter a password").exists()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { role, email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({ errors: { message: "User already exists" } })
      }

      user = new User({
        email,
        password,
        role,
      })

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      await user.save()

      const payload = {
        user: {
          id: user.id,
          role: user.role,
          email: user.email,
        },
      }

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
        if (err) throw err
        res.json({ token, user })
      })
    } catch (err) {
      console.error(err.message)
      return res.status(500).send(SERVER_ERROR)
    }
  }
)

// @route    GET api/users
// @desc     Get all users list
// @access   Private
router.get("/", [auth, permission("admin")], async (req, res) => {
  try {
    const users = await User.find({ email: { $ne: "gcc" } }).sort({ role: 1 })

    if (!users) {
      return res.json({ users: [] })
    }

    return res.json({ users })
  } catch (err) {
    console.error(err.message)
    return res.status(500).send(SERVER_ERROR)
  }
})

// @route    DELETE api/users/:id
// @id     Delete User with provided id
// @access   Private
router.delete("/:id", [auth, permission("admin")], async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findOneAndRemove({
      _id: mongoose.Types.ObjectId.ObjectId(id),
      email: { $ne: "gcc" },
    })

    if (!user) {
      return res.status(404).json({ erros: { message: "Unable to delete this user" } })
    }

    return res.json({ user })
  } catch (err) {
    console.error(err.message)
    return res.status(500).send(SERVER_ERROR)
  }
})

module.exports = router
