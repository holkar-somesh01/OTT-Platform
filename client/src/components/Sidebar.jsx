import { LayoutDashboard, Film, Users, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Film, label: 'Movies', path: '/movies' },
        { icon: Users, label: 'Users', path: '/users' },
    ];

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="h-screen w-64 bg-secondary border-r border-[--color-border] flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-[--color-border] flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-white">
                    OTT
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[--color-primary-text] to-[--color-secondary-text] bg-clip-text text-transparent">
                    Admin
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-accent/10 text-accent border border-accent/20'
                                : 'text-secondary-text hover:text-primary-text hover:bg-[--color-hover]'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-[--color-border]">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
