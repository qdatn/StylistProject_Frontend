import React from "react";
import { UserAccount } from "@src/types/UserAccount";
import { Button, Input } from "antd";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface AccountDetailsProps {
  user: UserAccount | null;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ user }) => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  return (
    <div className="w-3/4 bg-white p-7 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">MY DETAILS</h2>
      <p className="text-gray-600 mb-4">
        Feel free to edit any of your details below so your account is totally
        up to date. (* Indicates a required field).
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">
            First Name*
          </label>
          <input
            type="text"
            value={user ? user.name.split(" ")[0] : ""}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">
            Last Name*
          </label>
          <input
            type="text"
            value={user ? user.name.split(" ").slice(1).join(" ") : ""}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">
            Email Address*
          </label>
          {/* <input
            type="email"
            value={user ? user.user.email : ""}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            readOnly
          /> */}
          <div className="inline w-full">
            <Input.Password
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={user ? user.user.email : ""}
              placeholder="email"
              iconRender={(visible) =>
                visible ? (
                  <AiFillEye size={24} />
                ) : (
                  <AiFillEyeInvisible size={24} />
                )
              }
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
            />
            <Button
              style={{ width: "auto" }}
              onClick={() => setPasswordVisible((prevState) => !prevState)}
              className="mt-3"
            >
              {passwordVisible ? "Hide email" : "Show email"}
            </Button>
          </div>
        </div>

        {/* Thêm các trường khác ở đây */}
      </div>

      <button
        className="mt-6 w-full bg-gray-400 text-white py-2 rounded-lg font-semibold cursor-not-allowed"
        disabled
      >
        SAVE CHANGES
      </button>
    </div>
  );
};

export default AccountDetails;
