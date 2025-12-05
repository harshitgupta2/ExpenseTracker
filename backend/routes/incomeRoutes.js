const express = require("express");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
} = require("../controllers/incomeControllers");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/add", protect ,addIncome);
router.get("/get", protect, getAllIncome);
router.delete("/:id", protect, deleteIncome);

module.exports = router;
