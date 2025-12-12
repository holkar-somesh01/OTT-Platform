import { useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../store/api';
import { TableSkeleton } from '../../components/Skeleton';
import DataTable from '../../components/DataTable';

const AdminUsers = () => {
    const [tableParams, setTableParams] = useState({
        page: 1,
        limit: 10,
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const { data: users = [], isLoading } = useGetUsersQuery(tableParams);
    const [deleteUser] = useDeleteUserMutation();

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this user?')) {
            try {
                await deleteUser(id).unwrap();
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert('Failed to delete user');
            }
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>

            {isLoading ? (
                <TableSkeleton />
            ) : (
                <DataTable
                    columns={[
                        {
                            header: "Name",
                            accessor: "name",
                            sortable: true,
                            render: (user) => (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="font-medium">{user.name}</span>
                                </div>
                            )
                        },
                        { header: "Email", accessor: "email", sortable: true },
                        {
                            header: "Role",
                            accessor: "role",
                            sortable: true,
                            render: (user) => (
                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                                    {user.role}
                                </span>
                            )
                        },
                        {
                            header: "Status",
                            accessor: "status",
                            render: () => (
                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                    Active
                                </span>
                            )
                        },
                        {
                            header: "Joined",
                            accessor: "createdAt",
                            sortable: true,
                            render: (user) => new Date(user.createdAt).toLocaleDateString()
                        },
                        {
                            header: "Actions",
                            accessor: "actions",
                            render: (user) => (
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                                        title="Delete User"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )
                        }
                    ]}
                    data={users.data || users}
                    meta={users.meta}
                    searchKeys={['name', 'email']}
                    searchPlaceholder="Search users by name or email..."
                    serverSide
                    onServerRequest={(params) => setTableParams(prev => ({ ...prev, ...params }))}
                />
            )}
        </div>
    );
};

export default AdminUsers;
