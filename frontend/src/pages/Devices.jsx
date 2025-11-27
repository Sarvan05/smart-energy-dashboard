import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Power, Trash2, Cpu, Zap, Fan, Thermometer, AlertTriangle, Lock } from 'lucide-react';

const Devices = () => {
    const { user } = useAuth();
    const [connectedHardware, setConnectedHardware] = useState([]);
    const [hardwareConfig, setHardwareConfig] = useState({ name: '', type: 'AC' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        syncHardwareList();
    }, []);

    const syncHardwareList = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${apiUrl}/api/devices`);
            setConnectedHardware(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error('Failed to sync hardware:', err);
            setIsLoading(false);
        }
    };

    const registerNewHardware = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${apiUrl}/api/devices`, hardwareConfig);
            setHardwareConfig({ name: '', type: 'AC' });
            syncHardwareList();
        } catch (err) {
            console.error('Failed to register hardware:', err);
        }
    };

    const switchPowerState = async (id, currentStatus) => {
        if (user?.role !== 'admin') return;
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const newStatus = currentStatus === 'on' ? 'off' : 'on';
            await axios.put(`${apiUrl}/api/devices/${id}`, { status: newStatus });
            syncHardwareList();
        } catch (err) {
            console.error('Failed to switch power:', err);
        }
    };

    const calibrateLoad = async (id, value) => {
        if (user?.role !== 'admin') return;
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.put(`${apiUrl}/api/devices/${id}`, { lastReading: parseInt(value) });
            syncHardwareList();
        } catch (err) {
            console.error('Failed to calibrate load:', err);
        }
    };

    const resolveDeviceIcon = (type) => {
        switch (type) {
            case 'AC': return <Fan size={24} />;
            case 'Heater': return <Thermometer size={24} />;
            case 'Light': return <Zap size={24} />;
            default: return <Cpu size={24} />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Hardware Control</h1>
                    <p className="text-slate-400">Manage your connected grid infrastructure</p>
                </div>
                {user?.role !== 'admin' && (
                    <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2 text-yellow-400 text-sm">
                        <Lock size={16} />
                        <span>Observer Mode</span>
                    </div>
                )}
            </div>

            {user?.role === 'admin' && (
                <div className="glass-panel bg-slate-800/50 border-white/5 p-6 rounded-2xl">
                    <h2 className="text-xl font-semibold text-white mb-4">Register New Unit</h2>
                    <form onSubmit={registerNewHardware} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Unit Identifier</label>
                            <input
                                type="text"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                value={hardwareConfig.name}
                                onChange={(e) => setHardwareConfig({ ...hardwareConfig, name: e.target.value })}
                                required
                                placeholder="e.g., Main Server Rack Cooling"
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                            <select
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                value={hardwareConfig.type}
                                onChange={(e) => setHardwareConfig({ ...hardwareConfig, type: e.target.value })}
                            >
                                <option value="AC">Cooling (AC)</option>
                                <option value="Light">Lighting</option>
                                <option value="Heater">Heating</option>
                                <option value="Fan">Ventilation</option>
                                <option value="Other">Generic</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full md:w-auto btn-primary flex items-center justify-center gap-2">
                            <Plus size={20} /> Register
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectedHardware.map((unit) => (
                    <div key={unit._id} className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 group ${unit.status === 'on'
                        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-primary-500/50 shadow-lg shadow-primary-500/10'
                        : 'bg-slate-900/50 border-white/5 opacity-80 hover:opacity-100'
                        }`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${unit.status === 'on' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-800 text-slate-400'}`}>
                                    {resolveDeviceIcon(unit.type)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{unit.name}</h3>
                                    <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded mt-1 inline-block border border-white/5">{unit.type}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => switchPowerState(unit._id, unit.status)}
                                disabled={user?.role !== 'admin'}
                                className={`p-3 rounded-full transition-all duration-300 ${user?.role !== 'admin'
                                    ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                                    : unit.status === 'on'
                                        ? 'bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/30'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                <Power size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Operational Status</span>
                                <span className={`font-medium ${unit.status === 'on' ? 'text-green-400' : 'text-slate-500'}`}>
                                    {unit.status === 'on' ? 'Online' : 'Standby'}
                                </span>
                            </div>

                            <div className="bg-black/20 p-3 rounded-lg">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-slate-400">Load Calibration</span>
                                    <span className={`font-mono font-bold ${unit.lastReading > 2000 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                                        {unit.lastReading} W
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="3000"
                                    step="100"
                                    value={unit.lastReading || 0}
                                    onChange={(e) => calibrateLoad(unit._id, e.target.value)}
                                    className={`w-full h-2 rounded-lg appearance-none ${user?.role === 'admin' ? 'cursor-pointer accent-primary-500 bg-slate-700' : 'cursor-not-allowed bg-slate-800'}`}
                                    disabled={unit.status === 'off' || user?.role !== 'admin'}
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                    <span>Idle</span>
                                    <span>Nominal</span>
                                    <span className="text-red-400">Peak</span>
                                </div>
                            </div>
                        </div>

                        {unit.status === 'on' && (
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-500/20 blur-3xl rounded-full pointer-events-none"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Devices;
