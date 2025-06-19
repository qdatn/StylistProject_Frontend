import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "@components/loading";
import { MainLayout } from "@layouts/main-layout/customer-layout";

const RouteLoadingWrapper = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // thời gian hiển thị spinner (tuỳ chỉnh)

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <>{loading ? <LoadingSpinner /> : <MainLayout />}</>;
};

export default RouteLoadingWrapper;
