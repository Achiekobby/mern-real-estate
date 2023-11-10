import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [form_data, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    console.log(form_data);
  };

  const handlePhoneNumberChange = (phone) => {
    const cleanedPhone = phone.startsWith('+2330') ? `+233${phone.slice(5)}` : phone;
    setFormData((prevFormData) => ({ ...prevFormData, phone_number: cleanedPhone }));
  };

  const handleSubmit=(event)=>{
    event.preventDefault();
    console.log(form_data);
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={form_data.first_name}
          type="text"
          placeholder="First Name"
          className="border p-3 rounded-lg"
          name="first_name"
        />
        <input
          onChange={handleChange}
          value={form_data.last_name}
          type="text"
          placeholder="Last Name"
          className="border p-3 rounded-lg"
          id="last_name"
          name="last_name"
        />
        <input
          onChange={handleChange}
          value={form_data.email}
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          name="email"
        />

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
        <input
          type="password"
          placeholder="Password***"
          className="border p-3 rounded-lg"
          name="password"
          onChange={handleChange}
          value={form_data.password}
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Sign Up
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
