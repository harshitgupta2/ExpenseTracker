import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../../Utils/helper";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  
  
  //function for signUp form

  const hadleSignUp = async (e) => {
    e.preventDefault();

    if(!fullName){
      setError("Enter your full name");
      return;
    }
    if(!validateEmail(email)){
      setError("Enter a valid email")
      return;
    }
    if(!password){
      setError("Enter a password")
      return;
    }
    setError("")

    // Fetch backend Api 

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
           <div className=' '>
             <Input
              type="password"
              label="Password"
              placeholder=""
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
           </div>
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
           
                    <button className='btn-primary' type='submit'>
                     SignUp
                    </button>
           
                    <p className='text-[13px] text-slate-800 mt-3'>
                     Already have an account{" "}
                     <Link className="font-medium text-primary underline" to ="/login">
                       Login
                     </Link>
                    </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
