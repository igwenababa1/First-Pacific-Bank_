
import React, { useState, useEffect } from 'react';
import { Card, SpendingCategory } from '../types';
import { USER_PIN, SPENDING_CATEGORIES } from './constants';
import { db } from '../services/database';
import { 
    XIcon, 
    ShieldCheckIcon, 
    CheckCircleIcon, 
    SpinnerIcon, 
    WifiIcon, 
    PremiumReservedBankLogo, 
    LockClosedIcon, 
    EyeIcon, 
    EyeSlashIcon,
    GlobeAmericasIcon,
    ShoppingBagIcon,
    EntertainmentIcon,
    FoodDrinkIcon,
    Truck,
    ZapIcon,
    BriefcaseIcon,
    CreditCardIcon,
    ArrowRightIcon,
    ChevronLeftIcon
} from './Icons';

interface CreateVirtualCardModalProps {
    physicalCards: Card[];
    onClose: () => void;
    onAddVirtualCard: (data: { nickname: string; linkedCardId: string; spendingLimit: number | null; blockedCategories: SpendingCategory[] }) => void;
}

type Step = 'design' | 'controls' | 'authorize' | 'provisioning' | 'success';
type CardSkin = 'obsidian' | 'cobalt' | 'platinum' | 'rose_gold';

const SKINS: Record<CardSkin, string> = {
    obsidian: 'bg-slate-100 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900',
    cobalt: 'bg-gradient-to-br primary- to-indigo-900 primary- text-slate-900 dark:text-slate-900',
    platinum: 'bg-gradient-to-br from-slate-200 to-slate-400 border-slate-300 text-slate-900',
    rose_gold: 'bg-gradient-to-br from-rose-300 to-rose-400 border-rose-300 text-rose-950'
};

export const CreateVirtualCardModal: React.FC<CreateVirtualCardModalProps> = ({ physicalCards, onClose, onAddVirtualCard }) => {
    const [step, setStep] = useState<Step>('design');
    
    // Configuration State
    const [nickname, setNickname] = useState('');
    const [selectedSkin, setSelectedSkin] = useState<CardSkin>('cobalt');
    const [linkedCardId, setLinkedCardId] = useState(physicalCards[0]?.id || '');
    
    // Controls State
    const [limitType, setLimitType] = useState<'monthly' | 'per_transaction' | 'lifetime' | 'none'>('monthly');
    const [limitAmount, setLimitAmount] = useState('');
    const [blockedCategories, setBlockedCategories] = useState<Set<SpendingCategory>>(new Set());
    
    // Auth State
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    
    // Provisioning State
    const [provisionLogs, setProvisionLogs] = useState<string[]>([]);

    // --- Helpers ---
    
    const getCategoryIcon = (cat: string) => {
        const c = cat.toLowerCase();
        if (c.includes('food')) return <FoodDrinkIcon className="w-5 h-5" />;
        if (c.includes('travel')) return <GlobeAmericasIcon className="w-5 h-5" />;
        if (c.includes('transport')) return <Truck className="w-5 h-5" />;
        if (c.includes('shop')) return <ShoppingBagIcon className="w-5 h-5" />;
        if (c.includes('entertainment')) return <EntertainmentIcon className="w-5 h-5" />;
        if (c.includes('util')) return <ZapIcon className="w-5 h-5" />;
        return <BriefcaseIcon className="w-5 h-5" />;
    };

    const toggleCategory = (cat: SpendingCategory) => {
        setBlockedCategories(prev => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat);
            else next.add(cat);
            return next;
        });
    };

    const runProvisioning = () => {
        setStep('provisioning');
        const logs = [
            "Initiating cryptographic handshake...",
            "Allocating dedicated BIN range...",
            "Generating dynamic CVV2 algorithm...",
            "Linking to master settlement account...",
            "Registering with Visa Network...",
            "Encrypting virtual card metadata...",
            "Card Active."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i >= logs.length) {
                clearInterval(interval);
                onAddVirtualCard({
                    nickname,
                    linkedCardId,
                    spendingLimit: limitType === 'none' ? null : parseFloat(limitAmount),
                    blockedCategories: Array.from(blockedCategories)
                });
                setStep('success');
            } else {
                setProvisionLogs(prev => [...prev, logs[i]]);
                i++;
            }
        }, 800);
    };

    const handlePinSubmit = async () => {
        const email = db.getCurrentUserEmail();
        const isValid = await db.verifyPin(email, pin);
        if (!isValid) {
            setError('Invalid Authorization PIN');
            return;
        }
        runProvisioning();
    };

    // --- Render Components ---

    const CardPreview = () => (
        <div className={`relative w-full aspect-[1.58/1] rounded-2xl p-6 shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden border ${SKINS[selectedSkin]}`}>
            {/* Visual Noise/Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <PremiumReservedBankLogo className={`w-8 h-8 ${selectedSkin === 'platinum' ? 'text-slate-900' : 'text-slate-900 dark:text-slate-900'}`} />
                    <p className={`text-[8px] font-black uppercase tracking-[0.3em] mt-1 ${selectedSkin === 'platinum' ? 'text-slate-600' : 'text-slate-900 dark:text-slate-900/60'}`}>Virtual Node</p>
                </div>
                <WifiIcon className={`w-6 h-6 rotate-90 opacity-80 ${selectedSkin === 'platinum' ? 'text-slate-900' : 'text-slate-900 dark:text-slate-900'}`} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                     <div className={`h-8 w-11 rounded bg-gradient-to-br from-yellow-200 to-yellow-500 shadow-sm border border-yellow-600/50`}></div>
                     <span className={`font-mono text-lg tracking-widest opacity-50 ${selectedSkin === 'platinum' ? 'text-slate-900' : 'text-slate-900 dark:text-slate-900'}`}>•••• 4242</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className={`text-[7px] font-black uppercase tracking-widest mb-0.5 opacity-70 ${selectedSkin === 'platinum' ? 'text-slate-700' : 'text-slate-900 dark:text-slate-900'}`}>Card Label</p>
                        <p className={`text-sm font-bold uppercase tracking-wider truncate max-w-[200px] ${selectedSkin === 'platinum' ? 'text-slate-900' : 'text-slate-900 dark:text-slate-900'}`}>{nickname || 'UNTITLED CARD'}</p>
                    </div>
                    <div className="text-right">
                         <p className={`text-[7px] font-black uppercase tracking-widest mb-0.5 opacity-70 ${selectedSkin === 'platinum' ? 'text-slate-700' : 'text-slate-900 dark:text-slate-900'}`}>Valid Thru</p>
                         <p className={`font-mono text-xs font-bold ${selectedSkin === 'platinum' ? 'text-slate-900' : 'text-slate-900 dark:text-slate-900'}`}>12/29</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-slate-100/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-black/5 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-black/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-xl border border-primary/20">
                            <CreditCardIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-slate-900 tracking-tight uppercase">Virtual Forge</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Instant Provisioning</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:text-slate-900 transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-8">
                    
                    {step === 'design' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <CardPreview />

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-2 block">Card Nickname</label>
                                    <input 
                                        type="text" 
                                        value={nickname}
                                        onChange={e => setNickname(e.target.value)}
                                        maxLength={20}
                                        placeholder="e.g. Subscriptions, Travel Expenses"
                                        className="w-full bg-slate-100/40 border border-slate-200 dark:border-black/5 rounded-xl p-4 text-slate-900 dark:text-slate-900 font-bold outline-none focus:border-primary transition-all shadow-inner"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-2 block">Select Design Skin</label>
                                    <div className="flex gap-4">
                                        {(Object.keys(SKINS) as CardSkin[]).map(skin => (
                                            <button
                                                key={skin}
                                                onClick={() => setSelectedSkin(skin)}
                                                className={`w-10 h-10 rounded-full border-2 transition-all ${skin === selectedSkin ? 'border-primary scale-110 ring-2 ring-primary/20' : 'border-transparent hover:scale-105'}`}
                                            >
                                                <div className={`w-full h-full rounded-full ${SKINS[skin].split(' ')[0]}`}></div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-2 block">Funding Source</label>
                                    <select 
                                        value={linkedCardId} 
                                        onChange={e => setLinkedCardId(e.target.value)}
                                        className="w-full bg-white dark:bg-white border border-slate-200 dark:border-black/5 rounded-xl p-4 text-slate-900 dark:text-slate-900 font-bold outline-none focus:border-primary appearance-none"
                                    >
                                        {physicalCards.map(card => (
                                            <option key={card.id} value={card.id}>
                                                Physical {card.network} (•••• {card.lastFour})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={() => setStep('controls')}
                                disabled={!nickname.trim()}
                                className="w-full py-5 bg-white text-slate-900 font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl transition-all hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                Configure Controls <ArrowRightIcon className="w-4 h-4"/>
                            </button>
                        </div>
                    )}

                    {step === 'controls' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div>
                                <button onClick={() => setStep('design')} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 dark:text-slate-900 transition-colors mb-6">
                                    <ChevronLeftIcon className="w-4 h-4" /> Back to Design
                                </button>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-900 mb-2">Spending Architecture</h3>
                                <p className="text-slate-500 dark:text-slate-600 text-sm">Define the operational parameters for this virtual node.</p>
                            </div>

                            <div className="bg-white dark:bg-white/50 rounded-2xl p-6 border border-slate-100 dark:border-black/5 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Spending Cap</label>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {(['monthly', 'per_transaction', 'lifetime', 'none'] as const).map(type => (
                                            <button 
                                                key={type}
                                                onClick={() => setLimitType(type)}
                                                className={`py-3 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${limitType === type ? 'bg-primary text-slate-900 dark:text-slate-900 border-primary' : 'bg-slate-50 dark:bg-slate-50 text-slate-500 dark:text-slate-600 border-slate-100 dark:border-black/5 hover:border-slate-300 dark:border-black/10'}`}
                                            >
                                                {type.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                    {limitType !== 'none' && (
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-600 font-bold">$</span>
                                            <input 
                                                type="number" 
                                                value={limitAmount}
                                                onChange={e => setLimitAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-slate-100/40 border border-slate-200 dark:border-black/5 rounded-xl py-3 pl-8 pr-4 text-slate-900 dark:text-slate-900 font-mono font-bold outline-none focus:border-primary"
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-black/5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Category Restrictions</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {SPENDING_CATEGORIES.map(cat => {
                                            const isBlocked = blockedCategories.has(cat);
                                            return (
                                                <button 
                                                    key={cat}
                                                    onClick={() => toggleCategory(cat)}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isBlocked ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-slate-50 dark:bg-slate-50 border-slate-100 dark:border-black/5 text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:text-slate-900 hover:border-slate-300 dark:border-black/10'}`}
                                                >
                                                    <div className={isBlocked ? 'text-red-500' : 'text-slate-500'}>{getCategoryIcon(cat)}</div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wide">{cat}</span>
                                                    {isBlocked && <LockClosedIcon className="w-3 h-3 ml-auto text-red-500" />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setStep('authorize')}
                                className="w-full py-5 bg-white text-slate-900 font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl transition-all hover:bg-slate-200 flex items-center justify-center gap-3"
                            >
                                Initialize Node <ShieldCheckIcon className="w-4 h-4"/>
                            </button>
                        </div>
                    )}

                    {step === 'authorize' && (
                        <div className="flex flex-col items-center justify-center py-10 animate-fade-in text-center space-y-8">
                             <div className="w-24 h-24 bg-white dark:bg-white rounded-full flex items-center justify-center shadow-inner border border-slate-100 dark:border-black/5 relative mb-4">
                                <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping opacity-20"></div>
                                <ShieldCheckIcon className="w-10 h-10 text-primary" />
                             </div>
                             
                             <div>
                                 <h3 className="text-2xl font-black text-slate-900 dark:text-slate-900 uppercase tracking-tight">Security Signature</h3>
                                 <p className="text-slate-500 dark:text-slate-600 text-sm mt-2 font-medium">Enter your 4-digit PIN to generate this virtual card.</p>
                             </div>

                             <div className="w-full max-w-xs">
                                 <input 
                                    type="password" 
                                    value={pin}
                                    onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    maxLength={4}
                                    placeholder="••••"
                                    className="w-full bg-slate-100/50 border border-slate-200 dark:border-black/5 rounded-2xl py-6 text-center text-4xl tracking-[1em] text-slate-900 dark:text-slate-900 font-mono outline-none focus:border-primary shadow-inner transition-all"
                                    autoFocus
                                 />
                             </div>
                             {error && <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>}

                             <div className="flex gap-4 w-full pt-4">
                                 <button onClick={() => setStep('controls')} className="flex-1 py-4 text-slate-500 font-bold uppercase text-xs hover:text-slate-900 dark:text-slate-900 transition-colors">Cancel</button>
                                 <button onClick={handlePinSubmit} disabled={pin.length !== 4} className="flex-1 py-4 bg-primary text-slate-900 dark:text-slate-900 font-black uppercase text-xs rounded-xl shadow-lg disabled:opacity-50">Authorize</button>
                             </div>
                        </div>
                    )}

                    {step === 'provisioning' && (
                        <div className="flex flex-col items-center justify-center py-10 text-center h-full">
                            <div className="relative w-32 h-32 mb-10">
                                <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-200 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PremiumReservedBankLogo className="w-12 h-12 text-slate-900 dark:text-slate-900 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-slate-900 uppercase tracking-widest mb-6">Provisioning Node</h3>
                            <div className="bg-slate-100/50 p-6 rounded-2xl border border-slate-100 dark:border-black/5 w-full max-w-sm h-32 overflow-hidden flex flex-col justify-end shadow-inner">
                                {provisionLogs.slice(-3).map((log, i) => (
                                    <p key={i} className="text-[10px] font-mono text-left text-emerald-400/80 mb-1">
                                        <span className="text-slate-600 mr-2">{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                                        {log}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-8 animate-fade-in-up">
                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                                <CheckCircleIcon className="w-10 h-10 text-slate-900 dark:text-slate-900" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-900 uppercase tracking-tight mb-2">Card Active</h3>
                            <p className="text-slate-500 dark:text-slate-600 text-sm mb-10">Your virtual card is ready for immediate use.</p>
                            
                            <div className="transform scale-90 origin-top mb-8">
                                <CardPreview />
                            </div>

                            <button onClick={onClose} className="w-full py-5 bg-white text-slate-900 font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl hover:bg-slate-200 transition-all">
                                Return to Wallet
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
