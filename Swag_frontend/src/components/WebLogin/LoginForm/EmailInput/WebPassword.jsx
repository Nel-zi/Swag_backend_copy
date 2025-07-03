import React, { useState, useEffect, useContext } from "react";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { useAuthContext } from "../../../../contexts/auth-context";
import "./WebPassword.css";
import { AUTH_PASSWORD } from "../../../../auth.js";

const WebPassword = ({sharedEmail, onBack }) => {
  const { login } = useAuthContext();//useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => setError(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(sharedEmail, password);
    } catch {
      setError(true);
    }
/*
    if (password === "mmt@4321") {
      setError(false);
      // Success logic here (e.g., redirect, close modal, etc.)
      alert(sharedEmail);
    } else {
      setError(true);
    }*/
  };

  return (
    <div className="bg-[#292c35] rounded-3xl w-full h-full max-w-md mx-auto flex flex-col items-center relative">
      <button
        className="absolute top-4 left-4 text-2xl text-[#94ffbf] hover:text-[#6ee7b7] bg-black border-none rounded-lg cursor-pointer flex items-center justify-center z-50"
        onClick={onBack}
        aria-label="Back"
        type="button"
        style={{ width: 32, height: 32, padding: 0 }}
      >
        <IoArrowBack size={28} />
      </button>
      <div className="w-full flex items-center justify-center relative mb-4">
        <div className="flex flex-col items-center justify-center w-[70%]">
          <h2 className="text-[#94ffbf] text-[22px] font-semibold text-center flex-1 mt-10 ">
            Log in
          </h2>
          <hr className="w-[310.991px] h-[0.25px] mb-3 mt-8 border-0 bg-white opacity-60" />
        </div>

        <button
          className="absolute right-5 top-4 text-2xl text-white hover:text-gray-200 border-none cursor-pointer flex items-center justify-center bg-black rounded-lg z-50"
          aria-label="Close"
          onClick={onBack}
          type="button"
          style={{ width: 32, height: 32, padding: 0 }}
        >
          <IoClose size={28} color="#94ffbf"/>
        </button>
      </div>
      <form
        className="flex flex-col items-center w-full px-14"
        onSubmit={handlePasswordSubmit}
        autoComplete="off"
      >
        <p className="text-[#f9f9f9] text-[15px] mb-6 w-full text-center">
          Enter your password!
        </p>
        <div
          className={`flex items-center bg-[#111118] px-5 py-3 rounded-xl w-full mb-6 ${
            error ? "border-2 border-red-500" : ""
          }`}
        >
          <img src="/img/lockicon.svg" alt="lock" className="w-5 h-5 mr-3" />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className="bg-transparent border-none outline-none text-white text-[18px] flex-1"
            placeholder="**********"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="mb-10 bg-[#a4ffaf] text-white font-bold text-[18px] rounded-xl w-full py-3   transition-colors"
        >
          Login
        </button>
      </form>
      {error && (
        <div className="w-full mt-4 bg-red-500 rounded-2xl">
          <p className="text-white text-center mx-2 py-4 font-semibold">
            Password does not match! Please try again!
          </p>
        </div>
      )}
    </div>
  );
};

export default WebPassword;
