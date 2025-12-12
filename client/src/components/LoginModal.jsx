import { X, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLogin = () => {
        onClose();
        navigate('/login');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-secondary border border-border rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-text-secondary hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                        <LogIn className="w-8 h-8 text-accent" />
                    </div>

                    <h2 className="text-2xl font-bold text-primary-text">Login Required</h2>

                    <p className="text-text-secondary">
                        Please log in to your account to watch movies, series, and verify access to premium content.
                    </p>

                    <div className="flex gap-3 w-full pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg font-medium text-text-secondary hover:bg-hover hover:text-primary-text transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogin}
                            className="flex-1 px-4 py-2.5 rounded-lg font-bold bg-accent hover:bg-accent-hover text-white transition-colors"
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
