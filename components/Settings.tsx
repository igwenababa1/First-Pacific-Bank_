
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, Cog8ToothIcon, LockClosedIcon, GlobeAmericasIcon, ChevronRightIcon, BellIcon } from './Icons';

const SettingsLink: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string }> = ({ to, icon, title, description }) => (
    <Link to={to} className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-white/40 border border-slate-100 dark:border-black/5 hover:bg-white dark:bg-white/80 hover:border-primary/30 transition-all group">
        <div className="p-3 bg-slate-50 dark:bg-slate-50 rounded-xl text-slate-500 dark:text-slate-600 group-hover:text-primary transition-colors shadow-inner border border-slate-100 dark:border-black/5">
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="text-slate-900 dark:text-slate-900 font-bold text-sm">{title}</h4>
            <p className="text-xs text-slate-500 group-hover:text-slate-500 dark:text-slate-600 transition-colors mt-0.5">{description}</p>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-slate-600 group-hover:text-slate-900 dark:text-slate-900 transition-colors" />
    </Link>
);

export const Settings: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20 animate-fade-in-up">
            <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-slate-900 tracking-tight">System Preferences</h2>
                <p className="text-slate-500 dark:text-slate-600 mt-2 font-medium">Manage your security protocols, notifications, and interface settings.</p>
            </div>

            <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Security & Access</p>
                <div className="space-y-3">
                    <SettingsLink 
                        to="/security" 
                        icon={<ShieldCheckIcon className="w-6 h-6" />} 
                        title="Security Center" 
                        description="Manage 2FA, Biometrics, and Trusted Devices." 
                    />
                    <SettingsLink 
                        to="/privacy" 
                        icon={<LockClosedIcon className="w-6 h-6" />} 
                        title="Privacy & Data" 
                        description="Control data sharing and marketing preferences." 
                    />
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Integrations & Open Banking</p>
                <div className="space-y-3">
                    <SettingsLink 
                        to="/integrations" 
                        icon={<GlobeAmericasIcon className="w-6 h-6 text-cyan-500" />} 
                        title="External Bank Accounts & Real-Time Sync" 
                        description="Link external bank accounts, brokerage portfolios, and configure API auto-sync settings." 
                    />
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Notifications & Interface</p>
                <div className="space-y-3">
                    <SettingsLink 
                        to="/alerts" 
                        icon={<BellIcon className="w-6 h-6" />} 
                        title="Alerts Center" 
                        description="Configure push, SMS, and email notifications." 
                    />
                    <SettingsLink 
                        to="/platform" 
                        icon={<Cog8ToothIcon className="w-6 h-6" />} 
                        title="Platform Features" 
                        description="Customize theme, icons, and HFT performance mode." 
                    />
                    <SettingsLink 
                        to="/platform" 
                        icon={<GlobeAmericasIcon className="w-6 h-6" />} 
                        title="Regional Settings" 
                        description="Language, currency format, and time zone." 
                    />
                </div>
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-50 rounded-3xl border border-slate-200 dark:border-black/5 text-center">
                <p className="text-xs text-slate-500 font-mono">Premium Reserved App v4.2.1 (Build 8829)</p>
                <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-widest">Secure Enclave Active</p>
            </div>
        </div>
    );
};

export default Settings;
