const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const app = express()

// Connect DB
connectDB()

// Enable pre-flight across-the-board
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
app.use(cors())

// Init Middleware
app.use(express.json())

// Define Routes
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/users", require("./routes/api/users"))
app.use("/api/items", require("./routes/api/items"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
