import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../../Utils/helper";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPath";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);

  /**
   * Handles the login form submission.
   *
   * This function validates the user's email and password,
   * shows relevant error messages, and then sends a login
   * request to the backend. If authentication is successful,
   * the user's token is stored in localStorage and they are
   * redirected to the dashboard.
   *
   * @param {Event} e - The form submit event.
   *
   * @returns {Promise<void>} - Doesn't return a value, but
   * handles UI updates, API calls, and navigation as side effects.
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("please Enter an email");
      return;
    }

    if (!password) {
      setError("please enter a valid password");
      return;
    }
    setError(" ");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("something went wrong. Please try again later");
      }
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            type="text"
            label="Email Address"
            placeholder="Enter email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          <Input
            type="password"
            label="Password"
            placeholder=""
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button className="btn-primary" type="submit">
            Login
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
