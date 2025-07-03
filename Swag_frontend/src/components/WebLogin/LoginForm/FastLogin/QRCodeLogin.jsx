import React from "react";
import { IoArrowBack, IoClose } from "react-icons/io5";

const QRCodeLogin = ({ onBack }) => {
  return (
    <div className="bg-[#292c35] rounded-3xl w-full h-full max-w-md mx-auto flex flex-col items-center relative p-5">
      <button
        className="absolute top-8 left-8 text-2xl text-[#94ffbf] hover:text-[#6ee7b7] bg-black border-none rounded-lg cursor-pointer flex items-center justify-center z-50"
        onClick={onBack}
        aria-label="Back"
        type="button"
        style={{ width: 32, height: 32, padding: 0 }}
      >
        <IoArrowBack size={28} />
      </button>
      <div className="w-full flex items-center justify-center relative mb-4">
        <h2 className="text-[#94ffbf] text-[22px] font-semibold text-center flex-1 mt-10">
          Log in with QR code
        </h2>
        <button
          className="absolute right-2 top-4 text-2xl text-white hover:text-gray-200 border-none cursor-pointer flex items-center justify-center bg-black rounded-lg z-50"
          aria-label="Close"
          onClick={onBack}
          type="button"
          style={{ width: 32, height: 32, padding: 0 }}
        >
          <IoClose size={28} color="#94ffbf" />
        </button>
      </div>
      <div className="flex items-center justify-center mb-5">
        <div className="border border-gray-500 ">
          <div className="p-10 lg:p-20 rounded-xl flex items-center justify-center">
            <img
              src="img/Vector.png"
              alt="QR Code"
              className="w-44 h-44 rounded bg-[#18191f]"
            />
          </div>
        </div>
      </div>
      <div className="text-[#f9f9f9] text-[15px] mb-6 px-14 w-full">
        <p>1. Scan with your mobile device’s camera</p>
        <p>2. Confirm login or sign up</p>
      </div>
      <div className="border-t w-[80%] border-[#444] pt-4  flex justify-center gap-1 text-[#f9f9f9] text-[14px]">
        <span>Don’t have an account?</span>
        <span className="text-[#94ffbf] cursor-pointer ml-1">Sign up</span>
      </div>
    </div>
  );
};

export default QRCodeLogin;
