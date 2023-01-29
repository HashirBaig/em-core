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
router.post("/add-item", [auth, [check("item", "item is required").notEmpty()]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { item, description, amount } = req.body
  try {
    const userEmail = req?.user?.email

    const registration = new Item({
      item,
      amount: Number(amount),
      description,
      createdBy: userEmail,
    })
    await registration.save()

    return res.status(200).json({ message: "Item added successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).send(SERVER_ERROR)
  }
})

module.exports = router
