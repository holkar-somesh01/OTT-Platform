import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Film, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const SidebarItem = ({ to, icon: Icon, label, expanded }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${isActive
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:bg-hover hover:text-primary-text'
                }`
            }
        >
            <Icon size={24} className="min-w-[24px]" />
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                {label}
            </span>
            {!expanded && (
                <div className="absolute left-16 bg-secondary border border-border text-primary-text text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl">
                    {label}
                </div>
            )}
        </NavLink>
    );
};

const AdminSidebar = ({ expanded, setExpanded }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <aside className={`h-screen bg-secondary border-r border-border flex flex-col transition-all duration-300 ${expanded ? 'w-64' : 'w-20'}`}>
            <div className="h-16 flex items-center px-4 border-b border-border">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-2 text-accent text-2xl font-bold tracking-tighter"
                >
                    <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-white">
                        S
                    </div>
                </button>
                <span className={`ml-3 font-bold text-primary-text text-xl transition-all duration-300 overflow-hidden ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                    STREAMHUB
                </span>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-2">
                <SidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" expanded={expanded} />
                <SidebarItem to="/admin/content" icon={Film} label="Content Management" expanded={expanded} />
                <SidebarItem to="/admin/users" icon={Users} label="Users" expanded={expanded} />
                <SidebarItem to="/admin/analytics" icon={BarChart3} label="Analytics" expanded={expanded} />
                <SidebarItem to="/admin/settings" icon={Settings} label="Settings" expanded={expanded} />
            </nav>

            <div className="p-3 border-t border-border">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                    <LogOut size={24} className="min-w-[24px]" />
                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
