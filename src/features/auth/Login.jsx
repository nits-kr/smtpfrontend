import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation } from './authApi';
import { setCredentials } from './authSlice';

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const result = await login(data).unwrap();
            dispatch(setCredentials({
                user: result.user,
                tokens: result.tokens
            }));
            toast.success(result.message || 'Login Successful! Welcome back.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
            <div className="w-full max-w-md p-8 bg-slate-900 rounded-lg shadow-xl border border-slate-800">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">SMTP Admin Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                        <input
                            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                            type="email"
                            className={`w-full bg-slate-950 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded p-2 text-white focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="admin@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                        <input
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                            type="password"
                            className={`w-full bg-slate-950 border ${errors.password ? 'border-red-500' : 'border-slate-700'} rounded p-2 text-white focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 rounded transition-all flex items-center justify-center"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <p className="text-center text-slate-400 text-sm mt-4">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-400 hover:text-blue-300">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
