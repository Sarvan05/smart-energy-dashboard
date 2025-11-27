import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import OnboardingGuide from '../components/OnboardingGuide';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(username, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="min-h-screen flex bg-dark-900 font-sans">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 text-primary-500 mb-6">
                            <div className="p-2 bg-primary-500/10 rounded-lg">
                                <Zap size={28} />
                            </div>
                            <span className="text-xl font-bold text-white">ProU Energy</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2">Welcome back</h2>
                        <p className="text-slate-400">Enter your credentials to access the dashboard.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-600"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 group">
                            Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="text-center text-slate-400">
                        Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium hover:underline">Create account</Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-dark-900/90 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop"
                    alt="Energy Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-16 text-white">
                    <h3 className="text-3xl font-bold mb-4">Smart Energy Management</h3>
                    <p className="text-lg text-slate-200 max-w-md">
                        Monitor, analyze, and optimize your energy consumption with our AI-powered dashboard.
                    </p>
                </div>
            </div>

            <OnboardingGuide path="/login" />
        </div>
    );
};

export default Login;
