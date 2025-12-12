import { Link } from 'react-router-dom';
import { Users, Play, Film, Plus, BarChart2, ArrowRight } from 'lucide-react';
import { useGetAnalyticsQuery, useGetMoviesQuery } from '../../store/api';
import { getImageUrl } from '../../utils/imageUtils';
import { CardSkeleton, TableSkeleton } from '../../components/Skeleton';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-secondary p-6 rounded-xl border border-border shadow-lg flex items-center justify-between group hover:border-accent transition-colors">
        <div>
            <p className="text-text-secondary text-sm mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-primary-text">{value}</h3>
        </div>
        <div className={`p-4 rounded-full bg-opacity-10 ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={24} className="text-primary-text" />
        </div>
    </div>
);

const QuickActionCard = ({ title, description, icon: Icon, to, color }) => (
    <Link to={to} className="bg-secondary p-6 rounded-xl border border-border hover:bg-hover hover:border-accent transition-all group flex flex-col justify-between h-full">
        <div>
            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 text-white`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-primary-text mb-2">{title}</h3>
            <p className="text-text-secondary text-sm">{description}</p>
        </div>
        <div className="mt-4 flex items-center text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Go to {title} <ArrowRight size={16} className="ml-1" />
        </div>
    </Link>
);

const AdminDashboard = () => {
    const { data: analytics, isLoading: analyticsLoading } = useGetAnalyticsQuery();
    const { data: movies = [], isLoading: moviesLoading } = useGetMoviesQuery();

    const recentMovies = movies.slice(0, 5);

    if (analyticsLoading || moviesLoading) {
        return (
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="h-8 w-64 bg-gray-800 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-96 bg-gray-800 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
                        <div className="grid grid-cols-1 gap-4">
                            <CardSkeleton />
                            <CardSkeleton />
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <TableSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary-text">Dashboard Overview</h1>
                    <p className="text-text-secondary mt-1">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/admin/content" className="btn bg-accent hover:bg-accent-hover text-white flex items-center gap-2">
                        <Plus size={20} /> Add Content
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={analytics?.totalUsers || 0}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Content"
                    value={analytics?.totalMovies || 0}
                    icon={Film}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Active Streams"
                    value={analytics?.activeStreams || 0}
                    icon={Play}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${analytics?.revenue || 0}`}
                    icon={BarChart2}
                    color="bg-yellow-500"
                />
            </div>

            {/* Quick Actions & Recent Activity Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-bold text-primary-text">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <QuickActionCard
                            title="Manage Users"
                            description="View, edit, or block users."
                            icon={Users}
                            to="/admin/users"
                            color="bg-blue-600"
                        />
                        <QuickActionCard
                            title="Content Library"
                            description="Upload new movies, series, or shorts."
                            icon={Film}
                            to="/admin/content"
                            color="bg-purple-600"
                        />
                        <QuickActionCard
                            title="Analytics"
                            description="Check detailed reports and trends."
                            icon={BarChart2}
                            to="/admin/analytics"
                            color="bg-indigo-600"
                        />
                    </div>
                </div>

                {/* Right Column: Recent Additions */}
                <div className="lg:col-span-2">
                    <div className="bg-secondary rounded-xl border border-border p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-primary-text">Recently Added Content</h2>
                            <Link to="/admin/content" className="text-sm text-accent hover:text-accent-hover">View All</Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider">
                                        <th className="p-3 font-medium">Cover</th>
                                        <th className="p-3 font-medium">Title</th>
                                        <th className="p-3 font-medium">Genre</th>
                                        <th className="p-3 font-medium">Relase Year</th>
                                        <th className="p-3 font-medium text-right">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border text-sm">
                                    {recentMovies.map((movie) => (
                                        <tr key={movie.id} className="hover:bg-hover transition-colors">
                                            <td className="p-3">
                                                <img
                                                    src={getImageUrl(movie.posterUrl || movie.poster_path)}
                                                    alt={movie.title}
                                                    className="w-10 h-14 object-cover rounded shadow-sm"
                                                />
                                            </td>
                                            <td className="p-3 font-medium text-primary-text">{movie.title}</td>
                                            <td className="p-3 text-text-secondary">{movie.genre}</td>
                                            <td className="p-3 text-text-secondary">{movie.releaseYear}</td>
                                            <td className="p-3 text-right">
                                                <span className={`px-2 py-1 rounded text-xs font-medium bg-opacity-20 ${movie.type === 'movie' ? 'bg-blue-500 text-blue-400' : 'bg-purple-500 text-purple-400'}`}>
                                                    {movie.type || 'Movie'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentMovies.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-6 text-center text-text-secondary">
                                                No content available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
