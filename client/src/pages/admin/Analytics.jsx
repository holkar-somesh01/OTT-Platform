import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Play, TrendingUp, DollarSign, Film } from 'lucide-react';
import { useGetAnalyticsQuery } from '../../store/api';

const StatCard = ({ title, value, icon: Icon, trend, color = "bg-accent" }) => (
    <div className="bg-secondary rounded-xl p-6 border border-border shadow-lg">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-text-secondary text-sm mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-primary-text">{value}</h3>
            </div>
            <div className={`p-3 ${color} bg-opacity-10 rounded-lg text-${color.replace('bg-', '')}`}>
                <Icon size={24} className="text-accent" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-400">
            <TrendingUp size={16} className="mr-1" />
            <span>{trend}</span>
        </div>
    </div>
);

const AdminAnalytics = () => {
    const { data: analytics, isLoading } = useGetAnalyticsQuery();

    const activityData = [
        { name: 'Mon', active: 4000, new: 2400 },
        { name: 'Tue', active: 3000, new: 1398 },
        { name: 'Wed', active: 2000, new: 9800 },
        { name: 'Thu', active: 2780, new: 3908 },
        { name: 'Fri', active: 1890, new: 4800 },
        { name: 'Sat', active: 2390, new: 3800 },
        { name: 'Sun', active: 3490, new: 4300 },
    ];

    const genreData = analytics?.genreData || [
        { name: 'No Data', value: 1 }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (isLoading) return <div className="p-8 text-center text-text-secondary">Loading analytics data...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2 text-primary-text">Platform Analytics</h2>
                <p className="text-text-secondary">Detailed insights into your platform's performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={analytics?.totalUsers} icon={Users} trend="+12% vs last month" />
                <StatCard title="Total Movies" value={analytics?.totalMovies} icon={Film} trend="+50 added this week" />
                <StatCard title="Active Streams" value={analytics?.activeStreams} icon={Play} trend="+5% vs last hour" />
                <StatCard title="Revenue" value={`$${analytics?.revenue}`} icon={DollarSign} trend="+8% vs last month" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-secondary p-6 rounded-xl border border-border h-[400px]">
                    <h3 className="text-lg font-bold mb-6 text-primary-text">User Activity</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics?.activityData || activityData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                                cursor={{ fill: 'var(--hover-color)' }}
                            />
                            <Bar dataKey="active" fill="#E50914" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="new" fill="var(--text-secondary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-secondary p-6 rounded-xl border border-border h-[400px]">
                    <h3 className="text-lg font-bold mb-6 text-primary-text">Genre Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={genreData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {genreData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
