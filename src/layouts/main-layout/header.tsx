import { AiOutlineHeart } from "react-icons/ai";
import { IoBagHandleOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";

export default function Header() {
  return (
    // <!-- header -->
    <header className="border-y-2">
      <div className="bg-white shadow-md">
        {/* Nav header bar 1 */}
        <div className="mx-auto container py-2 flex justify-between border-y-2 px-4 md:px-20 flex-wrap">
          {/* <!-- Logo and Brand Name on the left side --> */}
          <div className="flex items-center">
            <Link href="/" className="text-lg font-bold text-gray-800">
              STYLE
            </Link>
          </div>
          {/* <!-- login sign up nav on the right side --> */}
          <div className="hidden md:flex space-x-4">
            <a
              href="#"
              className="text-sm text-gray-700 hover:underline hover:text-gray-900 font-medium transition"
            >
              Need help?
            </a>
            <a
              href="/login"
              className="text-sm text-gray-700 hover:underline hover:text-gray-900 font-medium transition uppercase"
            >
              Log in
            </a>
            <a
              href="/register"
              className="text-sm text-gray-700 hover:underline transition font-bold uppercase"
            >
              Sign up
            </a>
          </div>
        </div>
        {/* Nav header bar 2 */}

        <div className="flex items-center justify-between px-4 md:px-20 py-4 flex-wrap">
          {/* <!-- Navigation Links for Medium and Above Screens --> */}

          <div className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:underline hover:text-gray-900 transition font-bold underline"
            >
              Women
            </a>
            <a
              href="#"
              className="text-gray-700 hover:underline hover:text-gray-900 font-medium transition"
            >
              Men
            </a>
            <a
              href="#"
              className="text-gray-700 hover:underline hover:text-gray-900 font-medium transition"
            >
              Style
            </a>
          </div>
          <Link
            href="/"
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
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <IoIosSearch />
              </button>
            </div>
            {/* <!-- Love Icon --> */}
            <a
              href="/favorist_list"
              className="flex items-center text-gray-700 hover:bg-gray-50 px-2 hover:rounded"
            >
              <AiOutlineHeart className="w-5 h-5" />
              <div className="flex px-4 py-2 text-red-400 hover:underline hover:text-gray-900 transition">
                0
              </div>
            </a>

            {/* <!-- Cart Icon --> */}
            <a
              href="/cart"
              className="flex items-center text-gray-700 hover:bg-gray-50 px-2 hover:rounded"
            >
              <IoBagHandleOutline className="w-5 h-5" />
              <div className="flex px-4 py-2 text-red-400 hover:underline hover:text-gray-900 transition">
                0
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* <!-- Menu Header Bar --> */}
      <nav className="bg-white">
        <div className="container mx-auto px-6 py-3">
          <ul className="flex space-x-6 justify-center gap-16 flex-wrap">
            <li>
              <a
                href="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                NEW TODAY
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                CLOTHING
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                DRESSES
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                ACCESSORIES
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                BRANDS
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:underline hover:text-gray-900 font-semibold transition"
              >
                SALE
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
