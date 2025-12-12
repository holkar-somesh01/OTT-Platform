import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVerifyOtpMutation } from '../../store/api';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const location = useLocation();
    const email = location.state?.email || '';
    const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await verifyOtp({ email, otp }).unwrap();
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            console.error('Failed to verify OTP', err);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary p-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">No email provided. Please start over.</p>
                    <button onClick={() => navigate('/forgot-password')} className="btn btn-primary">Go Back</button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="card w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
                <p className="text-center text-sm text-gray-400 mb-6">Enter the code sent to {email}</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">
                        {error.data?.message || 'Invalid OTP'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="input-group">
                        <label>OTP Code</label>
                        <input
                            type="text"
                            className="input-field text-center tracking-widest text-xl"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;
