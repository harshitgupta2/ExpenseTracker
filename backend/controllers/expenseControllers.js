const User = require("../models/User");
const Expense = require("../models/Expense");

/**
 * Adds a new expense record for the authenticated user.
 *
 * This controller validates the required fields (`category`, `amount`, and `date`),
 * and if all fields are provided, it creates and saves a new expense document.
 * On success, the saved expense is returned in the response. Any validation or
 * server errors are handled with appropriate HTTP status codes.
 *
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object populated by middleware.
 * @param {string} req.user.id - The ID of the logged-in user.
 * @param {Object} req.body - Incoming expense data.
 * @param {string} [req.body.icon] - Optional icon associated with the expense.
 * @param {string} req.body.category - The category of the expense (e.g., food, travel).
 * @param {number|string} req.body.amount - The expense amount.
 * @param {string} req.body.date - The date of the expense (ISO or YYYY-MM-DD format).
 * @param {Object} res - The Express response object.
 *
 * @returns {Promise<void>} Sends a JSON response rather than returning a value.
 */
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    //validation: check missing field

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

/**
 * Retrieves all expense records for the authenticated user.
 *
 * This controller fetches every expense entry linked to the user's ID
 * and returns them sorted by date in descending order (most recent first).
 * If an error occurs during the database query, a 500 error response is sent.
 *
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object populated by middleware.
 * @param {string} req.user.id - The ID of the logged-in user.
 * @param {Object} res - The Express response object.
 *
 * @returns {Promise<void>} Sends a JSON response containing the user's expenses.
 */
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "server Error", error: error.message });
  }
};
/**
 * Deletes an expense record by its ID.
 *
 * This controller removes a specific expense document from the database
 * using the ID provided in the request parameters. If the deletion is
 * successful, a confirmation message is returned. Any server-side errors
 * are caught and sent back with a 500 status code.
 *
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.id - The ID of the expense to delete.
 * @param {Object} res - The Express response object.
 *
 * @returns {Promise<void>} Sends a JSON response instead of returning a value.
 */
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense Deleted Sussefully" });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
