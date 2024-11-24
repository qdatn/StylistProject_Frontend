import { AiOutlineHeart } from "react-icons/ai";
import { IoBagHandleOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { useEffect, useState } from "react";
import axiosClient from "@api/axiosClient";
import { clearUser } from "@redux/reducers/authReducer";
import { Badge, notification } from "antd";
import { selectCartCount } from "@redux/reducers/cartReducer";
import { ProductList } from "@src/types/Product";

const baseUrl = import.meta.env.VITE_API_URL;
export default function CustomerHeader() {
  const user = useSelector((state: RootState) => state.persist.auth);
  const isLogin = useSelector((state: RootState) => state.persist.auth.isLogin);
  const cartCount = useSelector(selectCartCount);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  // State to manage hover visibility
  const [showPopup, setShowPopup] = useState(false);

  // Search click
  const handleSearch = async (e: any) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      try {
        // Gọi API tìm kiếm
        const response = await axiosClient.getOne<ProductList>(
          `${baseUrl}/api/product/search?name=${searchTerm}`
        );
        console.log("SEARCH", response);
        console.log("SEARCHQUERY", searchTerm);

        // Chuyển tới trang kết quả và truyền dữ liệu sản phẩm nếu cần
        navigate("/product/search", { state: { searchquery: searchTerm } });
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  // Function to handle hover events
  const handleProfileClick = () => {
    if (isLogin) {
      setShowPopup(!showPopup);
    } else {
      navigate("/login");
    }
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handleLogout = () => {
    try {
      dispatch(clearUser());
      const logout = axiosClient.post(
        "http://localhost:5000/api/auth/logout",
        {}
      );
      navigate("/login");
      notification.success({
        message: "Logout successful!",
        description: "You have successfully logged out!",
        placement: "topRight",
        duration: 1,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Can't set redux state properly.",
        placement: "topRight",
      });
    }
  };

  return (
    // <!-- header -->
    <header className="border-y-">
      <div className="bg-white shadow-md">
        {/* Nav header bar 1 */}
        <div className="mx-auto container py-2 flex justify-between border-y-2 px-4 md:px-20 flex-wrap">
          {/* <!-- Logo and Brand Name on the left side --> */}
          <div className="flex items-center">
            <Link to="/" className="text-lg font-bold text-gray-800">
              STYLE
            </Link>
          </div>
          {/* <!-- login sign up nav on the right side --> */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="#"
              className="text-sm text-gray-700 hover:underline hover:text-gray-900 font-medium transition"
            >
              Need help?
            </Link>
            {/* Chỉ hiển thị "Log in" và "Sign up" nếu người dùng chưa đăng nhập */}
            {!user.isLogin ? (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:underline hover:text-gray-900 font-medium transition uppercase"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-gray-700 hover:underline transition font-bold uppercase"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <></>
            )}
            {/* <Link
              to="/login"
              className="text-sm text-gray-700 hover:underline hover:text-gray-900 font-medium transition uppercase"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm text-gray-700 hover:underline transition font-bold uppercase"
            >
              Sign up
            </Link> */}
          </div>
        </div>
        {/* Nav header bar 2 */}

        <div className="flex items-center justify-between px-4 md:px-20 py-4 flex-wrap">
          {/* <!-- Navigation Links for Medium and Above Screens --> */}

          <div className="hidden md:flex space-x-8">
            <Link
              to="#"
              className="text-gray-700 hover:underline hover:text-gray-900 transition font-bold underline"
            >
              Women
            </Link>
            <Link
              to="#"
              className="text-gray-700 hover:underline hover:text-gray-900 font-medium transition"
            >
              Men
            </Link>
            <Link
              to="#"
              className="text-gray-700 hover:underline hover:text-gray-900 font-medium transition"
            >
              Style
            </Link>
          </div>
          <Link
            to="/"
            className="text-3xl tracking-wider font-bold text-gray-800 ml-16 md:ml-0"
          >
            STYLE
          </Link>
          {/* <!-- Search and Icons Section --> */}
          <div className="flex items-center space-x-6">
            {/* <!-- Search Bar --> */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-5 pr-5 py-2 border border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => handleSearch({ key: "Enter" })}
              >
                <IoIosSearch />
              </button>
            </div>

            {/* <!-- Account Icon --> */}
            <div className="flex-col items-center">
              <div
                // to={user.auth.isLogin ? "/account" : "/login"}
                className="flex items-center text-gray-700 hover:bg-gray-50 px- hover:rounded py-2 cursor-pointer"
                onClick={handleProfileClick}
                // onMouseLeave={handleMouseLeave}
              >
                <Badge offset={[10, 0]}>
                  <AiOutlineUser className="text-2xl" />
                </Badge>
                {/* <AiOutlineUser className="w-5 h-5" /> */}
              </div>
              {/* Popup (visible on hover) */}
              {showPopup && user.isLogin && (
                <div
                  className="absolute mt-2 w-40 p-2 bg-white border rounded-lg shadow-md z-10"
                  // onClick={handleProfileClick}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* <!-- Cart Icon --> */}
            {user && (
              <Link
                to={user.isLogin ? "/cart" : "/login"}
                className="flex items-center text-gray-700 hover:bg-gray-50 px-2 hover:rounded"
              >
                {/* <IoBagHandleOutline className="w-5 h-5" />
                <div className="flex px-4 py-2 text-red-400 hover:underline hover:text-gray-900 transition">
                  {cartCount}
                </div>  */}
                <Badge count={cartCount} offset={[10, 0]}>
                  <IoBagHandleOutline className="text-2xl" />
                </Badge>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* <!-- Menu Header Bar --> */}
      <nav className="bg-white">
        <div className="container mx-auto px-6 py-3">
          <ul className="flex space-x-6 justify-center gap-16 flex-wrap">
            <li>
              <Link
                to="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                NEW TODAY
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                CLOTHING
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                DRESSES
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                ACCESSORIES
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                BRANDS
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                SALE
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
