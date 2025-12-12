import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = () => {
    // Theme state
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-primary text-primary-text transition-colors duration-200">
            <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
