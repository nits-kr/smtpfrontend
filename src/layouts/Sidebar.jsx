import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    FiHome,
    FiMail,
    FiActivity,
    FiUsers,
    FiSettings,
    FiShield
} from 'react-icons/fi';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const role = user?.role || 'user';

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: <FiHome />, roles: ['admin', 'user'] },
        { name: 'Campaigns', path: '/campaigns', icon: <FiMail />, roles: ['admin', 'user'] },
        { name: 'Activity Logs', path: '/activity', icon: <FiActivity />, roles: ['admin'] },
        { name: 'User Management', path: '/users', icon: <FiUsers />, roles: ['admin'] },
        { name: 'System Settings', path: '/settings', icon: <FiSettings />, roles: ['admin'] },
    ];

    const filteredLinks = links.filter(link => link.roles.includes(role));

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col h-screen fixed left-0 top-0 pt-16 z-20 transition-all duration-300">
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-1 px-3">
                    {filteredLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${isActive
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <span className={`mr-3 text-lg ${
                                // Active logic handled above, but inline style for icon color match can happen via CSS classes
                                ''
                                }`}>{link.icon}</span>
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.[0] || 'U'}
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-400 capitalize">{role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
