import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./EmailInput.css";
import { verifyIdentifier } from "../../../../api.js"; // backend API
import axios from 'axios';


const EmailInput = ({ showLoginError, onSwitchToPassword }) => {
  const API_URL = 'http://192.168.225.158:8000'

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
    if (errors.email) {
      setShowError(true);
      if (showLoginError) showLoginError(false);
    } else if (formik.values.email !== "mmt@gmail.com") {
      setShowError(true);
      if (showLoginError) showLoginError(true);
    } else {
      setShowError(false);
      if (showLoginError) showLoginError(false);
      formik.handleSubmit();
    }

    ///////// Connected to backend API ////////
    const result = await verifyIdentifier(formik.values.email); // returns true if input is in system
    if (result) {
      onSwitchToPassword;
    } else {
      setShowError(true);
      if (showLoginError) showLoginError(true);
    }

  };

  const handleInputChange = (e) => {
    formik.handleChange(e);
    if (showError) setShowError(false);
    if (showLoginError) showLoginError(false);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="email-input">
        <label className="email-label">Email, Phone Number or Username</label>
        <div className="email-input-container">
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
      <button className="login-button" onClick={handleLoginClick}>
        <span className="login-button-text">Login</span>
      </button>
    </form>
  );
};

export default EmailInput;
