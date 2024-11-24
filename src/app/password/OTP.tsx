import axiosClient from "@api/axiosClient";
import { Input, notification } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const OTPForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "https://localhost:5000";
  const navigate = useNavigate();

  const location = useLocation();
  const { registerData, status } = location.state;
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    console.log(otp);
  }, [otp]);

  const handleOTPClick = async (e: React.MouseEvent) => {
    if (status === "register") {
      setIsLoading(true);
      try {
        // Step 1: Verify OTP
        const verifyOTPRes: any = await axiosClient.post(
          `${apiUrl}/api/auth/verify`,
          {
            email: registerData.email.toString(),
            otp: otp.toString().trim(),
          }
        );

        // Step 2: Proceed with registration if OTP is verified
        // if (verifyOTPRes.status === 200) {
        const createAccountRes: any = axiosClient.post(
          `${apiUrl}/api/auth/register`,
          registerData
        );

        // Step 3: Handle the response for account creation
        // if (createAccountRes.status === 200) {
        // alert("Registration success!");
        navigate("/login");
        notification.success({
          message: "Account have been Register. Please login!",
          // description: "You have successfully logged out!",
          placement: "topRight",
          duration: 2,
        });
      } catch (err: any) {
        alert("Error: " + err.response.data.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 ">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Enter OTP
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please enter the 6-digit OTP we have sent to you.
        </p>

        <div className="flex justify-center gap-4 mb-6">
          <Input.OTP
            formatter={(str) => str.toUpperCase()}
            onChange={(value) => {
              setOtp(value);
            }}
            // {...sharedProps}
          />
        </div>

        {/* 
        <InputOTP
          containerClassName="flex justify-center gap-4 mb-6"
          maxLength={6}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP> */}

        <button
          onClick={handleOTPClick}
          className="w-full py-2 text-white font-semibold bg-gray-800 rounded-sm hover:bg-gray-600"
        >
          {isLoading ? (
            <span>Checking...</span> // You can replace this with a spinner or a loading text
          ) : (
            "Confirm"
          )}
        </button>
      </div>
    </div>
  );
};
