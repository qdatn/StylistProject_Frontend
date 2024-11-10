// components/Header.tsx
import React from 'react';

const AdminHeader = () => {
    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
            {/* Tìm kiếm */}
            <div className="w-2/3">
                <input
                    type="text"
                    placeholder="Tìm kiếm (Ctrl + K)"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>

            {/* Thông tin người dùng */}
            <div className="flex items-center space-x-4">
                <button className="text-gray-600">🔔</button>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-800 font-semibold">Admin StylistLeo</span>
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white">St</div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
