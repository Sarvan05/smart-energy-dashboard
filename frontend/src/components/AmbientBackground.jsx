import React from 'react';
import { useEnergy } from '../context/EnergyContext';

const AmbientBackground = () => {
    const { stats } = useEnergy();
    const { currentLoad } = stats;

    let energyMood = 'calm';
    if (currentLoad > 2000) energyMood = 'critical';
    else if (currentLoad > 1000) energyMood = 'active';

    const determineAtmosphere = () => {
        switch (energyMood) {
            case 'critical':
                return 'bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-orange-900/40 via-rose-900/20 to-slate-950';
            case 'active':
                return 'bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-800 to-slate-950';
            default:
                return 'bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-slate-950';
        }
    };

    const calculatePulseRhythm = () => {
        switch (energyMood) {
            case 'critical': return 'duration-[4000ms]';
            case 'active': return 'duration-[6000ms]';
            default: return 'duration-[10000ms]';
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-950">
            <div className="absolute inset-0 bg-slate-950"></div>

            <div className={`absolute inset-0 opacity-60 transition-all ease-in-out ${calculatePulseRhythm()} ${determineAtmosphere()} blur-3xl`}></div>

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>

            <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/50 to-slate-950"></div>
        </div>
    );
};

export default AmbientBackground;
