const mongoose = require("mongoose")
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const db = process.env.MONGO_URI

mongoose.set("strictQuery", false)
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.info("MongoDB Connected...")
  } catch (err) {
    console.error(err.message)
    // Exit process with failure
    process.exit(1)
  }
}

module.exports = connectDB
