import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "@components/loading";

const RouteLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // thời gian hiển thị spinner (tuỳ chỉnh)

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <>{loading ? <LoadingSpinner /> : children}</>;
};

export default RouteLoadingWrapper;
