import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BellIcon,
  GlobeAmericasIcon,
  SearchIcon,
  MoonIcon,
  SunIcon,
  XIcon,
  UserCircleIcon,
  WalletIcon,
  UserGroupIcon,
  ActivityIcon,
  BankIcon,
  FirstPacificLogo,
  SendIcon,
  Cog8ToothIcon,
  MenuIcon,
} from "./Icons";
import {
  Notification,
  View,
  UserProfile,
  Account,
  Transaction,
  Recipient,
} from "../types";
import { MegaMenu } from "./MegaMenu";
import { NotificationsPanel } from "./NotificationsPanel";
import { useLanguage } from "../contexts/LanguageContext";
import { ProfileDropdown } from "./ProfileDropdown";
import { CurrencySelector } from "./CurrencySelector";
import { LanguageSelector } from "./LanguageSelector";
import { useCurrency } from "../contexts/CurrencyContext";
import { useTheme } from "../contexts/ThemeContext";
import { useSystemOptions } from "../hooks/useSystemOptions";
import { Lock, Megaphone, Monitor, Camera as LucideCamera, AlertTriangle } from "lucide-react";
import { db } from "../services/database";

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  onOpenLogoutConfirm: () => void;
  notifications: Notification[];
  onMarkNotificationsAsRead: () => void;
  userProfile: UserProfile;
  onOpenLanguageSelector: () => void;
  onOpenGlobalPrefs: () => void;
  onUpdateProfilePicture: (url: string) => void;
  onOpenSendMoneyFlow: (
    initialTab?: "send" | "split" | "deposit",
    openQr?: boolean,
  ) => void;
  onOpenWireTransfer: (data?: any) => void;
  onOpenAdminDashboard?: () => void;
  accounts: Account[];
  transactions: Transaction[];
  recipients: Recipient[];
  onLockSession?: () => void;
  platformSettings?: any;
  onUpdatePlatformSettings?: (settings: any) => void;
  totalNetWorth?: number;
}

const MarketTicker = () => (
  <div className="bg-slate-50 dark:bg-[#0c111c] text-slate-500 dark:text-slate-600 text-xs py-2 overflow-hidden border-b border-slate-200 dark:border-black/5 relative z-50">
    <div className="flex items-center animate-marquee whitespace-nowrap">
      <div className="flex space-x-12 px-6">
        <span className="flex items-center font-mono">
          <span className="font-bold text-slate-600 dark:text-slate-700 mr-2 tracking-wider">
            S&P 500
          </span>{" "}
          5,245.12 <span className="text-emerald-400 ml-2">▲ 0.45%</span>
        </span>
        <span className="flex items-center font-mono">
          <span className="font-bold text-slate-600 dark:text-slate-700 mr-2 tracking-wider">
            NASDAQ
          </span>{" "}
          16,428.82 <span className="text-emerald-400 ml-2">▲ 0.82%</span>
        </span>
        <span className="flex items-center font-mono">
          <span className="font-bold text-slate-600 dark:text-slate-700 mr-2 tracking-wider">
            EUR/USD
          </span>{" "}
          1.0842 <span className="text-red-400 ml-2">▼ 0.12%</span>
        </span>
        <span className="flex items-center font-mono">
          <span className="font-bold text-slate-600 dark:text-slate-700 mr-2 tracking-wider">
            GBP/USD
          </span>{" "}
          1.2635 <span className="text-emerald-400 ml-2">▲ 0.05%</span>
        </span>
        <span className="flex items-center font-mono">
          <span className="font-bold text-slate-600 dark:text-slate-700 mr-2 tracking-wider">
            GOLD
          </span>{" "}
          2,345.50 <span className="text-emerald-400 ml-2">▲ 0.30%</span>
        </span>
        <span className="flex items-center font-mono">
          <span className="font-bold text-slate-600 dark:text-slate-700 mr-2 tracking-wider">
            BTC/USD
          </span>{" "}
          68,420.10 <span className="text-emerald-400 ml-2">▲ 1.20%</span>
        </span>
        {/* Repeat for seamless loop */}
        <span className="flex items-center font-mono">
          <span className="font-bold text-slate-600 dark:text-slate-700 mr-2 tracking-wider">
            S&P 500
          </span>{" "}
          5,245.12 <span className="text-emerald-400 ml-2">▲ 0.45%</span>
        </span>
        <span className="flex items-center font-mono">
          <span className="font-bold text-slate-600 dark:text-slate-700 mr-2 tracking-wider">
            NASDAQ
          </span>{" "}
          16,428.82 <span className="text-emerald-400 ml-2">▲ 0.82%</span>
        </span>
        <span className="flex items-center font-mono">
          <span className="font-bold text-slate-600 dark:text-slate-700 mr-2 tracking-wider">
            EUR/USD
          </span>{" "}
          1.0842 <span className="text-red-400 ml-2">▼ 0.12%</span>
        </span>
      </div>
    </div>
  </div>
);

export const SyncStatusIndicator: React.FC = () => {
  const [state, setState] = useState<'synced' | 'syncing' | 'offline'>(
    navigator.onLine ? 'synced' : 'offline'
  );
  const [checksum, setChecksum] = useState<string>('PRB-MAIN');

  useEffect(() => {
    const handleOnline = () => setState('synced');
    const handleOffline = () => setState('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleSyncState = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.state) {
        setState(customEvent.detail.state);
        if (customEvent.detail.checksum) {
          setChecksum(customEvent.detail.checksum);
        }
      }
    };

    // Also trigger brief sync pulse on any db updates
    const triggerSyncPulse = () => {
      setState('syncing');
      const timer = setTimeout(() => {
        setState(navigator.onLine ? 'synced' : 'offline');
        // Generate a random-looking short ledger checksum
        const randHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
        setChecksum(`PRB-${randHex}`);
      }, 1500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('ledger_sync_state', handleSyncState);
    window.addEventListener('db_accounts_updated', triggerSyncPulse);
    window.addEventListener('db_transactions_updated', triggerSyncPulse);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('ledger_sync_state', handleSyncState);
      window.removeEventListener('db_accounts_updated', triggerSyncPulse);
      window.removeEventListener('db_transactions_updated', triggerSyncPulse);
    };
  }, []);

  return (
    <div className="hidden md:flex items-center gap-2 bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] pl-2.5 pr-3.5 py-1 sm:py-1.5 rounded-xl cursor-default group animate-fade-in" title={`Ledger node synchronized. Code: ${checksum}`}>
      <span className="relative flex h-2 w-2">
        {state === 'synced' && (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </>
        )}
        {state === 'syncing' && (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </>
        )}
        {state === 'offline' && (
          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
        )}
      </span>
      <div className="flex flex-col text-left">
        <span className="text-[7px] font-sans font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest leading-none">
          GLOBAL LEDGER
        </span>
        <span className={`text-[9px] font-mono font-bold leading-none mt-1 uppercase tracking-tight ${
          state === 'synced' ? 'text-emerald-500' :
          state === 'syncing' ? 'text-amber-500' :
          'text-slate-600'
        }`}>
          {state === 'synced' && `ONLINE • ${checksum}`}
          {state === 'syncing' && 'SYNCING...'}
          {state === 'offline' && 'OFFLINE CACHE'}
        </span>
      </div>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  isMenuOpen,
  onOpenLogoutConfirm,
  notifications,
  onMarkNotificationsAsRead,
  userProfile,
  onOpenLanguageSelector,
  onOpenGlobalPrefs,
  onUpdateProfilePicture,
  onOpenSendMoneyFlow,
  onOpenWireTransfer,
  onOpenAdminDashboard,
  accounts,
  transactions,
  recipients,
  onLockSession,
  platformSettings,
  onUpdatePlatformSettings,
  totalNetWorth,
}) => {
  const systemOptions = useSystemOptions();
  const { displayCurrency, setDisplayCurrency, formatCurrency } = useCurrency();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [pulseState, setPulseState] = useState<'none' | 'green' | 'red'>('none');
  const [isPanicModalOpen, setIsPanicModalOpen] = useState(false);
  const previousBalanceRef = useRef<number | null>(null);

  const [headerImgError, setHeaderImgError] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'FP';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handlePanicFreeze = async () => {
    try {
      await db.updateUserProfile(userProfile.email, { isFrozen: true });
      setIsPanicModalOpen(false);
      // Optional: force a page reload or let real-time listener update state.
    } catch (e) {
      console.error('Failed to freeze account', e);
    }
  };

  const totalBalance = useMemo(() => {
    if (typeof totalNetWorth === 'number') {
      return totalNetWorth;
    }
    return (accounts || [])
      .filter((acc) => acc.type !== "External Linked Account")
      .reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }, [accounts, totalNetWorth]);

  useEffect(() => {
    if (previousBalanceRef.current !== null && previousBalanceRef.current !== totalBalance) {
      const diff = totalBalance - previousBalanceRef.current;
      if (diff > 0) {
        setPulseState("green");
        const timer = setTimeout(() => setPulseState("none"), 1500);
        return () => clearTimeout(timer);
      } else if (diff < 0) {
        setPulseState("red");
        const timer = setTimeout(() => setPulseState("none"), 1500);
        return () => clearTimeout(timer);
      }
    }
    previousBalanceRef.current = totalBalance;
  }, [totalBalance]);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    accounts: Account[];
    recipients: Recipient[];
    transactions: Transaction[];
  }>({ accounts: [], recipients: [], transactions: [] });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || !isSearchFocused) {
      setSearchResults({ accounts: [], recipients: [], transactions: [] });
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    const filteredAccounts = accounts.filter(
      (acc) =>
        acc.nickname?.toLowerCase().includes(lowerQuery) ||
        acc.accountNumber.includes(lowerQuery) ||
        acc.type.toLowerCase().includes(lowerQuery),
    );

    const filteredRecipients = recipients.filter(
      (rec) =>
        rec.fullName.toLowerCase().includes(lowerQuery) ||
        rec.nickname?.toLowerCase().includes(lowerQuery) ||
        rec.bankName.toLowerCase().includes(lowerQuery) ||
        rec.id.toLowerCase().includes(lowerQuery), // Added ID check
    );

    const filteredTransactions = transactions.filter(
      (tx) =>
        tx.description.toLowerCase().includes(lowerQuery) ||
        tx.recipient.fullName.toLowerCase().includes(lowerQuery) ||
        String(tx.sendAmount).includes(lowerQuery) ||
        tx.purpose?.toLowerCase().includes(lowerQuery), // Added purpose check
    );

    setSearchResults({
      accounts: filteredAccounts,
      recipients: filteredRecipients,
      transactions: filteredTransactions,
    });
  }, [searchQuery, isSearchFocused, accounts, recipients, transactions]);

  const handlePictureClick = () => {
    profilePicInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image smaller than 2MB.");
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          onUpdateProfilePicture(reader.result as string);
          setIsUploading(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <MegaMenu
        isOpen={isMenuOpen}
        onClose={onMenuToggle}
        userProfile={userProfile}
        onOpenSendMoneyFlow={onOpenSendMoneyFlow}
        onOpenWireTransfer={onOpenWireTransfer}
        onOpenLogoutConfirm={onOpenLogoutConfirm}
      />

      <header className="sticky top-0 z-40 bg-[var(--bg-color)]/90 backdrop-blur-md border-b border-slate-100 dark:border-black/5 shadow-sm transition-all duration-300">
        <MarketTicker />

        {systemOptions?.platformAnnouncement?.active && (
          <div
            className={`py-2 px-4 flex items-center justify-center gap-3 text-white shadow-lg relative z-50 text-center ${
              systemOptions.platformAnnouncement.type === "critical"
                ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-600"
                : systemOptions.platformAnnouncement.type === "warning"
                  ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900"
                  : "bg-gradient-to-r primary- via-sky-500 primary-"
            }`}
          >
            <Megaphone
              className={`w-5 h-5 flex-shrink-0 animate-pulse ${systemOptions.platformAnnouncement.type === "warning" ? "text-slate-900" : "text-white"}`}
            />
            <div
              className={`text-[11px] sm:text-xs font-sans font-black tracking-widest leading-tight uppercase ${systemOptions.platformAnnouncement.type === "warning" ? "text-slate-900" : "text-white"}`}
              dangerouslySetInnerHTML={{
                __html: systemOptions.platformAnnouncement.message,
              }}
            />
          </div>
        )}

        <div className="mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left Side: Logo (Refined, Premium Minimalist Fintech Capsule) */}
            <div className="flex items-center shrink-0 gap-4">
              <Link
                to="/dashboard"
                className="flex flex-row items-center gap-2 group transition-opacity"
              >
                <div className="flex items-center bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] pl-2 pr-3 py-1 rounded-xl gap-2 transition-all duration-300 shadow-sm">
                  <FirstPacificLogo className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform duration-500" />
                  <span className="font-sans font-black text-[10px] text-slate-900 dark:text-slate-900 tracking-[0.3em] uppercase leading-none mt-0.5">
                    FIRST
                    <span className="font-light text-slate-500 dark:text-slate-600">
                      PACIFIC
                    </span>
                  </span>
                </div>
              </Link>

              {/* Total Balance capsule */}
              <div 
                id="header-balance-display"
                className={`flex flex-col items-start px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl border transition-all duration-500 ${
                  pulseState === "green"
                    ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)] scale-105"
                    : pulseState === "red"
                    ? "bg-rose-500/10 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.25)] scale-105"
                    : "bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05]"
                }`}
              >
                <span className="text-[8px] font-sans font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                  TOTAL RESERVE
                </span>
                <span className={`text-xs sm:text-sm font-mono font-black tracking-tight leading-none transition-colors duration-300 ${
                  pulseState === "green"
                    ? "text-emerald-400 font-extrabold animate-pulse"
                    : pulseState === "red"
                    ? "text-rose-400 font-extrabold animate-pulse"
                    : "text-slate-900 dark:text-slate-900"
                }`}>
                  {formatCurrency(totalBalance)}
                </span>
              </div>

              {/* Real-time sync-status indicator */}
              <SyncStatusIndicator />
            </div>

            {/* Center: Search (Desktop) - Now takes more space since nav is gone */}
            <div className="hidden lg:block flex-1 max-w-xl mx-4 relative">
              <div className="relative group">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transform text-slate-500 dark:text-slate-600 group-focus-within:text-primary transition-colors h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search portfolios, transactions, or contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                  className="w-full rounded-full bg-[var(--bg-color)] py-3 pl-12 pr-4 text-xs font-medium text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary outline-none transition-all duration-300 neumorphic-panel-inset"
                />
              </div>
              {/* Search Results Dropdown */}
              {isSearchFocused && searchQuery.length > 1 && (
                <div className="absolute top-full mt-2 w-full bg-white/95 dark:bg-[#0c111c]/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 dark:border-black/5 overflow-hidden z-50 animate-fade-in-up">
                  <ul className="max-h-96 overflow-y-auto custom-scrollbar">
                    {searchResults.accounts.length > 0 && (
                      <li className="px-4 pt-3 pb-1 text-xs font-bold text-primary uppercase tracking-wider">
                        Accounts
                      </li>
                    )}
                    {searchResults.accounts.map((acc) => (
                      <li key={acc.id}>
                        <Link
                          to="/accounts"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-sm text-slate-600 dark:text-slate-700"
                        >
                          <BankIcon className="w-4 h-4" />
                          {acc.nickname || acc.type}
                        </Link>
                      </li>
                    ))}

                    {searchResults.recipients.length > 0 && (
                      <li className="px-4 pt-3 pb-1 text-xs font-bold text-primary uppercase tracking-wider">
                        Recipients
                      </li>
                    )}
                    {searchResults.recipients.map((rec) => (
                      <li key={rec.id}>
                        <Link
                          to="/recipients"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-sm text-slate-600 dark:text-slate-700"
                        >
                          <UserGroupIcon className="w-4 h-4" />
                          {rec.fullName}
                        </Link>
                      </li>
                    ))}

                    {searchResults.transactions.length > 0 && (
                      <li className="px-4 pt-3 pb-1 text-xs font-bold text-primary uppercase tracking-wider">
                        Transactions
                      </li>
                    )}
                    {searchResults.transactions.map((tx) => (
                      <li key={tx.id}>
                        <Link
                          to="/history"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-sm text-slate-600 dark:text-slate-700"
                        >
                          <ActivityIcon className="w-4 h-4" />
                          {tx.description}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Side: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto">
              <div className="header-nav-container flex items-center gap-1 sm:gap-1.5">
                {/* Quick Scan QR Payment Button */}
                <button
                  onClick={() => onOpenSendMoneyFlow("send", true)}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors border border-primary/20 mr-1 sm:mr-2"
                  title="Quick Scan P2P Payment"
                >
                  <LucideCamera className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  <span className="hidden sm:inline text-xs font-bold tracking-wide">
                    Quick Scan
                  </span>
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  <LanguageSelector className="text-slate-600 dark:text-slate-700 hover:text-slate-900 dark:text-slate-900 scale-90" />
                  <CurrencySelector
                    selectedCurrency={displayCurrency}
                    onSelect={setDisplayCurrency}
                    label="Change Currency"
                    className="text-slate-600 dark:text-slate-700 hover:text-slate-900 dark:text-slate-900 scale-90"
                  />
                </div>

                <button
                  onClick={onOpenGlobalPrefs}
                  className="p-1.5 rounded-full text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:text-slate-900 hover:bg-white/5 transition-colors hidden sm:block"
                  title="Global Preferences"
                >
                  <Cog8ToothIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={() => {
                    if (onUpdatePlatformSettings) {
                      const currentThemeMode =
                        platformSettings?.themeMode || "dark";
                      const nextThemeMode =
                        currentThemeMode === "dark"
                          ? "light"
                          : currentThemeMode === "light"
                            ? "system"
                            : "dark";
                      onUpdatePlatformSettings({ themeMode: nextThemeMode });
                    } else {
                      setTheme(theme === "dark" ? "light" : "dark");
                    }
                  }}
                  className="p-1.5 rounded-full text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:text-slate-900 hover:bg-white/5 transition-colors hidden sm:block relative group"
                  title="Toggle Theme"
                >
                  {(platformSettings?.themeMode || theme) === "dark" ? (
                    <MoonIcon className="h-5 w-5" />
                  ) : (platformSettings?.themeMode || theme) === "light" ? (
                    <SunIcon className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Monitor className="h-5 w-5 text-emerald-500" />
                  )}
                  <span className="absolute bottom-[-32px] right-1/2 translate-x-1/2 bg-white dark:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-black/5 shadow-lg text-[7px] font-black uppercase tracking-widest text-primary scale-0 group-hover:scale-100 transition-all z-[9999] whitespace-nowrap">
                    Mode: {platformSettings?.themeMode || theme}
                  </span>
                </button>

                {onLockSession && (
                  <button
                    onClick={onLockSession}
                    className="p-1.5 rounded-full text-slate-500 dark:text-slate-600 hover:text-rose-400 dark:hover:text-rose-400 hover:bg-white/5 transition-colors relative group"
                    title="Lock Session Port (Manual Inactivity Simulation)"
                  >
                    <Lock className="h-5 w-5 group-hover:text-rose-400 group-hover:scale-105 transition-all" />
                    <span className="absolute bottom-[-32px] right-1/2 translate-x-1/2 bg-white dark:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-black/5 shadow-lg text-[7px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 scale-0 group-hover:scale-100 transition-all z-[9999] whitespace-nowrap">
                      Lock Session
                    </span>
                  </button>
                )}

                {/* Menu Button - Always visible, compact, and styled with premium consistency */}
                <button
                  onClick={onMenuToggle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-slate-200 dark:border-black/5 hover:border-primary/45 hover:bg-white/10 text-slate-600 dark:text-slate-700 hover:text-slate-900 dark:text-slate-900 transition-all duration-300 shadow-sm active:scale-95 shrink-0"
                  title="Open Mega Menu"
                >
                  <MenuIcon className="h-4 w-4 text-emerald-400" />
                  <span className="font-sans font-black text-[9px] tracking-widest uppercase leading-none mt-0.5">
                    MENU
                  </span>
                </button>

                {/* Mobile Search Toggle */}
                <button
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="p-1.5 rounded-full text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:text-slate-900 hover:bg-white/5 transition-colors lg:hidden"
                >
                  <SearchIcon className="h-5 w-5" />
                </button>

                {/* Panic/Freeze Button */}
                <button
                  onClick={() => setIsPanicModalOpen(true)}
                  className="p-1.5 rounded-full text-red-500 hover:bg-red-500/10 transition-colors relative group ml-2"
                  title="Panic / Freeze Account"
                >
                  <AlertTriangle className="h-5 w-5" />
                </button>

                <div ref={notificationsRef} className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications && unreadCount > 0) {
                        onMarkNotificationsAsRead();
                      }
                    }}
                    className="p-1.5 rounded-full text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:text-slate-900 hover:bg-white/5 transition-colors relative group"
                    title="Notifications"
                  >
                    <BellIcon className="h-5 w-5 group-hover:text-primary transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-slate-900 dark:text-slate-900 ring-2 ring-[#0c111c] shadow-sm">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <NotificationsPanel
                      notifications={notifications}
                      onClose={() => setShowNotifications(false)}
                      onMarkNotificationsAsRead={onMarkNotificationsAsRead}
                    />
                  )}
                </div>

                <div ref={profileRef} className="relative ml-1 sm:ml-2">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-2.5 p-1 rounded-full text-slate-700 dark:text-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 transition-all ring-2 ring-emerald-500/30 hover:ring-emerald-400 dark:ring-white/10 dark:hover:ring-emerald-400/50 shadow-sm group relative cursor-pointer"
                    title={`${userProfile.name} (${userProfile.role === 'super_admin' ? 'Super Admin' : userProfile.position || 'Verified Customer'})`}
                  >
                    <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-black/5 shadow-sm bg-slate-100 dark:bg-white flex items-center justify-center">
                      {userProfile.profilePictureUrl && !headerImgError ? (
                        <img
                          src={userProfile.profilePictureUrl}
                          alt={userProfile.name || "User Profile"}
                          onError={() => setHeaderImgError(true)}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white font-black text-xs sm:text-sm flex items-center justify-center tracking-wider shadow-inner">
                          {getInitials(userProfile.name)}
                        </div>
                      )}
                      
                      {/* Live Status Verified Dot */}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white dark:border-[#0c111c] rounded-full shadow-sm" />
                    </div>

                    {/* Compact Name/Role Tag on Desktop */}
                    <div className="hidden xl:flex flex-col items-start pr-2.5 text-left">
                      <span className="text-[11px] font-bold text-slate-900 dark:text-slate-900 leading-none truncate max-w-[110px]">
                        {userProfile.name.split(' ')[0]}
                      </span>
                      <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 leading-none mt-1 uppercase tracking-wider">
                        {userProfile.role === 'super_admin' ? 'Super Admin' : userProfile.position || 'Verified'}
                      </span>
                    </div>
                  </button>
                  <input
                    type="file"
                    ref={profilePicInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  {showProfile && (
                    <ProfileDropdown
                      userProfile={userProfile}
                      onClose={() => setShowProfile(false)}
                      onOpenLogoutConfirm={onOpenLogoutConfirm}
                      onUpdateProfilePicture={onUpdateProfilePicture}
                      isUploading={isUploading}
                      handlePictureClick={handlePictureClick}
                      onOpenAdminDashboard={onOpenAdminDashboard}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-50/95 backdrop-blur-md animate-fade-in lg:hidden">
            <div className="p-4">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transform text-slate-500 dark:text-slate-600 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                  className="w-full rounded-full bg-white dark:bg-white border border-slate-200 dark:border-slate-300 py-3 pl-12 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  autoFocus
                />
              </div>
              {searchQuery.length > 1 && (
                <div className="mt-4 max-h-[70vh] overflow-y-auto">
                  <ul className="space-y-1">
                    {searchResults.accounts.length > 0 && (
                      <li className="px-2 pt-3 pb-1 text-xs font-bold text-primary uppercase tracking-wider">
                        Accounts
                      </li>
                    )}
                    {searchResults.accounts.map((acc) => (
                      <li key={acc.id}>
                        <Link
                          to="/accounts"
                          onClick={() => setIsMobileSearchOpen(false)}
                          className="flex items-center gap-3 px-2 py-2 hover:bg-white/5 text-sm text-slate-600 dark:text-slate-700 rounded-lg"
                        >
                          <BankIcon className="w-4 h-4" />
                          {acc.nickname || acc.type}
                        </Link>
                      </li>
                    ))}
                    {searchResults.recipients.length > 0 && (
                      <li className="px-2 pt-3 pb-1 text-xs font-bold text-primary uppercase tracking-wider">
                        Recipients
                      </li>
                    )}
                    {searchResults.recipients.map((rec) => (
                      <li key={rec.id}>
                        <Link
                          to="/recipients"
                          onClick={() => setIsMobileSearchOpen(false)}
                          className="flex items-center gap-3 px-2 py-2 hover:bg-white/5 text-sm text-slate-600 dark:text-slate-700 rounded-lg"
                        >
                          <UserGroupIcon className="w-4 h-4" />
                          {rec.fullName}
                        </Link>
                      </li>
                    ))}
                    {searchResults.transactions.length > 0 && (
                      <li className="px-2 pt-3 pb-1 text-xs font-bold text-primary uppercase tracking-wider">
                        Transactions
                      </li>
                    )}
                    {searchResults.transactions.map((tx) => (
                      <li key={tx.id}>
                        <Link
                          to="/history"
                          onClick={() => setIsMobileSearchOpen(false)}
                          className="flex items-center gap-3 px-2 py-2 hover:bg-white/5 text-sm text-slate-600 dark:text-slate-700 rounded-lg"
                        >
                          <ActivityIcon className="w-4 h-4" />
                          {tx.description}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-600"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        )}
      </header>

      {/* Panic / Freeze Modal */}
      {isPanicModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-50 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-black/5 overflow-hidden animate-fade-in-up">
            <div className="p-6">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-500 mb-4">
                <AlertTriangle className="w-8 h-8" />
                <h3 className="text-xl font-bold font-serif">Emergency Freeze</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-600 mb-6 leading-relaxed">
                Activating the freeze protocol will immediately lock all your accounts and linked cards.
                All outgoing transaction capabilities will be disabled until you complete an identity verification.
                To proceed, please verify your identity by typing <strong>FREEZE</strong> below.
              </p>

              <input 
                type="text" 
                placeholder="Type FREEZE"
                className="w-full bg-slate-50 dark:bg-[#0c111c] border border-slate-200 dark:border-black/5 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-bold uppercase"
                id="freeze-input-verification"
              />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsPanicModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-700 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    const input = document.getElementById('freeze-input-verification') as HTMLInputElement;
                    if (input && input.value.trim().toUpperCase() === 'FREEZE') {
                      handlePanicFreeze();
                    } else {
                      alert('Please type FREEZE to verify.');
                    }
                  }}
                  className="flex-1 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-500/30 transition-all"
                >
                  Confirm Freeze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
