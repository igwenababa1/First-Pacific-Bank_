
import React, { useState, useMemo, useEffect } from 'react';
import { CURRENCIES_LIST } from './constants';
import { SearchIcon, XIcon, CheckCircleIcon } from './Icons';
import { getFlagUrl } from '../utils/flags';

interface CurrencySelectorProps {
    selectedCurrency: string;
    onSelect: (currency: string) => void;
    label: string;
    className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ selectedCurrency, onSelect, label, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedCurrencyInfo = CURRENCIES_LIST.find(c => c.code === selectedCurrency);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const filteredCurrencies = useMemo(() => {
        return CURRENCIES_LIST.filter(c =>
            c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleSelect = (currencyCode: string) => {
        onSelect(currencyCode);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 hover:bg-white/10 ${className}`}
                aria-label={label}
                title={label}
            >
                {selectedCurrencyInfo ? (
                    <>
                        <img
                            src={getFlagUrl(selectedCurrencyInfo.countryCode)}
                            alt={`${selectedCurrencyInfo.name} flag`}
                            className="w-5 h-5 rounded-full object-cover shadow-sm"
                        />
                        <span className="font-bold text-xs tracking-wider text-slate-700 dark:text-slate-800">{selectedCurrencyInfo.code}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-600 opacity-70">▼</span>
                    </>
                ) : (
                    <span className="text-xs font-bold">{selectedCurrency}</span>
                )}
            </button>

            {isOpen && (
                 <div 
                    className="fixed inset-0 bg-slate-100/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div 
                        className="bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-black/5 rounded-2xl shadow-2xl w-full max-w-md h-[80vh] flex flex-col animate-fade-in-up overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-black/5 flex items-center justify-between bg-slate-50 dark:bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-900">Select Currency</h3>
                            <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:text-slate-900 hover:bg-white/10 rounded-full transition-colors">
                                <XIcon className="w-5 h-5"/>
                            </button>
                        </div>
                         <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-black/5 relative bg-white dark:bg-white/30">
                            <SearchIcon className="w-5 h-5 text-slate-500 absolute top-1/2 left-7 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search currency (e.g. EUR, JPY)..."
                                className="w-full bg-slate-100 text-slate-900 dark:text-slate-900 p-3 pl-10 rounded-xl shadow-inner border border-slate-100 dark:border-black/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                autoFocus
                            />
                        </div>
                        <ul className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {filteredCurrencies.map(c => {
                                const isSelected = selectedCurrency === c.code;
                                return (
                                    <li key={c.countryCode}>
                                        <button
                                            onClick={() => handleSelect(c.code)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${isSelected ? 'bg-primary/20 border border-primary/50' : 'hover:bg-white/5 border border-transparent'}`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <img src={getFlagUrl(c.countryCode)} alt={c.name} className="w-8 h-8 rounded-full shadow-md object-cover group-hover:scale-110 transition-transform" />
                                                <div className="text-left">
                                                    <div className="flex items-center gap-2">
                                                        <p className={`font-bold font-mono ${isSelected ? 'text-primary-300' : 'text-slate-700 dark:text-slate-800'}`}>{c.code}</p>
                                                        <span className="text-xs text-slate-500 bg-white/5 px-1.5 rounded">{c.symbol}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-600">{c.name}</p>
                                                </div>
                                            </div>
                                            {isSelected && <CheckCircleIcon className="w-5 h-5 text-primary" />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                @keyframes fade-in-up {
                  0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                  100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
        </>
    );
};
