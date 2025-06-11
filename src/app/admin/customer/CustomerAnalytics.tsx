import React, { useEffect, useState } from 'react';
// Kiểu dữ liệu analytics
interface AnalyticsData {
    topStyles: { item: string; count: number }[];
    popularColors: { item: string; count: number }[];
    sizeDistribution: {
        top: Record<string, number>;
        bottom: Record<string, number>;
        shoe: Record<string, number>;
    };
    shoppingHabits: {
        places: { item: string; count: number }[];
        frequencies: Record<string, number>;
    };
    trendFollowing: Record<string, number>;
    brandPreferences: { brand: string; count: number }[];
    totalUsers: number;
    lastUpdated: string;
}

const CustomerAnalytics = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
           const response = await fetch('/api/admin/analytics');

                if (!response.ok) {
                    throw new Error('Failed to fetch analytics');
                }

                const data = await response.json();
                setAnalytics(data);
        };

        fetchAnalytics();
    }, []);

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center h-64">
    //             <div className="text-xl">Loading analytics data...</div>
    //         </div>

    //     );
    // }

    if (error) {
        return (

            <div className="text-red-500 text-center py-10">
                Error: {error}
            </div>

        );
    }

    return (

        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Fashion Analytics Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Last updated: {analytics?.lastUpdated ? new Date(analytics.lastUpdated).toLocaleString() : 'N/A'}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <SummaryCard
                    title="Total Users"
                    value={analytics?.totalUsers || 0}
                    icon="👥"
                />

                <SummaryCard
                    title="Top Style"
                    value={analytics?.topStyles[0]?.item || 'N/A'}
                    icon="👗"
                    subValue={`(${analytics?.topStyles[0]?.count || 0} users)`}
                />

                <SummaryCard
                    title="Popular Color"
                    value={analytics?.popularColors[0]?.item || 'N/A'}
                    icon="🎨"
                    subValue={`(${analytics?.popularColors[0]?.count || 0} users)`}
                />

                <SummaryCard
                    title="Trend Followers"
                    value={analytics?.trendFollowing?.yes || 0}
                    icon="📈"
                    subValue={`(${analytics && analytics.totalUsers
                        ? Math.round(((analytics.trendFollowing?.yes || 0) / analytics.totalUsers) * 100)
                        : 0
                        }%)`}
                />

            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Styles */}
                <AnalyticsCard title="Top Fashion Styles">
                    <BarChart
                        data={analytics?.topStyles || []}
                        color="#4f46e5"
                    />
                </AnalyticsCard>

                {/* Popular Colors */}
                <AnalyticsCard title="Popular Colors">
                    <div className="flex flex-wrap gap-2">
                        {analytics?.popularColors.map((color, index) => (
                            <ColorBadge
                                key={index}
                                color={color.item}
                                count={color.count}
                            />
                        ))}
                    </div>
                </AnalyticsCard>

                {/* Size Distribution */}
                <AnalyticsCard title="Size Distribution">
                    <SizeDistributionChart data={analytics?.sizeDistribution} />
                </AnalyticsCard>

                {/* Shopping Habits */}
                <AnalyticsCard title="Shopping Habits">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium mb-2">Top Shopping Places</h3>
                            <ul className="space-y-2">
                                {analytics?.shoppingHabits.places.slice(0, 5).map((place, index) => (
                                    <li key={index} className="flex justify-between">
                                        <span>{place.item}</span>
                                        <span className="font-medium">{place.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">Shopping Frequency</h3>
                            <PieChart
                                data={Object.entries(analytics?.shoppingHabits.frequencies || {}).map(([key, value]) => ({
                                    name: key,
                                    value
                                }))}
                            />
                        </div>
                    </div>
                </AnalyticsCard>
            </div>

            {/* Brand Preferences */}
            <AnalyticsCard
                title="Top Brand Preferences"
                className="mt-8"
            >
                <BarChart
                    data={analytics?.brandPreferences || []}
                    color="#10b981"
                    horizontal={true}
                />
            </AnalyticsCard>
        </div>

    );
};

// Component phụ trợ
const SummaryCard = ({ title, value, icon, subValue }: any) => (
    <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center">
            <span className="text-3xl mr-3">{icon}</span>
            <div>
                <h3 className="text-gray-500 text-sm">{title}</h3>
                <div className="flex items-baseline">
                    <span className="text-2xl font-bold">{value}</span>
                    {subValue && <span className="text-gray-500 ml-2">{subValue}</span>}
                </div>
            </div>
        </div>
    </div>
);

const AnalyticsCard = ({ title, children, className = '' }: any) => (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
        <h2 className="font-bold text-lg p-4 border-b">{title}</h2>
        <div className="p-4">{children}</div>
    </div>
);

const ColorBadge = ({ color, count }: any) => {
    // Ánh xạ màu sắc sang mã hex
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

    return (
        <div className="flex items-center">
            <div
                className="w-8 h-8 rounded-full border border-gray-300"
                style={{ backgroundColor: colorMap[color] || '#cccccc' }}
                title={color}
            ></div>
            <div className="ml-2">
                <div className="text-sm">{color}</div>
                <div className="text-xs text-gray-500">{count}</div>
            </div>
        </div>
    );
};

// Các component biểu đồ đơn giản
const BarChart = ({ data, color, horizontal = false }: any) => {
    const maxValue = Math.max(...data.map((item: any) => item.count), 0);

    return (
        <div className={`space-y-2 ${horizontal ? 'h-64 overflow-y-auto' : ''}`}>
            {data.map((item: any, index: number) => (
                <div key={index} className={horizontal ? 'mb-3' : ''}>
                    <div className="flex justify-between text-sm mb-1">
                        <span>{item.item || item.brand}</span>
                        <span className="font-medium">{item.count}</span>
                    </div>
                    <div
                        className={`rounded-full ${horizontal ? 'h-4' : 'h-3'} bg-gray-200 overflow-hidden`}
                    >
                        <div
                            className={`h-full ${horizontal ? 'rounded' : 'rounded-full'}`}
                            style={{
                                width: horizontal ? '100%' : `${(item.count / maxValue) * 100}%`,
                                height: horizontal ? '100%' : undefined,
                                backgroundColor: color,
                                maxWidth: horizontal ? `${(item.count / maxValue) * 100}%` : undefined
                            }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const PieChart = ({ data }: any) => {
    const total = data.reduce((sum: number, item: any) => sum + item.value, 0);
    let startAngle = 0;

    return (
        <div className="relative w-32 h-32 mx-auto">
            {data.map((item: any, index: number) => {
                const percentage = (item.value / total) * 100;
                const angle = (percentage / 100) * 360;
                const endAngle = startAngle + angle;

                const largeArc = angle > 180 ? 1 : 0;

                // Tính toán tọa độ cho SVG path
                const startX = 50 + 50 * Math.cos(Math.PI * startAngle / 180);
                const startY = 50 + 50 * Math.sin(Math.PI * startAngle / 180);
                const endX = 50 + 50 * Math.cos(Math.PI * endAngle / 180);
                const endY = 50 + 50 * Math.sin(Math.PI * endAngle / 180);

                const pathData = [
                    `M 50 50`,
                    `L ${startX} ${startY}`,
                    `A 50 50 0 ${largeArc} 1 ${endX} ${endY}`,
                    `Z`
                ].join(' ');

                startAngle = endAngle;

                return (
                    <path
                        key={index}
                        d={pathData}
                        fill={getColor(index)}
                        stroke="#fff"
                        strokeWidth="1"
                    />
                );
            })}
        </div>
    );
};

const SizeDistributionChart = ({ data }: any) => {
    if (!data) return null;

    return (
        <div className="space-y-4">
            {Object.entries(data).map(([category, sizes]: [string, any]) => (
                <div key={category}>
                    <h3 className="font-medium capitalize mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(sizes).map(([size, count]: [string, any]) => (
                            <div
                                key={size}
                                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                            >
                                <span className="font-medium">{size}</span>: {count}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Hàm phụ trợ
const getColor = (index: number) => {
    const colors = [
        '#3b82f6', // blue
        '#ef4444', // red
        '#10b981', // green
        '#f59e0b', // yellow
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#06b6d4', // cyan
        '#f97316'  // orange
    ];
    return colors[index % colors.length];
};

export default CustomerAnalytics;