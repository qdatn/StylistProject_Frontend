import React, { useState } from 'react';

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    console.log('Password reset successfully.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Reset Password</h2>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-600 mb-2">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={handlePasswordChange}
            className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {error && !confirmPassword && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-600 mb-2">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {error && confirmPassword && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
        <button
          type="submit"
          disabled={!newPassword || !confirmPassword}
          className="w-full py-2 text-white font-semibold bg-gray-800 rounded-sm hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;