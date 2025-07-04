import React from "react";

const products = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    store: "nikestores",
    image: `img/image-${12 + (i % 6)}.png`, // cycles 12,13,14,15,16,17
    title: "Women's Materials ",
    subtitle: "Random Stuff",
    price: "$10",
    status: "Live • 25",
    used: "Used | Live",
  })),
];

const Homepage = ({ product }) => {
  const [checked, setChecked] = React.useState(false);
  const [liked, setLiked] = React.useState(false);

  return (
    <div className="bg-[#23232a] rounded-2xl w-full max-w-[224px] flex flex-col relative">
      {/* Top: Store and Checkbox */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 transition-colors duration-200 
              ${
                checked
                  ? "bg-[#59cca4] border-[#59cca4]"
                  : "bg-[#23232a] border-[#59cca4]"
              }
              appearance-none flex items-center justify-center focus:ring-0 focus:outline-none
            `}
            style={{ position: "relative" }}
          />
          {/* {checked && (
            <svg
              className="absolute ml-0.5 pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5 10.5L9 14.5L15 7.5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )} */}
          <span className="text-white font-poppins font-semibold text-sm sm:text-base">
            {product.store}
          </span>
        </div>
      </div>
      {/* Product Image */}
      <div className="flex justify-center items-center relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-auto sm:h-72 object-contain rounded-2xl"
        />
        <button
          className={`absolute top-2 right-2 rounded-lg p-1 border-2 transition-colors duration-200 flex items-center justify-center border-transparent bg-black`}
          onClick={() => setLiked(!liked)}
        >
          <svg
            width="20"
            height="20"
            sm:width="25"
            sm:height="25"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={liked ? "#23E6A7" : "none"}
              stroke="#23E6A7"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
      {/* Live badge */}
      <span className="absolute bottom-20 right-2 bg-[#23E6A7] text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
        {product.status}
      </span>
      {/* Product Info */}
      <div className="mt-2">
        <div className="text-white font-poppins font-semibold text-xs sm:text-sm leading-tight">
          {product.title}
        </div>
        <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs">
          <span className="text-[#23E6A7] font-bold font-poppins">
            {product.subtitle}
          </span>
          <span className="text-[#bdbdbd] font-poppins text-xs">
            • Starts {product.price}
          </span>
        </div>
        <div className="text-[#bdbdbd] font-poppins text-xs mt-1">
          {product.used}
        </div>
      </div>
    </div>
  );
};

const homepage = () => (
  <div
    className=" hide-scrollbar pb-10 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 max-h-screen overflow-y-auto "
    // style={{
    //   scrollbarWidth: "thin",
    //   scrollbarColor: "#59cca4 #23232a",
    // }}
  >
    {products.map((product) => (
      <Homepage key={product.id} product={product} />
    ))}
  </div>
);

export default homepage;
