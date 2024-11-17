"use client"

import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@components/ui/input-otp"

export function OTPForm() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 ">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Enter OTP</h2>
        <p className="text-center text-gray-600 mb-6">Please enter the 6-digit OTP we have sent to you.</p>

        <InputOTP containerClassName="flex justify-center gap-4 mb-6" maxLength={6}>
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
        </InputOTP>

        <button className="w-full py-2 text-white font-semibold bg-gray-800 rounded-sm hover:bg-gray-600">
          Confirm
        </button>
      </div>
    </div>
  )
}
