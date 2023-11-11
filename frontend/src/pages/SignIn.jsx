import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiError } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import {
  sign_in_start,
  sign_in_success,
  sign_in_failure,
  failed_validation
} from "../redux/user/userSlice";

export default function SignIn() {
  const [form_data, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  //* Redux operations
  const dispatch = useDispatch();

  //* reading the values of the error and the loading without using useState hook
  const { error, loading, validationErrors } = useSelector((state) => state.user);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    console.log(form_data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(sign_in_start());
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form_data),
      });
      const data = await response.json();
      if (data.status === "failed") {
        dispatch(sign_in_failure(data.message));
        return;
      }
      if (data.errors && data.errors.length > 0) {
        dispatch(failed_validation(data.errors))
        return;
      }
      dispatch(sign_in_success(data));
      navigate("/");
    } catch (error) {
      dispatch(sign_in_failure(error.message));
      console.log("error:", error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      {error && <p className="capitalize text-xs text-red-700">{error}</p>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={form_data.email}
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          name="email"
        />
        {validationErrors.email && (
          <>
            <p className="flex items-center capitalize text-xs text-red-400">
              <span>
                <BiError className="text-red-600 text-sm mr-2" />
              </span>
              {validationErrors.email}
            </p>
          </>
        )}

        <input
          type="password"
          placeholder="Password***"
          className="border p-3 rounded-lg"
          name="password"
          onChange={handleChange}
          value={form_data.password}
        />
        {validationErrors.password && (
          <>
            <p className="flex items-center capitalize text-xs text-red-400">
              <span>
                <BiError className="text-red-600 text-sm mr-2" />
              </span>
              {validationErrors.password}
            </p>
          </>
        )}
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading" : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5 text-center">
        <p className="text-slate-800">{"Don't have an Account?"} </p>
        <Link to="/sign-in">
          <span className="text-green-700">Sign-In</span>
        </Link>
      </div>
    </div>
  );
}
