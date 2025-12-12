import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../../store/api';
import { setCredentials } from '../../store/authSlice';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login({ email, password }).unwrap();
            dispatch(setCredentials({ user: userData, token: userData.token }));
            if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Failed to login', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4 relative">
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-primary-text transition-colors"
            >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <div className="card w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">
                        {error.data?.message || 'Login failed'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-sm text-accent hover:text-accent-hover">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-accent hover:text-accent-hover">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
