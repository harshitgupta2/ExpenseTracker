import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ type, label, placeholder, value, onChange }) => {
  const [showPassword, setShowPassowrd] = useState(false);

  /**
   * Toggles the visibility of the password field.
   *
   * Switches the current `showPassword` boolean state
   * to its opposite value.
   */
  const toggleShowPassword = () => {
    setShowPassowrd(!showPassword); // toggle the boolean value
  };
  return (
    <div className="">
      <label className="text-[13px] text-slate-800">{label}</label>

      <div className="input-box">
        <input
          type={
            type == "password" ? (showPassword ? "text" : "password") : type
          } // logic to show or hide password
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e)}
        />
    
        { 
          // managing the eye icon logic 
          type == "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
