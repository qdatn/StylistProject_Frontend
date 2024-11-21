import React, { useEffect, useState } from "react";

// Dữ liệu giả cho slider
const slides = [
  {
    id: 1,
    image: "./src/public/assets/images/slide1.jpg",
    title: "Slide 1",
  },
  {
    id: 2,
    image: "./src/public/assets/images/slide2.jpg",
    title: "Slide 2",
  },
  {
    id: 3,
    image: "./src/public/assets/images/slide3.jpg",
    title: "Slide 3",
  },
  {
    id: 4,
    image: "./src/public/assets/images/slide4.jpg",
    title: "Slide 4",
  },
];

const Slider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Tự động chuyển slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 giây chuyển slide

    return () => clearInterval(interval);
  }, []);

  // Chuyển slide qua click vào nút
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slider Images */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full object-cover aspect-[16/9]" // Đảm bảo ảnh không bị giãn, luôn giữ tỷ lệ 16:9
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="text-white text-4xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        >
          &#10094;
        </button>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="text-white text-4xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Slider;
