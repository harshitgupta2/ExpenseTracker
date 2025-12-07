const User = require("../models/User");
const userIncome = require("../models/userIncome");

/**
 * Adds a new income record for the authenticated user.
 *
 * This controller validates the required fields (`source`, `amount`, and `date`),
 * creates a new income entry associated with the logged-in user, saves it to the
 * database, and returns the newly created record. If any required fields are missing
 * or if a server error occurs, an appropriate error response is sent back.
 *
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object injected by middleware.
 * @param {string} req.user.id - The ID of the current logged-in user.
 * @param {Object} req.body - The payload containing income details.
 * @param {string} [req.body.icon] - Optional icon representing the income source.
 * @param {string} req.body.source - The source of the income (e.g., salary, business).
 * @param {number|string} req.body.amount - The amount of income.
 * @param {string} req.body.date - The date of the income (ISO string or YYYY-MM-DD).
 * @param {Object} res - The Express response object.
 *
 * @returns {Promise<void>} Sends a JSON response with the new income record.
 */

exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    //validation: check missing field

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newIncome = new userIncome({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });
    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
/**
 * Retrieves all income records for the authenticated user.
 *
 * This controller fetches every income entry associated with the user's ID
 * and returns them sorted in descending order by date (latest first).
 * If any error occurs during the database query, a 500 response with
 * an error message is sent back.
 *
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object provided by auth middleware.
 * @param {string} req.user.id - The ID of the currently logged-in user.
 * @param {Object} res - The Express response object.
 *
 * @returns {Promise<void>} Sends a JSON response containing the list of income records.
 */
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await userIncome.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "server Error", error: error.message });
  }
};
/**
 * Deletes an income record by its ID.
 *
 * This controller removes a specific income document from the database
 * using the ID provided in the request parameters. If the deletion is
 * successful, a confirmation message is returned. Any errors that occur
 * during the process result in a 500 server error response.
 *
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.id - The ID of the income entry to delete.
 * @param {Object} res - The Express response object.
 *
 * @returns {Promise<void>} Sends a JSON response confirming deletion.
 */
exports.deleteIncome = async (req, res) => {
  try {
    await userIncome.findByIdAndDelete(req.params.id);
    res.json({ message: "Income Deleted Sussefullty" });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
