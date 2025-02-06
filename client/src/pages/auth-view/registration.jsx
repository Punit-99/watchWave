import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CommonForm from "@/components/common/commonForm";
import { registerFormControls } from "../../config/formFields";
import { registerUser } from "../../store/auth-slice/authSlice";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const Registration = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        console.log(data, true);

        navigate("/auth/login");
      } else {
        console.log(false);
        // toast
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create new account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?
            <Link
              className="font-medium text-indigo-600 hover:text-indigo-500"
              to="/auth/login"
            >
              Login
            </Link>
          </p>
        </div>
        <CommonForm
          formControls={registerFormControls}
          buttonText={"Sign Up"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default Registration;
