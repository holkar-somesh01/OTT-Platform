import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../../store/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [register, { isLoading, error }] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await register({ name, email, password }).unwrap();
            dispatch(setCredentials({ user: userData, token: userData.token }));
            navigate('/');
        } catch (err) {
            console.error('Failed to register', err);
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
                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">
                        {error.data?.message || 'Registration failed'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-accent hover:text-accent-hover">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
