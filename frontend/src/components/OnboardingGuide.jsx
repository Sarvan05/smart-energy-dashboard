import React, { useState, useEffect } from 'react';
import { X, HelpCircle, ChevronRight } from 'lucide-react';

const guides = {
    '/': {
        title: 'Welcome to Your Dashboard',
        steps: [
            'This is your command center. Monitor real-time energy usage here.',
            'The "Current Load" card shows live power consumption.',
            'Check the "Predicted Peak" to see AI-forecasted usage spikes.',
            'Use the sidebar to navigate to Devices or Settings.'
        ]
    },
    '/devices': {
        title: 'Manage Your Devices',
        steps: [
            'Add new smart devices using the form at the top.',
            'Toggle devices ON/OFF instantly with the power button.',
            'Monitor individual power consumption for each device.',
            'Remove old devices using the trash icon.'
        ]
    },
    '/login': {
        title: 'Secure Access',
        steps: [
            'Log in to access your personalized energy data.',
            'Admins have full control over devices.',
            'Viewers can only monitor stats.'
        ]
    }
};

const OnboardingGuide = ({ path }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);

    const guide = guides[path] || guides['/'];

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-50 text-primary-600 animate-bounce"
        >
            <HelpCircle size={28} />
        </button>
    );

    return (
        <div className="fixed bottom-6 right-6 w-80 glass-panel rounded-2xl p-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-primary-700">
                    <HelpCircle size={20} />
                    <h3 className="font-bold text-lg">{guide.title}</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                </button>
            </div>

            <div className="min-h-[80px]">
                <p className="text-slate-600 leading-relaxed">
                    {guide.steps[currentStep]}
                </p>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                <div className="flex gap-1">
                    {guide.steps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-primary-500' : 'w-1.5 bg-slate-200'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => setCurrentStep(prev => (prev + 1) % guide.steps.length)}
                    className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                    {currentStep === guide.steps.length - 1 ? 'Start Over' : 'Next'} <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default OnboardingGuide;
