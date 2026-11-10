import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    SpinnerIcon,
    LockClosedIcon,
    XIcon,
    ShieldCheckIcon,
    ExclamationCircleIcon,
    FaceIdIcon,
} from './Icons';
import { USER_PASSWORD } from './constants';
import { BiometricLogin } from './BiometricLogin';

interface LoginModalProps {
    onClose: () => void;
    onLogin: () => void;
    onAuthenticate?: (password: string) => Promise<boolean>;
}

export const LoginModal: React.FC<LoginModalProps> = ({
    onClose,
    onLogin,
    onAuthenticate,
}) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showBiometric, setShowBiometric] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const handleAuthSuccess = useCallback(() => {
        onLogin();
        onClose();
    }, [onLogin, onClose]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);

            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, [onClose]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const trimmedPassword = password.trim();

        if (!trimmedPassword) {
            setError('Please enter your password.');
            return;
        }

        setError('');
        setIsProcessing(true);

        if (!navigator.onLine) {
            setError('No internet connection.');
            setIsProcessing(false);
            return;
        }

        try {
            let isVerified = false;

            if (onAuthenticate) {
                isVerified = await onAuthenticate(trimmedPassword);
            } else {
                await new Promise<void>((resolve) => {
                    timeoutRef.current = window.setTimeout(resolve, 600);
                });

                isVerified = trimmedPassword === USER_PASSWORD;
            }

            if (isVerified) {
                handleAuthSuccess();
                return;
            }

            setPassword('');
            setError('Incorrect password. Please try again.');
        } catch {
            setError('Unable to verify your login. Please try again.');
        } finally {
            setIsProcessing(false);

            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }
    };

    if (showBiometric) {
        return (
            <BiometricLogin
                onSuccess={handleAuthSuccess}
                onCancel={() => setShowBiometric(false)}
            />
        );
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-modal-title"
                className="relative w-full max-w-sm overflow-y-auto rounded-[2rem] border border-slate-200 bg-slate-50 shadow-2xl dark:border-white/10 dark:bg-slate-900"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label="Close login dialog"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-500 transition-colors hover:text-slate-900 dark:text-white"
                >
                    <XIcon className="h-6 w-6" />
                </button>

                <div className="p-6 text-center md:p-8">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white ring-1 ring-white/10 dark:bg-slate-800">
                        <LockClosedIcon className="h-8 w-8 text-primary" />
                    </div>

                    <h3
                        id="login-modal-title"
                        className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white"
                    >
                        Session Expired
                    </h3>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Please re-authenticate to continue your secure session.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
                        <div className="space-y-2 text-left">
                            <label
                                htmlFor="login-password"
                                className="pl-1 text-[10px] font-black uppercase tracking-widest text-slate-500"
                            >
                                Password
                            </label>

                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                onFocus={() => setError('')}
                                className="w-full rounded-xl border border-slate-200 bg-black/40 p-4 text-slate-900 outline-none transition-all focus:ring-2 focus:ring-primary dark:border-white/10 dark:text-white"
                                placeholder="Enter password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                aria-invalid={Boolean(error)}
                                aria-describedby={error ? 'login-password-error' : undefined}
                            />

                            {error && (
                                <div
                                    id="login-password-error"
                                    role="alert"
                                    aria-live="polite"
                                    className="mt-2 flex items-center gap-2 text-red-500"
                                >
                                    <ExclamationCircleIcon className="h-4 w-4" />
                                    <p className="text-xs font-bold">{error}</p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing || !password.trim()}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-900 shadow-lg transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
                        >
                            {isProcessing ? (
                                <SpinnerIcon className="h-4 w-4 animate-spin" />
                            ) : (
                                <ShieldCheckIcon className="h-4 w-4" />
                            )}
                            {isProcessing ? 'Verifying...' : 'Authenticate'}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-white/10" />
                            </div>

                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-50 px-2 font-bold tracking-widest text-slate-500 dark:bg-slate-900">
                                    Or Secure Login
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowBiometric(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-900 shadow-lg transition-all hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                        >
                            <FaceIdIcon className="h-5 w-5" />
                            Use Face ID / Touch ID
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
