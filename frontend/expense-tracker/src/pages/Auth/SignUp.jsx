import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../../Utils/helper";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPath";
import { UserContext } from "../../context/UserContext";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  /**
   * Handles the user signup process.
   *
   * This function validates the signup form fields, sends the
   * registration request to the backend, and if successful,
   * stores the returned token, updates the user state, and
   * redirects the user to the dashboard. If an error occurs,
   * a relevant message is shown on the UI.
   *
   * @param {Event} e - The form submit event.
   * @returns {Promise<void>} - Executes async operations but returns no value.
   */

  const hadleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError("Enter your full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Enter a valid email");
      return;
    }
    if (!password) {
      setError("Enter a password");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
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
        setError("Something went Wrong");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-10 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below
        </p>

        <form onSubmit={hadleSignUp}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Enter your full name"
              placeholder="Enter your full name"
            />
            <Input
              type="text"
              label="Email Address"
              placeholder="Enter email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <div className=" ">
              <Input
                type="password"
                label="Password"
                placeholder=""
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button className="btn-primary" type="submit">
            SignUp
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
