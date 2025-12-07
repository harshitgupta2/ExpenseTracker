const userIncome = require("../models/userIncome");
const Expense = require("../models/Expense");
const { isvalidObjectId, Types, isValidObjectId } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    /**
     * Calculates the total income amount for a specific user.
     *
     * This function runs a MongoDB aggregation pipeline that:
     * 1. Filters income records by the user's ObjectId.
     * 2. Sums all `amount` fields to produce the user's total income.
     *
     * It also logs the resulting aggregation and whether the provided
     * userId is a valid MongoDB ObjectId.
     *
     * @async
     * @param {string} userId - The user ID used to filter income records.
     * @returns {Promise<Array>} The aggregation result containing the total income.
     */
    const totalIncome = await userIncome.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    console.log("totalIncome", {
      totalIncome,
      userId: isValidObjectId(userId),
    });

    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // get income tranctions in the last 30 days
    const last30DaysIncomeTransaction = await userIncome
      .find({
        userId,
        date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      })
      .sort({ date: -1 });

    //get total income for last 30 days
    const incomeLast30Days = last30DaysIncomeTransaction.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // get expense transactions in the last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });
    // get total expense for last 30 days
    const expenseLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    //Fetch last 5 transactions (income+expense)
    const lastTransactions = [
      ...(await userIncome.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "income",
        })
      ),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "expense",
        })
      ),
    ].sort((a, b) => b.date - a.date); // sort latest first

    //final response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30DaysExpense: {
        total: expenseLast30Days,
        transaction: last30DaysExpenseTransactions,
      },
      last30DaysIncome: {
        total: incomeLast30Days,
        transaction: last30DaysIncomeTransaction,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};
