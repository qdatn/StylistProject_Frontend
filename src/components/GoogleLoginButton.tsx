import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
// import { GoogleLogin} from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {
  const handleSuccess = (credentialResponse: any) => {
    console.log("Login Success", credentialResponse);
    // You can handle authentication success here, e.g., send token to backend
  };

  const handleError = () => {
    console.error("Login Failed");
    // Consider showing a user-friendly message or triggering retry
  };

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return (
    <div className="mt-4">
      {/* Custom styled button */}
      <button
        className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
        onClick={() => {
          login();
        }}
      >
        <FcGoogle className="mr-2" size={20} /> Login with Google
      </button>
      {/* <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        className="hidden"
      /> */}
    </div>
  );
};

export default GoogleLoginButton;
