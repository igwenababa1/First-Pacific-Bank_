
import React, { useState } from 'react';
import { SpinnerIcon, LockClosedIcon, XIcon, ShieldCheckIcon, ExclamationCircleIcon, FaceIdIcon } from './Icons';
import { USER_PASSWORD } from './constants';
import { BiometricLogin } from './BiometricLogin';

interface LoginModalProps {
    onClose: () => void;
    onLogin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showBiometric, setShowBiometric] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        if (!navigator.onLine) {
            setError('No internet connection.');
            setIsProcessing(false);
            return;
        }

        setTimeout(() => {
            if (password === USER_PASSWORD) {
                onLogin();
                onClose();
            } else {
                setError('Incorrect password. Please try again.');
                setIsProcessing(false);
            }
        }, 1000);
    };

    if (showBiometric) {
        return (
            <BiometricLogin 
                onSuccess={() => {
                    onLogin();
                    onClose();
                }}
                onCancel={() => setShowBiometric(false)}
            />
        );
    }

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(120,119,198,0.2),rgba(255,255,255,0))] flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-sm rounded-[2rem] shadow-2xl overflow-y-auto max-h-[95vh] custom-scrollbar relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:text-white transition-colors">
                    <XIcon className="w-6 h-6" />
                </button>
                
                <div className="p-6 md:p-8 text-center">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10">
                        <LockClosedIcon className="w-8 h-8 text-primary" />
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Session Expired</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Please re-authenticate to continue your secure session.</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                className="w-full bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder-slate-700"
                                placeholder="Enter password"
                                autoFocus
                            />
                            {error && (
                                <div className="flex items-center gap-2 mt-2 text-red-500">
                                    <ExclamationCircleIcon className="w-4 h-4" />
                                    <p className="text-xs font-bold">{error}</p>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isProcessing || !password}
                            className="w-full py-4 bg-primary hover:bg-primary-600 text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isProcessing ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : <ShieldCheckIcon className="w-4 h-4" />}
                            {isProcessing ? 'Verifying...' : 'Authenticate'}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-50 dark:bg-slate-900 px-2 text-slate-500 font-bold tracking-widest">Or Secure Login</span>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={() => setShowBiometric(true)}
                            className="w-full py-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-slate-100 dark:border-white/5"
                        >
                            <FaceIdIcon className="w-5 h-5" />
                            Use Face ID / Touch ID
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
