import React, { useState } from "react";
import { UserAccount } from "@src/types/UserAccount";
import { Button, Input } from "antd";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { User } from "@src/types/auth/AuthType";

interface AccountDetailsProps {
  initialUser: Partial<UserAccount>;
  onSave: (user: Partial<UserAccount>) => void;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ initialUser = {}, onSave }) => {
  const [user, setUser] = useState<Partial<UserAccount>>(initialUser);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    // Safely check for `user.name` and other properties
    if (!user.name) newErrors.name = "User name is required.";
    if (!user.phone_number) newErrors.phone_number = "Phone number is required.";
    if (!user.user?.email) newErrors.email = "Email is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (validate()) {
      console.log("Saving user:", user);
      onSave(user);
    }
  };

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
            Full Name*
          </label>
          <input
            type="text"
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">
            Phone Number*
          </label>
          <input
            type="text"
            name="phone_number"
            value={user.phone_number || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          {errors.phone_number && (
            <span className="text-red-500">{errors.phone_number}</span>
          )}
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
              value={user ? user.user?.email : ""}
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

      <div className="flex flex-row gap-2 justify-end">
        <Button
          onClick={handleSave}
          className="text-[16px] p-4 w-32 mt-6"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default AccountDetails;
