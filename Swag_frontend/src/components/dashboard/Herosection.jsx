import React, { useState } from "react";
import ProductCard from "./ProductCard";
import Homepage from "../homepage/homepage";

const suggestions = [
  "For You",
  "Sneakers & Streetwear",
  "Watches",
  "Sports Cards",
  "Pokémon Cards",
  "Toys & Hobbies",
  "Comics",
];

const images = [
  "img/main-image-1.png",
  "img/main-image-2.png",
  "img/main-image-3.png",
];

const Herosection = ({ isLoggedIn }) => {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="w-full bg-[#23232a] px-8 py-6 flex items-center min-h-[80px]">
        <div className="flex ml-10 gap-5 w-full items-center overflow-auto py-2">
          {suggestions.map((item, idx) => (
            <button
              key={item}
              onClick={() => setActive(idx)}
              className={`min-w-fit px-6 py-2 rounded-full font-semibold md:text-base text-sm transition-all duration-200 font-poppins focus:outline-none 
              ${
                active === idx
                  ? "bg-gradient-to-r from-[#007F7D] via-[#59CCA4] to-[#94FFBF] text-white shadow-lg shadow-black/10"
                  : "bg-[#292C35] text-white hover:bg-[#35363f]"
              }
            `}
            >
              {item}
            </button>
          ))}
          <div className="flex-1" />
          <button className="text-[#8E8E8E] font-poppins font-semibold text-base  focus:outline-none ml-4 min-w-fit">
            View All
          </button>
        </div>
      </div>
      {!isLoggedIn && (
        <div>
          <h2 className="text-white text-xl md:text-2xl font-bold mb-0 m-5">
            Trending SWAG
          </h2>
          <div className="flex gap-4 overflow-x-auto lg:px-10">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-screen h-auto md:w-[432px] md:h-[283px] flex-shrink-0"
              >
                {/* Live badge */}
                <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#23e6a7] text-red-600 text-sm font-bold px-4 py-1 rounded-full z-10">
                  LIVE
                </span>
                {/* Image */}
                <img
                  src={img}
                  alt={`Trending SWAG ${idx + 1}`}
                  className="w-screen h-auto md:w-[432px] md:h-[283px] object-cover rounded-2xl p-2"
                />
                {/* Views badge */}
                <span className="absolute bottom-3 right-4 bg-[#23e6a7] text-black text-xs font-semibold px-2 py-1 rounded-full z-10">
                  43234 V
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {!isLoggedIn && (
        <h2 className="text-white text-xl md:text-2xl font-bold m-5">
          Live on SWAG
        </h2>
      )}
      <div className="px-5">{isLoggedIn ? <ProductCard /> : <Homepage />}</div>
    </>
  );
};

export default Herosection;
