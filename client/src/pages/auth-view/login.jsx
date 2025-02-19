import { useState } from "react";
import { Link } from "react-router-dom";
import CommonForm from "../../components/common/common-Form/commonForm";
import { LoginFormControl } from "../../config/formFields"; // Updated import statement
import { loginUser } from "../../store/auth-slice/authSlice"; // Ensure this import is correct
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success("Successfully Logged In!");
      } else {
        //  toast
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account?
            <Link
              className="font-medium text-indigo-600 hover:text-indigo-500"
              to="/auth/register"
            >
              Register
            </Link>
          </p>
        </div>

        <CommonForm
          formData={formData}
          buttonText={"Sign In"}
          formControls={LoginFormControl}
          setFormData={setFormData}
          isButtonDisabled={false}
          handleSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default Login;
