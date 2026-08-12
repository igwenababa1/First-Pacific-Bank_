
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Account, AccountType } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, VerifiedBadgeIcon, SpinnerIcon, ClockIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

interface AccountCarouselCardProps {
    account: Account;
    isBalanceVisible: boolean;
    displayCurrency: string;
    exchangeRate: number;
}

const AccountCarouselCard: React.FC<AccountCarouselCardProps> = ({ account, isBalanceVisible, displayCurrency, exchangeRate }) => {
    const { t } = useLanguage();

    if (account.status === 'Provisioning') {
        return (
            <div className="relative w-full rounded-2xl shadow-digital-inset overflow-hidden text-slate-600 dark:text-slate-700 bg-slate-100 dark:bg-slate-700/50 flex flex-col items-center justify-center text-center p-6" style={{ height: '220px' }}>
                <SpinnerIcon className="w-10 h-10 text-primary" />
                <h4 className="font-bold text-lg mt-3 text-slate-700 dark:text-slate-800">Account Provisioning</h4>
                <p className="text-sm mt-1">This may take 4-5 business hours. We'll notify you when it's ready.</p>
            </div>
        );
    }
    if (account.status === 'Under Review') {
        return (
            <div className="relative w-full rounded-2xl shadow-digital-inset overflow-hidden text-slate-600 dark:text-slate-700 bg-slate-100 dark:bg-slate-700/50 flex flex-col items-center justify-center text-center p-6" style={{ height: '220px' }}>
                <ClockIcon className="w-10 h-10 text-yellow-400" />
                <h4 className="font-bold text-lg mt-3 text-slate-700 dark:text-slate-800">Account Under Review</h4>
                <p className="text-sm mt-1">Your account is pending approval by our customer service team.</p>
            </div>
        );
    }
    
    const convertedBalance = account.balance * exchangeRate;

    const accountBackgrounds: { [key in AccountType]?: string } = {
        [AccountType.CHECKING]: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop',
        [AccountType.SAVINGS]: 'https://images.unsplash.com/photo-1579621970795-87f9ac75d601?q=80&w=1200&auto=format&fit=crop',
        [AccountType.BUSINESS]: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    };
    
    const backgroundUrl = accountBackgrounds[account.type] || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop';

    return (
        <motion.div 
            whileHover={{ scale: 1.025, y: -4, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)" }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            className="group relative w-full rounded-2xl shadow-lg overflow-hidden text-slate-900 dark:text-slate-900 cursor-pointer" 
            style={{ height: '220px' }}
        >
            <img
                src={backgroundUrl}
                alt={`${account.nickname || account.type} background`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
            
            <div className="relative z-20 p-6 flex flex-col h-full">
                <div>
                    <h4 className="font-bold text-xl drop-shadow-md">{account.nickname || account.type}</h4>
                    <p className="text-sm font-mono opacity-80 drop-shadow-sm">{account.accountNumber}</p>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                    <p className="text-sm opacity-80">{t('label_available_balance')}</p>
                    <p className={`text-4xl font-bold tracking-wider transition-all duration-300 ${!isBalanceVisible ? 'blur-md' : ''}`} style={{ textShadow: '1px 1px 5px rgba(0,0,0,0.5)' }}>
                        {isBalanceVisible ? convertedBalance.toLocaleString('en-US', { style: 'currency', currency: displayCurrency }) : '$ ••••••••'}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                       <VerifiedBadgeIcon className="w-4 h-4 primary-" />
                       <span>{account.features[0]}</span>
                    </div>
                    <Link to="/accounts" className="text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors">
                        {t('action_view_details')} &rarr;
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

interface AccountCarouselProps {
    accounts: Account[];
    isBalanceVisible: boolean;
    displayCurrency: string;
    exchangeRate: number;
}

export const AccountCarousel: React.FC<AccountCarouselProps> = ({ accounts, isBalanceVisible, displayCurrency = 'USD', exchangeRate = 1 }) => {
    const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
  
    const handlePrev = useCallback(() => {
        setCurrentAccountIndex((prevIndex) => (prevIndex === 0 ? accounts.length - 1 : prevIndex - 1));
    }, [accounts.length]);

    const handleNext = useCallback(() => {
        setCurrentAccountIndex((prevIndex) => (prevIndex === accounts.length - 1 ? 0 : prevIndex + 1));
    }, [accounts.length]);

    return (
        <div className="relative" ref={carouselRef} tabIndex={0}>
            <div className="overflow-hidden relative">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentAccountIndex * 100}%)` }}
                >
                    {accounts.map((account) => (
                        <div key={account.id} className="w-full flex-shrink-0 px-2">
                            <AccountCarouselCard account={account} isBalanceVisible={isBalanceVisible} displayCurrency={displayCurrency} exchangeRate={exchangeRate} />
                        </div>
                    ))}
                </div>
            </div>

            {accounts.length > 1 && (
                <>
                    <button onClick={handlePrev} className="absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full bg-white dark:bg-white/50 backdrop-blur-md text-slate-900 dark:text-slate-900/70 hover:text-slate-900 dark:text-slate-900 hover:bg-slate-100 dark:bg-slate-700/70 border border-slate-200 dark:border-black/5 transition-all z-10 shadow-lg">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button onClick={handleNext} className="absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full bg-white dark:bg-white/50 backdrop-blur-md text-slate-900 dark:text-slate-900/70 hover:text-slate-900 dark:text-slate-900 hover:bg-slate-100 dark:bg-slate-700/70 border border-slate-200 dark:border-black/5 transition-all z-10 shadow-lg">
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </>
            )}
        </div>
    );
};
