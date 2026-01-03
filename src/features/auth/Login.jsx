import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginStart, loginSuccess, loginFailure } from './authSlice';

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        dispatch(loginStart());
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (data.email === 'admin@example.com' && data.password === 'password') {
                const mockUser = { name: 'Admin User', role: 'admin', email: data.email };
                const mockToken = 'mock-jwt-token-12345';

                dispatch(loginSuccess({ user: mockUser, token: mockToken }));
                toast.success('Login Successful! Welcome back.');
                navigate('/dashboard');
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            dispatch(loginFailure(error.message));
            toast.error(error.message || 'Login failed');
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
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 rounded transition-all flex items-center justify-center"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
