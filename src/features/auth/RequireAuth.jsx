import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * RequireAuth Component
 * Protects routes from unauthenticated access.
 * Optionally enforces Role-Based Access Control (RBAC).
 *
 * @param {Array<string>} allowedRoles - List of roles permitted to access this route.
 * @param {React.ReactNode} children - The child components to render if access is granted.
 */
const RequireAuth = ({ allowedRoles, children }) => {
    const location = useLocation();

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    const isAuthenticated = !!localStorage.getItem("accessToken");

    if (!isAuthenticated || !user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles) {
        // Normalize role logic: if role is 'admin' or roles is [] (empty array), set to 'admin', otherwise 'other'
        let userRole = 'other';
        const { role, roles } = user;

        if (role === 'admin' || (Array.isArray(roles) && roles.length === 0)) {
            userRole = 'admin';
        }

        // Check if user has one of the allowed roles
        if (!allowedRoles.includes(userRole)) {
            // User is authenticated but doesn't have permission
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};

export default RequireAuth;
