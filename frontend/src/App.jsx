import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EnergyProvider } from './context/EnergyContext';
import AmbientBackground from './components/AmbientBackground';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Devices from './pages/Devices';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <EnergyProvider>
                <Router>
                    <AmbientBackground />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/" element={
                            <PrivateRoute>
                                <Layout />
                            </PrivateRoute>
                        }>
                            <Route index element={<Dashboard />} />
                            <Route path="devices" element={<Devices />} />
                        </Route>
                    </Routes>
                </Router>
            </EnergyProvider>
        </AuthProvider>
    );
}

export default App;
