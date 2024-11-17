import React from 'react';
import { UserAccount } from '@src/types/UserAccount';

interface AccountDetailsProps {
    user: UserAccount | null;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ user }) => {
    return (
        <div className="w-3/4 bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">MY ACCOUNT</h1>

            <h2 className="text-xl font-semibold mb-4">MY DETAILS</h2>
            <p className="text-gray-600 mb-4">
                Feel free to edit any of your details below so your account is totally up to date. (* Indicates a required field).
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-semibold">First Name*</label>
                    <input
                        type="text"
                        value={user ? user.name.split(" ")[0] : ""}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        readOnly
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold">Last Name*</label>
                    <input
                        type="text"
                        value={user ? user.name.split(" ").slice(1).join(" ") : ""}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        readOnly
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold">Email Address*</label>
                    <input
                        type="email"
                        value={user ? user.phone_number : ""}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        readOnly
                    />
                </div>

                {/* Thêm các trường khác ở đây */}

            </div>

            <button className="mt-6 w-full bg-gray-400 text-white py-2 rounded-lg font-semibold cursor-not-allowed" disabled>
                SAVE CHANGES
            </button>
        </div>
    );
};

export default AccountDetails;
