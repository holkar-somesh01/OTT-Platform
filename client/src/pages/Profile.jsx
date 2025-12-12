
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetProfileQuery, useUpdateProfileMutation, useUpdatePasswordMutation } from '../store/api';
import { setCredentials } from '../store/authSlice';

const Profile = () => {
    const { data: profile, isLoading, isError } = useGetProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [message, setMessage] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setEmail(profile.email);
        }
    }, [profile]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage(null);
        setErrorMsg(null);
        try {
            const result = await updateProfile({ name }).unwrap();
            dispatch(setCredentials({ user: result, token: result.token }));
            setMessage('Profile updated successfully');
        } catch (err) {
            setErrorMsg(err?.data?.message || 'Failed to update profile');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setErrorMsg(null);
        try {
            await updatePassword({ currentPassword, newPassword }).unwrap();
            setMessage('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setErrorMsg(err?.data?.message || 'Failed to update password');
        }
    };

    if (isLoading) return <div className="p-6 text-center">Loading profile...</div>;
    if (isError) return <div className="p-6 text-red-500 text-center">Error loading profile</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>

            {message && <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-lg">{message}</div>}
            {errorMsg && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">{errorMsg}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Update Profile Section */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="input-group">
                            <label className="text-gray-300">Name</label>
                            <input
                                type="text"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label className="text-gray-300">Email</label>
                            <input
                                type="email"
                                className="input-field opacity-50 cursor-not-allowed"
                                value={email}
                                disabled
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full" disabled={isUpdating}>
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Update Password Section */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Security</h2>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="input-group">
                            <label className="text-gray-300">Current Password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="text-gray-300">New Password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-outline w-full" disabled={isUpdatingPassword}>
                            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
