import { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { AdminLayout } from "@layouts/admin-layout/admin-layout";
import { Navigate, replace, useLocation } from "react-router-dom";
import { MainLayout } from "@layouts/main-layout/customer-layout";

interface RequireAuthProps {
  role: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ role }) => {
  const user = useSelector((state: RootState) => state.auth.auth);
  const location = useLocation();

  if (role === "guest") {
    return <MainLayout />;
  } else if (!user.isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else if (
    user.isLogin &&
    user.user?.user.role === role &&
    role === "admin"
  ) {
    return <AdminLayout />;
  } else if (
    user.isLogin &&
    user.user?.user.role === role &&
    role === "customer"
  ) {
    return <MainLayout />;
  }
};
export default RequireAuth;
