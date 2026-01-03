import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './store/store';
import MainLayout from './layouts/MainLayout';
import Login from './features/auth/Login';
import RequireAuth from './features/auth/RequireAuth';
import Dashboard from './features/dashboard/Dashboard';
const UserList = React.lazy(() => import('./features/users/UserList'));
const CampaignList = React.lazy(() => import('./features/campaigns/CampaignList'));
const CampaignForm = React.lazy(() => import('./features/campaigns/CampaignForm'));
const ActivityLogs = React.lazy(() => import('./features/activity/ActivityLogs'));

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <ToastContainer theme="dark" position="top-right" />
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        // <RequireAuth allowedRoles={['admin', 'user']}>
                        <MainLayout />
                        // </RequireAuth>
                    }>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<RequireAuth allowedRoles={['admin']}><React.Suspense fallback={<div>Loading...</div>}><UserList /></React.Suspense></RequireAuth>} />
                        <Route path="campaigns" element={<React.Suspense fallback={<div>Loading...</div>}><CampaignList /></React.Suspense>} />
                        <Route path="campaigns/new" element={<React.Suspense fallback={<div>Loading...</div>}><CampaignForm /></React.Suspense>} />
                        <Route path="activity" element={<RequireAuth allowedRoles={['admin']}><React.Suspense fallback={<div>Loading...</div>}><ActivityLogs /></React.Suspense></RequireAuth>} />
                        <Route path="reports" element={<div className="text-white">Reports Module (Coming Soon)</div>} />
                    </Route>
                    <Route path="/unauthorized" element={<div className="text-white bg-slate-900 h-screen flex items-center justify-center">Unauthorized Access</div>} />
                    <Route path="*" element={<div className="text-white bg-slate-900 h-screen flex items-center justify-center">404 Not Found</div>} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
