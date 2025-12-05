const express = require("express");
const {
  addExpense,
  getAllExpense,
  deleteExpense,
} = require("../controllers/expenseControllers");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/add", protect ,addExpense);
router.get("/get", protect, getAllExpense);
router.delete("/:id", protect, deleteExpense);

module.exports = router;
