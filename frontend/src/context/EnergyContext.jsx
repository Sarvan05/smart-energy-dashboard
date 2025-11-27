import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const EnergyContext = createContext();

export const useEnergy = () => useContext(EnergyContext);

export const EnergyProvider = ({ children }) => {
    const [stats, setStats] = useState({ totalDevices: 0, activeDevices: 0, currentLoad: 0 });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/api/stats/dashboard`);
            setStats(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching energy stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <EnergyContext.Provider value={{ stats, fetchStats, loading }}>
            {children}
        </EnergyContext.Provider>
    );
};
