const express = require("express")
const bcrypt = require("bcryptjs")
const auth = require("../../middleware/auth")
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")

const User = require("../../models/User")
const { SERVER_ERROR } = require("../../common/messages")
const router = express.Router()

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(SERVER_ERROR)
  }
})

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  "/",
  [
    check("email", "Please include a valid email/username").exists(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ errors: { message: "Invalid Credentials" } })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ errors: { message: "Invalid Credentials" } })
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role,
          email: user.email,
        },
      }

      const _passwordLessUser = {
        role: user.role,
        email: user.email,
        permissions: user.permissions,
        hasPasswordChanged: user.hasPasswordChanged,
      }

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
        if (err) throw err
        res.json({ token, user: _passwordLessUser })
      })
    } catch (err) {
      console.error(err.message)
      return res.status(500).send(SERVER_ERROR)
    }
  }
)

// @route    PUT api/auth/reset-password
// @desc     Change password / Update User / Give permissions to user
// @access   Private
router.put(
  "/update-user",
  [auth, [check("email", "Please include a valid email").exists(), check("password", "Password is required").exists()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, permissions, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ errors: [{ message: "Email doesn't exist" }] })
      }

      user.permissions = permissions

      if (password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        user.hasPasswordChanged = true
      }
      await user.save()

      const _passwordLessUser = {
        role: user.role,
        permissions: user.permissions,
        email: user.email,
      }

      return res.json({ user: _passwordLessUser })
    } catch (err) {
      console.error(err.message)
      return res.status(500).send(SERVER_ERROR)
    }
  }
)

// @route    POST api/auth/logout
// @desc     POST logging user when user opts to logout of application
// @access   Private
router.post("/logout", auth, async (req, res) => {
  try {
    res.status(200).json({ status: "ok", message: "logout successful." })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(SERVER_ERROR)
  }
})
module.exports = router
