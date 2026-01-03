import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * RequireAuth Component
 * Protects routes from unauthenticated access.
 * Optionally enforces Role-Based Access Control (RBAC).
 *
 * @param {Array<string>} allowedRoles - List of roles permitted to access this route.
 * @param {React.ReactNode} children - The child components to render if access is granted.
 */
const RequireAuth = ({ allowedRoles, children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user) {
        // Check if user has one of the allowed roles
        if (!allowedRoles.includes(user.role)) {
            // User is authenticated but doesn't have permission
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};

export default RequireAuth;
