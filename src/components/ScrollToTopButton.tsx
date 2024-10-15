// components/ScrollToTopButton.tsx
import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Hàm để kiểm tra khi cuộn xuống dưới
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      // Hiển thị nút khi cuộn xuống 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Thêm event listener khi component mount
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg transition-opacity ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </button>
  );
};

export default ScrollToTopButton;
