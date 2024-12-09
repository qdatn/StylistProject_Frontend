import React from "react";

// Dữ liệu giả cho banner
const banner = {
  image: "./src/public/assets/images/banner.jpg",
  title: "Welcome to Our Fashion Store",
  subtitle: "Explore the latest collections",
};

const Banner: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Banner Image */}
      <img
        src={banner.image}
        alt={banner.title}
        className="w-full h-full object-cover"
      />

      {/* Overlay Text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10">
        <h1 className="text-4xl font-semibold">{banner.title}</h1>
        <p className="mt-2 text-xl">{banner.subtitle}</p>
      </div>
    </div>
  );
};

export default Banner;
