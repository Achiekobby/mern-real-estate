import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Link, useNavigate } from "react-router-dom";
import {BiError} from "react-icons/bi"

export default function SignUp() {
  const [form_data, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    phone_number: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    console.log(form_data);
  };

  const handlePhoneNumberChange = (phone) => {
    const cleanedPhone = phone.startsWith("+2330")
      ? `+233${phone.slice(5)}`
      : phone;
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone_number: cleanedPhone,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form_data),
      });
      const data = await response.json();
      if (data.status === "failed") {
        setLoading(false);
        setError(data.message);
        return;
      }
      if (data.errors && data.errors.length > 0) {
        setLoading(false);
        data.errors.forEach((error) => {
          const match = error.match(/"([^"]*)"/);
          const error_message = match && match[1];
          switch (error_message) {
            case "email":
              setValidationError((prevValidationError) => ({
                ...prevValidationError,
                email: error.replace(/"([^"]*)"/, '$1'),
              }));
              break;
            case "first_name":
              setValidationError((prevValidationError) => ({
                ...prevValidationError,
                first_name: error.replace(/"([^"]*)"/, '$1'),
              }));
              break;
            case "last_name":
              setValidationError((prevValidationError) => ({
                ...prevValidationError,
                last_name: error.replace(/"([^"]*)"/, '$1'),
              }));
              break;
            case "password":
              setValidationError((prevValidationError) => ({
                ...prevValidationError,
                password: error.replace(/"([^"]*)"/, '$1'),
              }));
              break;
            case "phone_number":
              setValidationError((prevValidationError) => ({
                ...prevValidationError,
                phone_number: error.replace(/"([^"]*)"/, '$1')
              }));
              break;

            default:
              break;
          }
        });
        return;
      }
      setLoading(false);
      setError(null)
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error);
      console.log("error:", error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      {error && <p className="capitalize text-xs text-red-700">{error}</p>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={form_data.first_name}
          type="text"
          placeholder="First Name"
          className="border p-3 rounded-lg"
          name="first_name"
        />
        {validationError.first_name && (
          <>
          <p className="flex items-center capitalize text-xs text-red-400">
          <span>
            <BiError className="text-red-600 text-sm mr-2" />
          </span>
          {validationError.first_name}
          </p>
          </>
        )}
        <input
          onChange={handleChange}
          value={form_data.last_name}
          type="text"
          placeholder="Last Name"
          className="border p-3 rounded-lg"
          id="last_name"
          name="last_name"
        />
        {validationError.last_name && (
          <>
          <p className="flex items-center capitalize text-xs text-red-400">
          <span>
            <BiError className="text-red-600 text-sm mr-2" />
          </span>
          {validationError.last_name}
          </p>
          </>
        )}
        <input
          onChange={handleChange}
          value={form_data.email}
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          name="email"
        />
        {validationError.email && (
          <>
          <p className="flex items-center capitalize text-xs text-red-400">
          <span>
            <BiError className="text-red-600 text-sm mr-2" />
          </span>
          {validationError.email}
          </p>
          </>
        )}

        <div className="border p-3 rounded-lg bg-white">
          <PhoneInput
            inputClassName="react-international-phone-height"
            defaultCountry="gh"
            name="phone"
            onChange={handlePhoneNumberChange}
            value={form_data.phone}
            style={{
              "--react-international-phone-border-radius": "10px",
              "--react-international-phone-border-color": "#fff",
              "--react-international-phone-height": "27px",
              "--react-international-phone-country-selector-background-color":
                "#fff",
            }}
          />
        </div>
        {validationError.phone_number && (
          <>
          <p className="flex items-center capitalize text-xs text-red-400">
          <span>
            <BiError className="text-red-600 text-sm mr-2" />
          </span>
          {validationError.phone_number}
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
        {validationError.password && (
          <>
          <p className="flex items-center capitalize text-xs text-red-400">
          <span>
            <BiError className="text-red-600 text-sm mr-2" />
          </span>
          {validationError.password}
          </p>
          </>
        )}
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading" : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5 text-center">
        <p className="text-slate-800">Have an Account? </p>
        <Link to="/sign-in">
          <span className="text-green-700">Sign-In</span>
        </Link>
      </div>
    </div>
  );
}
