import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Zap, LogOut, User, Menu, Bell } from 'lucide-react';
import OnboardingGuide from './OnboardingGuide';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${active
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
            >
                <Icon size={20} className={active ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                <span className="font-medium">{label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            </Link>
        );
    };

    return (
        <div className="flex h-screen text-slate-100 overflow-hidden relative">
            <div className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm z-0"></div>

            <div className="w-72 relative z-10 flex flex-col border-r border-white/10 bg-dark-900/50 backdrop-blur-xl">
                <div className="p-8">
                    <div className="flex items-center gap-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                        <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg text-white shadow-lg shadow-primary-500/20">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        ProU Energy
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
                    <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/devices" icon={Zap} label="Device Manager" />
                </nav>

                <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 p-[2px]">
                            <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center">
                                <User size={20} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-white">{user?.username}</p>
                            <p className="text-xs text-primary-400 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
                <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-md">
                    <h2 className="text-xl font-semibold text-white">
                        {location.pathname === '/' ? 'Overview' : location.pathname.replace('/', '').charAt(0).toUpperCase() + location.pathname.slice(2)}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-dark-900"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            <OnboardingGuide path={location.pathname} />
        </div>
    );
};

export default Layout;
