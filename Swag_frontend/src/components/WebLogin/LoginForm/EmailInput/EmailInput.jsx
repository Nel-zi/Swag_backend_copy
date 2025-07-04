import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./EmailInput.css";
import { verifyIdentifier } from "../../../../api.js";
import axios from "axios";
import { AUTH_EMAIL } from "../../../../auth.js";

const EmailInput = ({ showLoginError, onSwitchToPassword, setSharedEmail }) => {
  const [showError, setShowError] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: async (values) => {},
  });

  const handleLoginClick = async (e) => {
    e.preventDefault();
    if (showLoginError) showLoginError(false); // hide error on new attempt
    formik.setTouched({ email: true });
    const errors = await formik.validateForm();
    setSharedEmail(formik.values.email);

    setShowError(true);
    if (showLoginError) showLoginError(true);

    //////// API Connection ////////
    const exists = await verifyIdentifier(formik.values.email);
    console.log("Email exists:", exists);
    if (exists) {
      if (onSwitchToPassword) onSwitchToPassword();
      setShowError(false);
      if (showLoginError) showLoginError(false);
    } else {
      setShowError(true);
      if (showLoginError) showLoginError(true);
    }

    /*
    if (errors.email) {
      setShowError(true);
      if (showLoginError) showLoginError(false);
    } else if (formik.values.email !== AUTH_EMAIL) {
      setShowError(true);
      if (showLoginError) showLoginError(true);
    } else {
      setShowError(false);
      if (showLoginError) showLoginError(false);
      if (setEmail) setEmail(formik.values.email); // <-- set email for parent
      formik.handleSubmit();
      // Switch to password component if email is mmt@gmail.com
      //if (onSwitchToPassword) onSwitchToPassword();
      alert('page wouldve switched');
      return;
    }
    */
  };

  const handleInputChange = (e) => {
    formik.handleChange(e);
    if (showError) setShowError(false);
    if (showLoginError) showLoginError(false);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="email-input">
        <label className="text-center text-sm flex justify-center my-2 text-white">
          Email, Phone Number or Username
        </label>
        <div className="email-input-container flex mx-auto ">
          <input
            type="text"
            placeholder="Type Email...."
            className={`email-input-field ${showError ? "error-field" : ""}`}
            name="email"
            onChange={handleInputChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <div className="user-icon"></div>
        </div>
      </div>
      <button
        className="login-button  mx-auto flex md:my-5"
        onClick={handleLoginClick}
      >
        <span className="login-button-text">Login</span>
      </button>
    </form>
  );
};

export default EmailInput;
