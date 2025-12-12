import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../store/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email).unwrap();
            setIsSent(true);
            // In a real app we would navigate to verify, but passing email is tricky without state, 
            // so for now just show success or navigate with state
            setTimeout(() => navigate('/verify-otp', { state: { email } }), 1500);
        } catch (err) {
            console.error('Failed to send OTP', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="card w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">
                        {error.data?.message || 'Failed to send OTP'}
                    </div>
                )}

                {isSent && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg mb-4 text-sm">
                        OTP Sent! Redirecting...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading || isSent}>
                        {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-400">
                    <Link to="/login" className="text-accent hover:text-accent-hover">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
