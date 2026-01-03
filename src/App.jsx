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
