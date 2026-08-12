
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { View } from '../types';
import {
    FirstPacificLogo,
    XSocialIcon,
    LinkedInIcon,
    InstagramIcon,
    AppleIcon,
    GooglePlayIcon,
    FdicIcon,
    EqualHousingLenderIcon,
    GlobeAmericasIcon,
    ShieldCheckIcon,
    LockClosedIcon,
    MapPinIcon,
    PhoneIcon,
    ChevronDownIcon,
    ServerIcon
} from './Icons';
import { LEGAL_CONTENT } from './constants';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
    onOpenSendMoneyFlow: (initialTab?: 'send' | 'split' | 'deposit') => void;
    openLegalModal: (title: string, content: string) => void;
}

interface FooterLinkProps {
    to?: `/${View}`;
    onClick?: () => void;
    children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, onClick, children }) => (
    <li className="group">
        {to ? (
            <Link 
                to={to} 
                className="text-sm text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:text-slate-900 transition-all duration-300 group-hover:translate-x-1 flex items-center relative"
            >
                <span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:-left-2 transition-all duration-300 text-primary-400">›</span>
                {children}
            </Link>
        ) : (
            <button 
                onClick={onClick} 
                className="text-sm text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:text-slate-900 transition-all duration-300 group-hover:translate-x-1 flex items-center relative"
            >
                <span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:-left-2 transition-all duration-300 text-primary-400">›</span>
                {children}
            </button>
        )}
    </li>
);

const DownloadButton: React.FC<{ icon: React.ReactNode; store: string; title: string; href: string }> = ({ icon, store, title, href }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-slate-200 dark:border-black/5 hover:border-slate-200 dark:border-white/30 text-slate-900 dark:text-slate-900 font-semibold py-2 px-4 rounded-xl transition-all duration-300 w-48 group backdrop-blur-md"
    >
        <div className="opacity-70 group-hover:opacity-100 transition-opacity">
            {icon}
        </div>
        <div className="text-left">
            <p className="text-[10px] leading-none opacity-60 uppercase tracking-wider">{store}</p>
            <p className="text-sm leading-tight font-bold">{title}</p>
        </div>
    </a>
);

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <span className="font-mono text-xs text-slate-500">
            {time.toUTCString().replace('GMT', 'UTC')}
        </span>
    );
};

const SystemStatus = () => (
    <div className="flex items-center space-x-2 bg-green-900/20 border border-green-500/20 rounded-full px-3 py-1">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </div>
        <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Systems Operational</span>
    </div>
);

export const Footer: React.FC<FooterProps> = ({ onOpenSendMoneyFlow, openLegalModal }) => {
    const [region, setRegion] = useState('Global (English)');
    const { t } = useLanguage();

    return (
        <footer className="relative bg-white dark:bg-slate-100 text-slate-600 dark:text-slate-700 font-sans overflow-hidden border-t border-slate-200 dark:border-black/5">
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2940&auto=format&fit=crop")' }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-slate-50/90 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/90"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,82,255,0.05),transparent_60%)]"></div>
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12">
                
                <div className="py-8 border-b border-slate-100 dark:border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-white rounded-lg border border-slate-200 dark:border-black/5 shadow-md">
                                <FirstPacificLogo className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="brand-text-premium text-[10px] tracking-[0.2em] leading-none">FIRST</span>
                                <span className="text-[8px] font-sans text-slate-500 uppercase tracking-[0.3em] leading-tight mt-1">Pacific Bank</span>
                            </div>
                        </div>
                        <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-white/10"></div>
                        <div className="hidden md:block">
                            <SystemStatus />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-600">
                            <LockClosedIcon className="w-3 h-3" />
                            <span>Encrypted Connection (TLS 1.3)</span>
                        </div>
                        <div className="hidden md:block h-4 w-px bg-slate-200 dark:bg-white/10"></div>
                        <LiveClock />
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-700 uppercase tracking-wider hover:text-slate-900 dark:text-slate-900 transition-colors">
                                <GlobeAmericasIcon className="w-4 h-4" />
                                <span>{region}</span>
                                <ChevronDownIcon className="w-3 h-3" />
                            </button>
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-white border border-slate-200 dark:border-black/5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto overflow-hidden">
                                {['Global (English)', 'Americas', 'EMEA', 'Asia Pacific'].map(r => (
                                    <button 
                                        key={r} 
                                        onClick={() => setRegion(r)} 
                                        className="block w-full text-left px-4 py-2 text-xs text-slate-600 dark:text-slate-700 hover:bg-white/5 hover:text-slate-900 dark:text-slate-900 transition-colors"
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
                    <div className="col-span-2 lg:col-span-2 pr-8">
                        <h3 className="text-slate-900 dark:text-slate-900 font-bold text-lg mb-6">Pioneering Global Wealth.</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-600 leading-relaxed mb-8">
                            First Pacific Bank combines the heritage of Swiss banking privacy with the speed of modern fintech. We provide a secure, unified platform for your global assets, operating across 190+ countries with real-time settlement.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <DownloadButton icon={<AppleIcon className="w-6 h-6"/>} store="Download on the" title="App Store" href="#" />
                            <DownloadButton icon={<GooglePlayIcon className="w-5 h-5"/>} store="GET IT ON" title="Google Play" href="#" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-900 text-xs uppercase tracking-widest mb-6 border-b border-slate-200 dark:border-black/5 pb-2 inline-block">{t('footer_private_banking')}</h4>
                        <ul className="space-y-3">
                            <FooterLink to="/accounts">{t('header_title_accounts')}</FooterLink>
                            <FooterLink to="/cards">{t('header_title_cards')}</FooterLink>
                            <FooterLink to="/invest">{t('header_title_invest')}</FooterLink>
                            <FooterLink to="/crypto">{t('header_title_crypto')}</FooterLink>
                            <FooterLink to="/loans">{t('header_title_loans')}</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-900 text-xs uppercase tracking-widest mb-6 border-b border-slate-200 dark:border-black/5 pb-2 inline-block">{t('footer_services')}</h4>
                        <ul className="space-y-3">
                            <FooterLink onClick={() => onOpenSendMoneyFlow('send')}>{t('quick_actions_send_money')}</FooterLink>
                            <FooterLink to="/flights">{t('header_title_flights')}</FooterLink>
                            <FooterLink to="/insurance">{t('header_title_insurance')}</FooterLink>
                            <FooterLink to="/checkin">{t('header_title_checkin')}</FooterLink>
                            <FooterLink to="/globalAid">{t('header_title_globalAid')}</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-900 text-xs uppercase tracking-widest mb-6 border-b border-slate-200 dark:border-black/5 pb-2 inline-block">{t('footer_governance')}</h4>
                        <ul className="space-y-3">
                            <FooterLink to="/about">{t('header_title_about')}</FooterLink>
                            <FooterLink to="/support">{t('header_title_support')}</FooterLink>
                            <FooterLink to="/security">{t('header_title_security')}</FooterLink>
                            <FooterLink to="/careers">Careers</FooterLink>
                            <FooterLink to="/contact">{t('header_title_contact')}</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-900 text-xs uppercase tracking-widest mb-6 border-b border-slate-200 dark:border-black/5 pb-2 inline-block">{t('footer_contact')}</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-600">
                                <MapPinIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>New York City: 45 Rockefeller Plaza, New York, NY 10111 (Rockefeller Center)</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-600 mt-2">
                                <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                                <span>contact@firstpaba.com</span>
                            </div>
                             <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-600">
                                <ServerIcon className="w-4 h-4 flex-shrink-0" />
                                <span>info@firstpaba.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-8 border-t border-slate-100 dark:border-black/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>&copy; {new Date().getFullYear()} First Pacific Bank, N.A.</span>
                        <div className="flex items-center gap-2">
                            <FdicIcon className="h-4" />
                            <EqualHousingLenderIcon className="h-4" />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-900 transition-colors"><XSocialIcon className="w-5 h-5"/></a>
                        <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-900 transition-colors"><LinkedInIcon className="w-5 h-5"/></a>
                        <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-900 transition-colors"><InstagramIcon className="w-5 h-5"/></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
