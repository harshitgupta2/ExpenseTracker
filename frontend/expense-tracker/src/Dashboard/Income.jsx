import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import IncomeOverview from "../Income/IncomeOverview";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS } from "../Utils/apiPath";
import Modal from "../components/Modal";
import AddIncomeForm from "../Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../Income/IncomeList";
import DeleteAlert from "../components/DeleteAlert";
import { useUserAuth } from "../hooks/useUserAuth";

const Income = () => {
  useUserAuth()
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    date: null,
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  /**
   * Fetches all income records for the authenticated user.
   *
   * This function triggers the user auth hook, handles loading state,
   * sends a GET request to retrieve income data, and updates the UI
   * state with the returned values. If an error occurs, it logs it
   * to the console. Loading is reset in all cases.
   *
   * @returns {Promise<void>} Executes asynchronous operations but
   * does not return a value.
   */
  const fetchIncomeDeatils = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("something went wrong. please try again", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeDeatils();
  }, []);

  /**
   * Handles adding a new income entry.
   *
   * This function validates the income fields, sends the data to the
   * backend, and on success closes the modal, shows a success message,
   * and refreshes the income list. If validation fails or the request
   * errors out, it displays appropriate feedback messages.
   *
   * @param {Object} income - The income details entered by the user.
   * @param {string} income.source - The income source (e.g., salary, freelancing).
   * @param {number|string} income.amount - The income amount.
   * @param {string} income.date - The date of the income entry (YYYY-MM-DD).
   *
   * @returns {Promise<void>} Performs async operations but does not return a value.
   */
  
  const handleAddIncome = async (income) => {
    const { source, amount, date } = income;
    // validation check
    if (!source.trim()) {
      toast.error("Source is required");
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
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
      });
      setOpenAddIncomeModal(false);
      toast.success("Income Added successfully");
      fetchIncomeDeatils();
    } catch (error) {
      console.error(
        "Error adding income",
        error.response?.data?.message || error.message
      );
    }
  };

  /**
   * Deletes a specific income record by its ID.
   *
   * This function sends a DELETE request to the backend, and if the
   * operation succeeds, it closes the delete confirmation alert,
   * shows a success message, and refreshes the income list. Errors
   * are logged in the console with helpful details.
   *
   * @param {string} id - The unique identifier of the income record to delete.
   * @returns {Promise<void>} Executes async operations without returning a value.
   */
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted succsessfully");
      fetchIncomeDeatils();
    } catch (error) {
      console.error(
        "Error deleting the income",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
            <IncomeList
              transactions={incomeData}
              onDelete={(id) => {
                setOpenDeleteAlert({ show: true, data: id });
              }}
            />
          </div>
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income details"
            onDelete={() => handleDelete(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
