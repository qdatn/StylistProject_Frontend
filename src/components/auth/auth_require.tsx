import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AdminLayout } from "@layouts/admin-layout/admin-layout";
import { Navigate, replace, useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "@layouts/main-layout/customer-layout";
import { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { clearUser } from "@redux/reducers/authReducer";

interface RequireAuthProps {
  role: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ role }) => {
  const user = useSelector((state: RootState) => state.persist.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.isLogin && user.user?.token) {
      const decoded: { exp: number } = jwtDecode(user.user?.token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        dispatch(clearUser());
        navigate('/login', { state: { from: location }, replace: true });
      }
    }
  }, [user, dispatch, navigate, location]);

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
  }else {
    return <MainLayout />;
  }
};
export default RequireAuth;
