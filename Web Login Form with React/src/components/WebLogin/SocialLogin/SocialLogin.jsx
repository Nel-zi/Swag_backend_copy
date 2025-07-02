import React from "react";
import OrDivider from "./OrDivider/OrDivider";
import SocialButton from "./SocialButton/SocialButton";
import "./SocialLogin.css";

const SocialLogin = () => {
  return (
    <section className="social-login">
      <OrDivider />
      <SocialButton
        type="facebook"
        text="Continue with Facebook"
        icon="https://static.codia.ai/custom_image/2025-06-18/071138/social-icon-1.svg"
        backgroundImage="https://static.codia.ai/custom_image/2025-06-18/071138/form-field-3.svg"
      />
      <SocialButton
        type="google"
        text="Continue with Google"
        icon="https://static.codia.ai/custom_image/2025-06-18/071138/social-icon-2.svg"
        backgroundImage="https://static.codia.ai/custom_image/2025-06-18/071138/form-field-4.svg"
      />
      <SocialButton
        type="apple"
        text="Continue with Apple"
        icon="https://static.codia.ai/custom_image/2025-06-18/071138/social-icon-3.svg"
        backgroundImage="https://static.codia.ai/custom_image/2025-06-18/071138/form-field-5.svg"
      />
      {/* <div className="bottom-divider"></div> */}
    </section>
  );
};

export default SocialLogin;
