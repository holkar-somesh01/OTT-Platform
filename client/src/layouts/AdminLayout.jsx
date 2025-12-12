import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = () => {
    const [expanded, setExpanded] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="flex h-screen bg-primary text-primary-text overflow-hidden transition-colors duration-200">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <AdminSidebar expanded={expanded} setExpanded={setExpanded} />
            </div>

            {/* Mobile Sidebar */}
            <div className={`md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileOpen(false)}>
                <div
                    className={`fixed inset-y-0 left-0 w-64 bg-black shadow-2xl transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <AdminSidebar expanded={true} setExpanded={() => setMobileOpen(false)} />
                </div>
            </div>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-secondary border-b border-border flex items-center justify-between px-6 transition-colors duration-200">
                    <button className="md:hidden text-text-secondary hover:text-primary-text" onClick={() => setMobileOpen(true)}>
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 md:flex-none"></div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-hover text-text-secondary hover:text-primary-text transition-colors"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-white">
                                A
                            </div>
                            <span className="text-sm font-medium hidden sm:block">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
