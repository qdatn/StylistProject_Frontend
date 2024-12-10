export default function CustomerFooter() {
  return (
    <footer className="bg-black text-gray-300 pt-8 pb-5 justify-between items-center">
      <div className="container mx-auto grid grid-cols-3 gap-x-40 justify-between">
        <div className="space-y-4 w-full">
          <h3 className="text-sm font-bold text-gray-100 ">Customer Care</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="hover:underline text-sm text-gray-400 hover:text-gray-200"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline text-sm text-gray-400 hover:text-gray-200"
              >
                Shipping & Delivery
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline text-sm text-gray-400 hover:text-gray-200"
              >
                Returns & Exchanges
              </a>
            </li>
          </ul>
        </div>
        <div className=" space-y-4 w-full">
          <h3 className="text-sm font-bold text-gray-100">About Us</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="hover:underline text-sm text-gray-400 hover:text-gray-200"
              >
                Why REVOLVE
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline text-sm text-gray-400 hover:text-gray-200"
              >
                Stores
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline text-sm text-gray-400 hover:text-gray-200"
              >
                Careers
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col space-y-4 w-full ">
          <h3 className="text-sm font-bold text-gray-100">Social</h3>
          <ul className="space-x-4">
            <li>
              <a href="#" className="text-gray-400 hover:text-gray-200">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-gray-200">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container flex mx-auto justify-between pt-10 items-center">
        <div className="w-full md:w-1/4 flex space-y-4 items-center">
          <p className="text-xs text-gray-500 whitespace-nowrap items-center">
            2024 Eminent, Inc. (a Revolve Group company). All Rights Reserved
          </p>
        </div>
        <div>
          <ul className="space-x-4 flex-row flex">
            <li>
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-gray-200 hover:underline"
              >
              Terms
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-gray-200 hover:underline"
              >
              Privacy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
