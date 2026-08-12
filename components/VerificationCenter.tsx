
import React, { useState } from 'react';
import { VerificationLevel } from '../types';
import { SpinnerIcon, CheckCircleIcon, DocumentCheckIcon, CameraIcon, IdentificationIcon, ShieldCheckIcon } from './Icons';
import { KYCForm } from './KYCForm';

interface VerificationCenterProps {
  currentLevel: VerificationLevel;
  onClose: (finalLevel: VerificationLevel) => void;
  userEmail?: string;
}

export const VerificationCenter: React.FC<VerificationCenterProps> = ({ currentLevel, onClose, userEmail }) => {
    const [showKYCFlow, setShowKYCFlow] = useState(false);
    const [verificationGoal, setVerificationGoal] = useState<VerificationLevel | null>(null);

    const handleStartVerification = (level: VerificationLevel) => {
        setVerificationGoal(level);
        setShowKYCFlow(true);
    };

    const handleKYCClose = (completed: boolean) => {
        setShowKYCFlow(false);
        if (completed && verificationGoal) {
            onClose(verificationGoal);
        }
    };
    
    return (
        <>
            {showKYCFlow && verificationGoal && (
                <KYCForm
                    userEmail={userEmail}
                    onComplete={() => handleKYCClose(true)}
                    onCancel={() => handleKYCClose(false)}
                />
            )}
            <div className="fixed inset-0 bg-slate-100 bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-slate-200 rounded-2xl shadow-digital p-8 w-full max-w-md m-4 relative flex flex-col max-h-[90vh]">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4 shadow-digital">
                            <ShieldCheckIcon className="w-8 h-8 text-primary"/>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Identity Verification</h2>
                        <p className="text-sm text-slate-500 mt-2">
                            Your current status is: <span className="font-bold text-primary">{currentLevel}</span>
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className={`p-4 rounded-lg shadow-digital-inset ${currentLevel !== VerificationLevel.UNVERIFIED ? 'opacity-60' : ''}`}>
                            <div className="flex items-center space-x-4">
                                <IdentificationIcon className="w-8 h-8 text-primary flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-slate-800">Level 1: Basic Information</h4>
                                    <p className="text-xs text-slate-500">Verify your SSN for basic account features.</p>
                                </div>
                            </div>
                            {currentLevel !== VerificationLevel.UNVERIFIED && <p className="text-xs text-green-600 font-bold mt-2 text-center">COMPLETED</p>}
                        </div>

                        <div className={`p-4 rounded-lg shadow-digital-inset ${currentLevel === VerificationLevel.LEVEL_2 || currentLevel === VerificationLevel.LEVEL_3 ? 'opacity-60' : ''}`}>
                             <div className="flex items-center space-x-4">
                                <DocumentCheckIcon className="w-8 h-8 text-primary flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-slate-800">Level 2: Comprehensive KYC</h4>
                                    <p className="text-xs text-slate-500">Provide identification and proof of address.</p>
                                </div>
                            </div>
                            {currentLevel === VerificationLevel.UNVERIFIED && (
                                <button onClick={() => handleStartVerification(VerificationLevel.LEVEL_2)} className="w-full mt-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-900 bg-primary rounded-lg shadow-md">
                                    Start Comprehensive KYC
                                </button>
                            )}
                            {(currentLevel === VerificationLevel.LEVEL_2 || currentLevel === VerificationLevel.LEVEL_3) && <p className="text-xs text-green-600 font-bold mt-2 text-center">COMPLETED</p>}
                        </div>

                         <div className={`p-4 rounded-lg shadow-digital-inset ${currentLevel === VerificationLevel.LEVEL_3 ? 'opacity-60' : ''}`}>
                             <div className="flex items-center space-x-4">
                                <CameraIcon className="w-8 h-8 text-primary flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-slate-800">Level 3: Liveness Check</h4>
                                    <p className="text-xs text-slate-500">Complete a liveness check to unlock all features.</p>
                                </div>
                            </div>
                             {currentLevel !== VerificationLevel.LEVEL_3 && (
                                <button onClick={() => handleStartVerification(VerificationLevel.LEVEL_3)} className="w-full mt-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-900 bg-primary rounded-lg shadow-md" disabled={currentLevel === VerificationLevel.UNVERIFIED}>
                                    Start Level 3 Verification
                                </button>
                            )}
                            {currentLevel === VerificationLevel.LEVEL_3 && <p className="text-xs text-green-600 font-bold mt-2 text-center">COMPLETED</p>}
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-300 text-right">
                        <button onClick={() => onClose(currentLevel)} className="px-6 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
