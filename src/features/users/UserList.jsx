import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation } from './usersApi';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const UserList = () => {
    const [page, setPage] = useState(1); // 1-indexed for UI, maybe 0 for API
    const [search, setSearch] = useState('');
    const { data, isLoading, isError } = useGetUsersQuery({ page, limit: 10, search: "", role: "subuser" });
    const [deleteUser] = useDeleteUserMutation();

    // Mock data fallback if API fails or is empty for dev
    const users = data?.users || [
        { _id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin', createdAt: '2026-01-01' },
        { _id: '2', name: 'User 1', email: 'user1@example.com', role: 'user', createdAt: '2026-01-02' }
    ];
    const totalPages = data?.totalPages || 1;

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id).unwrap();
                toast.success('User deleted successfully');
            } catch (err) {
                toast.error('Failed to delete user');
            }
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'role', label: 'Role', render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row?.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {row?.role?.toUpperCase()}
                </span>
            )
        },
        { key: 'createdAt', label: 'Joined', render: (row) => row.createdAt?.slice(0, 10) },
        {
            key: 'actions', label: 'Actions', render: (row) => (
                <div className="flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(row._id)} className="text-red-400 hover:text-red-300"><FiTrash2 /></button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h1 className="text-xl font-bold text-white">User Management</h1>
                <div className="flex gap-4">
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                    />
                    <Link to="/users/new">
                        <Button variant="primary" className="flex items-center">
                            <FiPlus className="mr-2" /> Add User
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-md">
                <DataTable
                    columns={columns}
                    data={users}
                    loading={isLoading}
                />

                {/* Pagination (Simple) */}
                <div className="p-4 border-t border-slate-700 flex justify-between items-center text-slate-400 text-sm">
                    <span>Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                        <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
