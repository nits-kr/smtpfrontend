import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRegisterMutation } from './authApi';
import { FiEye, FiEyeOff, FiUpload, FiUser, FiMail, FiLock, FiBriefcase, FiPhone, FiShield } from 'react-icons/fi';

const Signup = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [registerUser, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const password = watch('password');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('phone', data.phone);
        formData.append('company', data.company);
        formData.append('role', data.role);
        formData.append('jobTitle', data.jobTitle);

        if (data.photo?.[0]) {
            formData.append('photo', data.photo[0]);
        }

        try {
            await registerUser(formData).unwrap();
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white py-10 px-4">
            <div className="w-full max-w-2xl p-8 bg-slate-900 rounded-lg shadow-xl border border-slate-800">
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Create Account</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Photo Upload */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden mb-2 relative group cursor-pointer">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FiUser className="w-10 h-10 text-slate-500" />
                            )}
                            <input
                                {...register('photo', { onChange: handleImageChange })}
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiUpload className="text-white" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-400">Upload Profile Photo</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="text-slate-500" />
                                </div>
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    className={`w-full bg-slate-950 border ${errors.name ? 'border-red-500' : 'border-slate-700'} rounded p-2 pl-10 text-white focus:outline-none focus:border-blue-500 transition-colors`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="text-slate-500" />
                                </div>
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                                    })}
                                    type="email"
                                    className={`w-full bg-slate-950 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded p-2 pl-10 text-white focus:outline-none focus:border-blue-500 transition-colors`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiPhone className="text-slate-500" />
                                </div>
                                <input
                                    {...register('phone', { pattern: { value: /^[0-9+\-\s()]*$/, message: 'Invalid phone number' } })}
                                    type="tel"
                                    className={`w-full bg-slate-950 border ${errors.phone ? 'border-red-500' : 'border-slate-700'} rounded p-2 pl-10 text-white focus:outline-none focus:border-blue-500 transition-colors`}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>

                        {/* Company */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Company / Organization</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiBriefcase className="text-slate-500" />
                                </div>
                                <input
                                    {...register('company')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 pl-10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Acme Corp"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiShield className="text-slate-500" />
                                </div>
                                <select
                                    {...register('role', { required: 'Role is required' })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 pl-10 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
                        </div>

                        {/* Job Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Job Title</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiBriefcase className="text-slate-500" />
                                </div>
                                <input
                                    {...register('jobTitle')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 pl-10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Senior Developer"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-slate-500" />
                                </div>
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    className={`w-full bg-slate-950 border ${errors.password ? 'border-red-500' : 'border-slate-700'} rounded p-2 pl-10 pr-10 text-white focus:outline-none focus:border-blue-500 transition-colors`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-slate-500" />
                                </div>
                                <input
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`w-full bg-slate-950 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'} rounded p-2 pl-10 pr-10 text-white focus:outline-none focus:border-blue-500 transition-colors`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 rounded mt-6 transition-all flex items-center justify-center"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <p className="text-center text-slate-400 text-sm mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
