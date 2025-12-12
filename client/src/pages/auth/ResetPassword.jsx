import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResetPasswordMutation } from '../../store/api';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const location = useLocation();
    const email = location.state?.email || '';
    const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await resetPassword({ email, password }).unwrap();
            navigate('/login');
        } catch (err) {
            console.error('Failed to reset password', err);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary p-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">No email provided. Please start over.</p>
                    <button onClick={() => navigate('/login')} className="btn btn-primary">Go to Login</button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="card w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">
                        {error.data?.message || 'Failed to reset password'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="input-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
