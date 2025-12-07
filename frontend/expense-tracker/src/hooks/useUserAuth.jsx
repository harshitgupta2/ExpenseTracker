import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS } from "../Utils/apiPath";

/**
 * Custom hook that ensures the authenticated user's information is loaded.
 *
 * This hook checks whether the user data already exists in context. If not,
 * it requests the user's profile from the backend. On success, the user
 * object is stored in context; on failure (e.g., expired token), the user
 * is cleared and redirected to the login page.
 *
 * The hook also uses an `isMounted` guard to prevent state updates on
 * unmounted components.
 *
 * @function useUserAuth
 * @returns {void} This hook does not return anything; it manages side effects.
 */
export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;
    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO); // Fetching user info to show on the dashboard
        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.log("Failed to fetch user info", error);
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };
    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [updateUser, clearUser, navigate]);
};
