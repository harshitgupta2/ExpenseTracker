import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useUserAuth } from "../hooks/useUserAuth";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS } from "../Utils/apiPath";
import toast from "react-hot-toast";
import ExpenseOverview from "../Expense/ExpenseOverview";
import Modal from "../components/Modal";
import AddExpenseFrom from "../Expense/AddExpenseFrom";
import ExpenseList from "../Expense/ExpenseList";
import DeleteAlert from "../components/DeleteAlert";
const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    date: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const fetchExpenseDeatils = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("something went wrong. please try again", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { category, amount, date } = expense;
    // validation check
    if (!category.trim()) {
      toast.error("category is required");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number");
      return;
    }
    if (!date) {
      toast.error("Date is reqiured");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
      });
      setOpenAddExpenseModal(false);
      toast.success("Expense Added successfully");
      fetchExpenseDeatils();
    } catch (error) {
      console.error(
        "Error adding Expense",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted succsessfully");
      fetchIncomeDeatils();
    } catch (error) {
      console.error(
        "Error deleting the expense",
        error.response?.data?.message || error.message
      );
    }
  };
  useEffect(() => {
    fetchExpenseDeatils();
  }, []);
  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
            <ExpenseList
              transactions={expenseData}
              onDelete={(id) => {
                setOpenDeleteAlert({ show: true, data: id });
              }}
            />
          </div>
        </div>
        <Modal
          isOpen={openAddExpenseModal}
          onClck={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseFrom onAddIncome={handleAddExpense} />
        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense details"
            onDelete={() => handleDelete(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
