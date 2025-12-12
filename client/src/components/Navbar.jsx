import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from '../store/api';

const Navbar = ({ isDarkMode, toggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
        pollingInterval: 30000,
        skip: !user // Skip if no user
    });
    const [markAsRead] = useMarkNotificationReadMutation();

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleNotificationClick = async (id) => {
        await markAsRead(id);
    };

    // Text colors depend on scroll state: White when transparent (over dark banner), Theme color when scrolled (solid bg)
    const activeTextClass = scrolled ? "text-primary-text font-bold" : "text-white font-bold";
    const inactiveTextClass = scrolled ? "text-text-secondary hover:text-primary-text transition-colors" : "text-gray-300 hover:text-white transition-colors";
    const iconClass = scrolled ? "text-primary-text hover:text-text-secondary" : "text-white hover:text-gray-300";

    return (
        <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${scrolled ? 'bg-primary shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
            <div className="max-w-[1920px] mx-auto px-4 sm:px-12 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <NavLink to="/" className="text-accent text-3xl font-bold tracking-tighter hover:text-accent-hover transition-colors">
                        STREAMHUB
                    </NavLink>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <NavLink to="/" className={({ isActive }) => isActive ? activeTextClass : inactiveTextClass}>Home</NavLink>
                        <NavLink to="/movies" className={({ isActive }) => isActive ? activeTextClass : inactiveTextClass}>Movies</NavLink>
                        <NavLink to="/shorts" className={({ isActive }) => isActive ? activeTextClass : inactiveTextClass}>Shorts</NavLink>
                        <NavLink to="/tv-shows" className={({ isActive }) => isActive ? activeTextClass : inactiveTextClass}>TV Shows</NavLink>
                        <NavLink to="/latest" className={inactiveTextClass}>New & Popular</NavLink>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button className={`${iconClass} transition-colors hidden sm:block`}>
                        <Search size={20} />
                    </button>

                    {/* Notifications */}
                    {user && (
                        <div className="relative hidden sm:block">
                            <button
                                className={`${iconClass} transition-colors relative`}
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {notificationsOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-secondary border border-border rounded-xl shadow-2xl overflow-hidden max-h-[400px] flex flex-col">
                                    <div className="p-3 border-b border-border flex justify-between items-center bg-secondary sticky top-0 z-10">
                                        <h3 className="font-bold text-primary-text">Notifications</h3>
                                        {unreadCount > 0 && <span className="text-xs bg-accent px-2 py-0.5 rounded-full text-white">{unreadCount} new</span>}
                                    </div>
                                    <div className="overflow-y-auto flex-1">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-text-secondary">
                                                <p>No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map(notification => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-3 border-b border-border hover:bg-hover cursor-pointer transition-colors ${!notification.isRead ? 'bg-accent/5' : ''}`}
                                                    onClick={() => handleNotificationClick(notification.id)}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-accent' : 'text-primary-text'}`}>{notification.title}</h4>
                                                        <span className="text-[10px] text-text-secondary">{new Date(notification.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-xs text-text-secondary line-clamp-2">{notification.message}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={toggleTheme}
                        className={`${iconClass} transition-colors hidden sm:block`}
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* User Profile Dropdown (Desktop) */}
                    {user ? (
                        <div className="group relative hidden sm:block">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div className="w-8 h-8 rounded bg-accent flex items-center justify-center font-bold text-white">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            </div>

                            {/* Dropdown */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-secondary border border-border rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="py-2 flex flex-col">
                                    <NavLink to="/profile" className="px-4 py-2 hover:bg-hover text-sm text-text-secondary hover:text-primary-text">Account</NavLink>
                                    <button onClick={handleLogout} className="px-4 py-2 text-left hover:bg-hover text-sm text-text-secondary hover:text-primary-text flex items-center gap-2">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <NavLink to="/login" className="hidden sm:block bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
                            Login
                        </NavLink>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`md:hidden ${iconClass}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Open menu</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-secondary border-b border-border shadow-xl md:hidden flex flex-col p-4 space-y-4">
                    <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-primary-text font-medium">Home</NavLink>
                    <NavLink to="/movies" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-primary-text font-medium">Movies</NavLink>
                    <NavLink to="/shorts" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-primary-text font-medium">Shorts</NavLink>
                    <NavLink to="/tv-shows" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-primary-text font-medium">TV Shows</NavLink>
                    <NavLink to="/latest" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-primary-text font-medium">New & Popular</NavLink>

                    <div className="h-px bg-border my-2"></div>

                    {/* Visual Mobile Notifications Link (Simple version) */}
                    {user && (
                        <div className="flex items-center justify-between" onClick={() => { setNotificationsOpen(!notificationsOpen); setMobileMenuOpen(false); }}>
                            <span className="text-text-secondary">Notifications</span>
                            {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Theme</span>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-hover text-text-secondary hover:text-primary-text transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {user ? (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary">Profile</span>
                                <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-accent flex items-center justify-center font-bold text-white">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </NavLink>
                            </div>

                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full text-left text-red-500 hover:text-red-400 font-medium py-2"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <NavLink
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full text-left text-accent hover:text-accent-hover font-medium py-2"
                        >
                            Login
                        </NavLink>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
