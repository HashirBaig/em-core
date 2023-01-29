const express = require("express")
const { check, validationResult } = require("express-validator")
const auth = require("../../middleware/auth")
const { SERVER_ERROR } = require("../../common/messages")
const Item = require("../../models/Item")

const router = express.Router()

// @route   GET api/items
// @desc    Get all items
// @access  Private
router.get("/", [auth], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const userEmail = req?.user?.email
    const items = Item.find({ createdBy: userEmail })

    return res.status(200).json({ items })
  } catch (error) {
    console.error(error)
    return res.status(500).send(SERVER_ERROR)
  }
})

// @route   POST api/items
// @desc    Add item
// @access  Private
// router.post("/", [auth,[check("item", "item is required")]], async (req, res) => {
router.post("/", [auth, [check("item", "item is required").notEmpty()]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { item, description, amount } = req.body
  try {
    const userEmail = req?.user?.email
    console.log("item: ", item)
    console.log("description: ", description)
    console.log("amount: ", amount)
    console.log("userEmail: ", userEmail)
    // const item = new Item({
    //     item,
    //     amount,
    //     description,
    //     createdBy: req?.user?.email
    // })
    // await item.save()

    return res.status(200).json({ status: "OK" })
  } catch (error) {
    console.error(error)
    return res.status(500).send(SERVER_ERROR)
  }
})

module.exports = router
