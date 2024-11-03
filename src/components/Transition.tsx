// components/Transition.js
import { useEffect, useState } from "react";

const Transition = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <div
      className={`transition-container ${isMounted ? "fade-in" : "fade-out"}`}
    >
      {children}
      <style jsx="true">{`
        .transition-container {
          transition: opacity 0.5s ease-in-out;
          opacity: 0;
        }
        .fade-in {
          opacity: 1;
        }
        .fade-out {
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Transition;
