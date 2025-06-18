import React from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, CartesianGrid } from 'recharts';

// Component Summary Card
export const SummaryCard = ({ title, value, icon, subValue, color = "bg-gray-100 text-gray-700" }: any) => (
    <div className={`rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md ${color}`}>
        <div className="flex items-start">
            <span className="text-2xl mr-3">{icon}</span>
            <div>
                <h3 className="text-sm font-medium opacity-80">{title}</h3>
                <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold">{value}</span>
                    {subValue && <span className="text-sm ml-2 opacity-75">{subValue}</span>}
                </div>
            </div>
        </div>
    </div>
);

// Component Analytics Card
export const AnalyticsCard = ({ title, children, className = '' }: any) => (
    <div className={`rounded-xl shadow-sm overflow-hidden ${className}`}>
        <h2 className="font-bold text-lg p-6 pb-4 text-gray-800 border-b border-gray-100">{title}</h2>
        <div className="p-6 pt-4">{children}</div>
    </div>
);

// Component Color Card
export const ColorCard = ({ color, count, colorValue }: any) => {
    const colorMap: Record<string, string> = {
        'Black': '#000000',
        'White': '#ffffff',
        'Red': '#ef4444',
        'Blue': '#3b82f6',
        'Green': '#22c55e',
        'Yellow': '#eab308',
        'Pink': '#ec4899',
        'Purple': '#a855f7',
        'Orange': '#f97316',
        'Brown': '#a16207',
        'Gray': '#6b7280',
        'Pastel': '#fbcfe8'
    };

    const colorHex = colorMap[color] || colorValue || '#cccccc';
    const textColor = color === 'Black' || color === 'Gray' ? 'text-white' : 'text-gray-900';

    return (
        <div className="flex flex-col items-center rounded-lg overflow-hidden shadow-sm border border-gray-100">
            <div
                className="w-full h-20 flex items-center justify-center"
                style={{ backgroundColor: colorHex }}
            >
                <span className={`text-sm font-medium ${textColor}`}>{color}</span>
            </div>
            <div className="w-full bg-white p-2 text-center">
                <span className="text-sm font-medium text-gray-700">{count}</span>
            </div>
        </div>
    );
};

// Component Loading State
export const LoadingState = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <div className="text-xl text-gray-700">Loading fashion insights...</div>
        </div>
    </div>
);

