
import React, { useState, useMemo } from 'react';
import { EXTENDED_LANGUAGES, CURRENCIES_LIST } from './constants';
import { XIcon, SearchIcon, GlobeAmericasIcon, CurrencyDollarIcon, MapPinIcon, CheckCircleIcon, SunIcon } from './Icons';
import { Moon, Monitor } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTheme } from '../contexts/ThemeContext';

interface GlobalPreferencesModalProps {
    onClose: () => void;
}

type Tab = 'theme' | 'language' | 'currency' | 'region';

export const GlobalPreferencesModal: React.FC<GlobalPreferencesModalProps> = ({ onClose }) => {
    const { language, setLanguage } = useLanguage();
    const { displayCurrency, setDisplayCurrency } = useCurrency();
    const { theme, setTheme } = useTheme();
    
    const [activeTab, setActiveTab] = useState<Tab>('theme');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('US'); // Default Region preference

    const filteredLanguages = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return EXTENDED_LANGUAGES.filter(l => 
            l.name.toLowerCase().includes(term) || 
            l.nativeName.toLowerCase().includes(term) ||
            l.code.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    const filteredCurrencies = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return CURRENCIES_LIST.filter(c => 
            c.code.toLowerCase().includes(term) || 
            c.name.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    const handleLanguageSelect = (code: string) => {
        setLanguage(code);
    };

    const handleCurrencySelect = (code: string) => {
        setDisplayCurrency(code);
    };

    return (
        <div className="fixed inset-0 bg-slate-100/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-black/5 w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                
                {/* Header */}
                <div className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-black/5 flex justify-between items-center bg-slate-50 dark:bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-900">Global Preferences & Theme</h2>
                        <p className="text-slate-500 dark:text-slate-600 text-sm">Customize visual theme, language, and regional experience.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:text-slate-900 hover:bg-white/10 rounded-full transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs & Search */}
                <div className="flex-shrink-0 bg-white dark:bg-white/50">
                    <div className="flex border-b border-slate-100 dark:border-black/5 overflow-x-auto no-scrollbar">
                        <button 
                            onClick={() => { setActiveTab('theme'); setSearchTerm(''); }}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 min-w-[120px] ${activeTab === 'theme' ? 'text-primary bg-white/5 border-b-2 border-primary' : 'text-slate-500 dark:text-slate-600 hover:text-slate-700 dark:text-slate-800 hover:bg-white/5'}`}
                        >
                            <SunIcon className="w-4 h-4" /> Theme
                        </button>
                        <button 
                            onClick={() => { setActiveTab('language'); setSearchTerm(''); }}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 min-w-[120px] ${activeTab === 'language' ? 'text-primary bg-white/5 border-b-2 border-primary' : 'text-slate-500 dark:text-slate-600 hover:text-slate-700 dark:text-slate-800 hover:bg-white/5'}`}
                        >
                            <GlobeAmericasIcon className="w-4 h-4" /> Language
                        </button>
                        <button 
                            onClick={() => { setActiveTab('currency'); setSearchTerm(''); }}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 min-w-[120px] ${activeTab === 'currency' ? 'text-primary bg-white/5 border-b-2 border-primary' : 'text-slate-500 dark:text-slate-600 hover:text-slate-700 dark:text-slate-800 hover:bg-white/5'}`}
                        >
                            <CurrencyDollarIcon className="w-4 h-4" /> Currency
                        </button>
                    </div>
                    
                    {(activeTab === 'language' || activeTab === 'currency') && (
                        <div className="p-4 border-b border-slate-100 dark:border-black/5 relative">
                            <SearchIcon className="w-5 h-5 text-slate-500 absolute top-1/2 left-7 -translate-y-1/2" />
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={`Search ${activeTab}...`}
                                className="w-full bg-slate-100 border border-slate-200 dark:border-black/5 text-slate-900 dark:text-slate-900 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-2">
                    
                    {activeTab === 'theme' && (
                        <div className="p-6 space-y-8">
                            <div className="bg-white dark:bg-white/50 rounded-xl p-6 border border-slate-100 dark:border-black/5">
                                <h3 className="font-bold text-slate-900 dark:text-slate-900 mb-4">Premium Visual Theme</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-600 mb-6">
                                    Experience First Pacific Bank in Ultra Modern Dark Mode or pristine Light Mode. Select your preferred environment for optimal viewing.
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button 
                                        onClick={() => setTheme('system')}
                                        className={`flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border transition-all ${theme === 'system' ? 'bg-primary/5 border-primary/50 shadow-[0_0_20px_rgba(0,162,211,0.15)] ring-2 ring-primary/20' : 'bg-slate-50 dark:bg-slate-50 border-slate-200 dark:border-black/5 hover:border-slate-300 dark:hover:border-slate-200 dark:border-white/30'}`}
                                    >
                                        <div className="w-14 h-14 rounded-full bg-white dark:bg-white border border-slate-200 dark:border-black/5 flex items-center justify-center">
                                            <Monitor className="w-6 h-6 text-slate-500 dark:text-slate-600" />
                                        </div>
                                        <div className="text-center">
                                            <p className={`font-black text-sm ${theme === 'system' ? 'text-primary' : 'text-slate-900 dark:text-slate-900'}`}>System Default</p>
                                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Auto Match</p>
                                        </div>
                                    </button>

                                    <button 
                                        onClick={() => setTheme('dark')}
                                        className={`flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(0,162,211,0.15)] ring-2 ring-primary/20' : 'bg-slate-50 dark:bg-slate-50 border-slate-200 dark:border-black/5 hover:border-slate-300 dark:hover:border-slate-200 dark:border-white/30'}`}
                                    >
                                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 dark:border-black/5">
                                            <Moon className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className={`font-black text-sm ${theme === 'dark' ? 'text-primary' : 'text-slate-900 dark:text-slate-900'}`}>Cosmic Slate</p>
                                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Dark Mode</p>
                                        </div>
                                    </button>

                                    <button 
                                        onClick={() => setTheme('light')}
                                        className={`flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border transition-all ${theme === 'light' ? 'bg-white border-primary/50 shadow-[0_0_20px_rgba(255,255,255,0.2)] ring-2 ring-primary/20' : 'bg-slate-50 dark:bg-slate-50 border-slate-200 dark:border-black/5 hover:border-slate-300 dark:hover:border-slate-200 dark:border-white/30'}`}
                                    >
                                        <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                            <SunIcon className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <div className="text-center">
                                            <p className={`font-black text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-700 dark:text-slate-700'}`}>Ivory Silk</p>
                                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Light Mode</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'language' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
                            {filteredLanguages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageSelect(lang.code)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${language === lang.code ? 'bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(0,82,255,0.1)]' : 'bg-white dark:bg-white/30 border-slate-100 dark:border-black/5 hover:bg-white dark:bg-white hover:border-slate-300 dark:border-black/10'}`}
                                >
                                    <img 
                                        src={`https://flagsapi.com/${lang.countryCode}/shiny/64.png`} 
                                        alt={lang.name} 
                                        className="w-10 h-10 object-contain drop-shadow-md transition-transform group-hover:scale-110"
                                    />
                                    <div className="text-left">
                                        <p className={`font-bold ${language === lang.code ? 'text-slate-900 dark:text-slate-900' : 'text-slate-600 dark:text-slate-700'}`}>{lang.nativeName}</p>
                                        <p className="text-xs text-slate-500">{lang.name}</p>
                                    </div>
                                    {language === lang.code && <CheckCircleIcon className="w-6 h-6 text-primary ml-auto" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'currency' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
                            {filteredCurrencies.map(curr => (
                                <button
                                    key={curr.countryCode}
                                    onClick={() => handleCurrencySelect(curr.code)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${displayCurrency === curr.code ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white dark:bg-white/30 border-slate-100 dark:border-black/5 hover:bg-white dark:bg-white hover:border-slate-300 dark:border-black/10'}`}
                                >
                                    <img 
                                        src={`https://flagsapi.com/${curr.countryCode}/shiny/64.png`} 
                                        alt={curr.name} 
                                        className="w-10 h-10 object-contain drop-shadow-md transition-transform group-hover:scale-110"
                                    />
                                    <div className="text-left">
                                        <p className={`font-bold font-mono ${displayCurrency === curr.code ? 'text-slate-900 dark:text-slate-900' : 'text-slate-600 dark:text-slate-700'}`}>{curr.code}</p>
                                        <p className="text-xs text-slate-500">{curr.name}</p>
                                    </div>
                                    {displayCurrency === curr.code && <CheckCircleIcon className="w-6 h-6 text-emerald-500 ml-auto" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'region' && (
                        <div className="p-6 space-y-8">
                            <div className="bg-white dark:bg-white/50 rounded-xl p-6 border border-slate-100 dark:border-black/5">
                                <h3 className="font-bold text-slate-900 dark:text-slate-900 mb-4">Regional Formatting</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-600 mb-6">
                                    Adjust how dates, numbers, and time are displayed across the application.
                                </p>
                                
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-50/50 rounded-lg cursor-pointer border border-transparent hover:border-slate-200 dark:border-black/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center">
                                                {selectedRegion === 'US' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-slate-900">United States (MM/DD/YYYY)</p>
                                                <p className="text-xs text-slate-500">1,234.56 • 12-Hour Clock</p>
                                            </div>
                                        </div>
                                        <input type="radio" name="region" className="hidden" checked={selectedRegion === 'US'} onChange={() => setSelectedRegion('US')} />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-50/50 rounded-lg cursor-pointer border border-transparent hover:border-slate-200 dark:border-black/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center">
                                                {selectedRegion === 'EU' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-slate-900">Europe (DD.MM.YYYY)</p>
                                                <p className="text-xs text-slate-500">1.234,56 • 24-Hour Clock</p>
                                            </div>
                                        </div>
                                        <input type="radio" name="region" className="hidden" checked={selectedRegion === 'EU'} onChange={() => setSelectedRegion('EU')} />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-50/50 rounded-lg cursor-pointer border border-transparent hover:border-slate-200 dark:border-black/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center">
                                                {selectedRegion === 'ISO' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-slate-900">International (YYYY-MM-DD)</p>
                                                <p className="text-xs text-slate-500">1 234.56 • ISO 8601</p>
                                            </div>
                                        </div>
                                        <input type="radio" name="region" className="hidden" checked={selectedRegion === 'ISO'} onChange={() => setSelectedRegion('ISO')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                
                <div className="p-6 border-t border-slate-200 dark:border-black/5 bg-slate-50 dark:bg-slate-50 flex justify-end">
                    <button onClick={onClose} className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
