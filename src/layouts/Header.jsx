import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiBell, FiMenu } from 'react-icons/fi';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6">
            <div className="flex items-center">
                {/* Mobile Menu Trigger could go here */}
                <div className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">S</div>
                    SMTP<span className="text-blue-500">DASH</span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors relative">
                    <FiBell className="text-xl" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="h-6 w-px bg-slate-700 mx-2"></div>

                <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
