import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EnergyChart from '../components/EnergyChart';
import { Activity, Zap, AlertTriangle, TrendingUp, Cpu } from 'lucide-react';

const Dashboard = () => {
    const [energyMetrics, setEnergyMetrics] = useState({ totalDevices: 0, activeDevices: 0, currentLoad: 0 });
    const [aiForecast, setAiForecast] = useState(null);
    const [consumptionHistory, setConsumptionHistory] = useState([]);
    const [systemNotifications, setSystemNotifications] = useState([]);

    useEffect(() => {
        loadDashboardData();
        const fallbackHistory = Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            value: Math.floor(Math.random() * 1000) + 500
        }));
        setConsumptionHistory(fallbackHistory);
    }, []);

    const loadDashboardData = () => {
        retrieveMetrics();
        retrieveForecast();
        retrieveNotifications();
    };

    const retrieveNotifications = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${apiUrl}/api/alerts`);
            setSystemNotifications(response.data);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        }
    };

    const retrieveMetrics = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${apiUrl}/api/stats/dashboard`);
            setEnergyMetrics(response.data);
        } catch (err) {
            console.error('Failed to load metrics:', err);
        }
    };

    const retrieveForecast = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${apiUrl}/api/stats/predict`);
            setAiForecast(response.data);
        } catch (err) {
            console.error('Failed to load AI forecast:', err);
        }
    };

    const MetricCard = ({ label, value, detail, icon: Icon, themeColor, gradientBg }) => (
        <div className={`relative overflow-hidden rounded-2xl p-6 border border-white/5 shadow-lg group hover:bg-white/5 transition-colors duration-300`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={100} />
            </div>
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg ${themeColor}`}>
                    <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider">{label}</h3>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
                <p className="text-xs text-slate-300 mt-2 flex items-center gap-1">
                    <TrendingUp size={12} /> {detail}
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">ProU Energy Monitor</h1>
                    <p className="text-slate-400">Live grid status and AI analytics</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Grid Active
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    label="Connected Hardware"
                    value={energyMetrics.totalDevices}
                    detail={`${energyMetrics.activeDevices} running now`}
                    icon={Cpu}
                    themeColor="bg-blue-500"
                    gradientBg="bg-gradient-to-br from-slate-800 to-slate-900"
                />
                <MetricCard
                    label="Real-time Load"
                    value={`${energyMetrics.currentLoad} W`}
                    detail="+12% vs avg"
                    icon={Activity}
                    themeColor="bg-emerald-500"
                    gradientBg="bg-gradient-to-br from-slate-800 to-slate-900"
                />
                <MetricCard
                    label="Smart Forecast"
                    value={`${aiForecast?.predictedLoad || 0} W`}
                    detail={`Peak in 2h (${aiForecast?.confidence} conf.)`}
                    icon={Zap}
                    themeColor="bg-purple-500"
                    gradientBg="bg-gradient-to-br from-purple-900/50 to-slate-900"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Usage Trends</h2>
                        <select className="bg-slate-900 border border-white/10 text-slate-300 text-sm rounded-lg px-3 py-1 outline-none focus:border-primary-500">
                            <option>Last 24 Hours</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <EnergyChart data={consumptionHistory} />
                </div>

                <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-xl font-semibold text-white mb-6">System Logs</h2>
                    <div className="space-y-4">
                        {systemNotifications.length === 0 ? (
                            <p className="text-slate-500 text-sm">System nominal. No logs.</p>
                        ) : (
                            systemNotifications.map((note) => (
                                <div key={note._id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                                    <div className="mt-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${note.type === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            <AlertTriangle size={16} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-slate-200 font-medium text-sm">{note.type === 'critical' ? 'Critical Event' : 'Advisory'}</h4>
                                        <p className="text-slate-400 text-xs mt-1">{note.message} ({note.deviceId?.name || 'Unknown Source'})</p>
                                        <p className="text-slate-500 text-[10px] mt-2">{new Date(note.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
