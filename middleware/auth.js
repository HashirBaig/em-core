const jwt = require("jsonwebtoken")
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const { SERVER_ERROR, INVALID_TOKEN } = require("../common/messages")

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token")
  // Check if not token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  // Verify token
  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: INVALID_TOKEN })
      } else {
        req.user = decoded.user
        next()
      }
    })
  } catch (err) {
    return res.status(500).json({ message: SERVER_ERROR })
  }
}
