import { Search, MoreVertical, Edit, Trash, Ban } from 'lucide-react';

const Users = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">User Management</h2>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" className="input-field pl-10" placeholder="Search users..." />
                </div>
            </div>

            <div className="card overflow-hidden p-0">
                <table className="w-full text-left">
                    <thead className="bg-black/20 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-medium">User</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Plan</th>
                            <th className="p-4 font-medium">Joined</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                                            U{i}
                                        </div>
                                        <div>
                                            <div className="font-medium">User {i}</div>
                                            <div className="text-sm text-gray-400">user{i}@example.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                        Active
                                    </span>
                                </td>
                                <td className="p-4">Premium</td>
                                <td className="p-4 text-gray-400">Dec {10 + i}, 2024</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                                            <Edit size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400">
                                            <Ban size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
