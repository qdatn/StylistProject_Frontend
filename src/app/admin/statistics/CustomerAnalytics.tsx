import React, { useEffect, useState } from 'react';
import axiosClient from '@api/axiosClient';

import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, CartesianGrid } from 'recharts';
import { AnalyticsCard, ColorCard, LoadingState, SummaryCard } from '@components/statistic/AnalyticsForm';
import { AnalyticsData, AnalyticsList, } from '@src/types/StylePreferences';

const apiUrl = import.meta.env.VITE_API_URL;



const CustomerAnalytics = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.getOne<AnalyticsList>(`${apiUrl}/api/style-preferences/analytics`);

                if (!response || !response.data) {
                    throw new Error('Failed to fetch analytics');
                }

                setAnalytics(response.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    // Màu sắc cho biểu đồ
    const chartColors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

    if (loading) return <LoadingState />;

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customer Fashion Trends</h1>
                    <p className="text-gray-500 mt-2">Customer preferences and trends analysis</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg mt-4 md:mt-0">
                    <span className="font-medium">Last updated: </span>
                    {analytics?.lastUpdated ? new Date(analytics.lastUpdated).toLocaleString() : 'N/A'}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SummaryCard
                    title="Total Users"
                    value={analytics?.totalUsers || 0}
                    icon="👥"
                    color="bg-indigo-100 text-indigo-700"
                />

                <SummaryCard
                    title="Top Style"
                    value={analytics?.topStyles?.[0]?.item || 'N/A'}
                    icon="👗"
                    subValue={`(${analytics?.topStyles?.[0]?.count || 0} users)`}
                    color="bg-pink-100 text-pink-700"
                />

                <SummaryCard
                    title="Popular Color"
                    value={analytics?.popularColors?.[0]?.item || 'N/A'}
                    icon="🎨"
                    subValue={`(${analytics?.popularColors?.[0]?.count || 0} users)`}
                    color="bg-purple-100 text-purple-700"
                />

                <SummaryCard
                    title="Trend Followers"
                    value={analytics?.trendFollowing?.yes || 0}
                    icon="📈"
                    subValue={`(${analytics && analytics.totalUsers
                        ? Math.round(((analytics.trendFollowing?.yes || 0) / analytics.totalUsers) * 100)
                        : 0
                        }%)`}
                    color="bg-teal-100 text-teal-700"
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Styles */}
                <AnalyticsCard title="Top Fashion Styles" className="bg-white">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={analytics?.topStyles || []}
                                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="item" angle={-45} textAnchor="end" height={60} />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                    }}
                                />
                                <Bar dataKey="count" name="Users" radius={[4, 4, 0, 0]}>
                                    {analytics?.topStyles?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </AnalyticsCard>

                {/* Popular Colors */}
                <AnalyticsCard title="Popular Colors" className="bg-white">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {analytics?.popularColors.map((color, index) => (
                            <ColorCard
                                key={index}
                                color={color.item}
                                count={color.count}
                                colorValue={chartColors[index % chartColors.length]}
                            />
                        ))}
                    </div>
                </AnalyticsCard>

                {/* Size Distribution */}
                <AnalyticsCard title="Size Distribution" className="bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {analytics?.sizeDistribution && Object.entries(analytics.sizeDistribution).map(([category, sizes], catIndex) => (
                            <div key={catIndex} className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-800 capitalize mb-3">{category}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(sizes).map(([size, count], sizeIndex) => (
                                        <div
                                            key={sizeIndex}
                                            className="flex flex-col items-center justify-center bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200"
                                        >
                                            <span className="text-lg font-bold">{size}</span>
                                            <span className="text-sm text-gray-500">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </AnalyticsCard>

                {/* Shopping Habits */}
                <AnalyticsCard title="Shopping Habits" className="bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-4">Shopping Frequency</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={Object.entries(analytics?.shoppingHabits.frequencies || {}).map(([key, value], index) => ({
                                                name: key,
                                                value,
                                                color: chartColors[index % chartColors.length]
                                            }))}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {Object.entries(analytics?.shoppingHabits.frequencies || {}).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700 mb-4">Top Shopping Places</h3>
                            <div className="space-y-3">
                                {analytics?.shoppingHabits.places?.slice(0, 5).map((place, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: chartColors[index % chartColors.length] }}></div>
                                            <span className="text-gray-800">{place.item}</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{place.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnalyticsCard>
            </div>

            {/* Brand Preferences */}
            {/* <AnalyticsCard title="Top Brand Preferences" className="mt-8 bg-white">
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={analytics?.brandPreferences || []}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="brand" width={90} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}
                            />
                            <Bar dataKey="count" name="Users" radius={[0, 4, 4, 0]}>
                                {analytics?.brandPreferences?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </AnalyticsCard> */}
        </div>
    );
};

export default CustomerAnalytics;