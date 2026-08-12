export const Haptics = {
    // Subtle tap
    tap: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
    },
    // Success feedback (two quick, light taps)
    success: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([15, 100, 20]);
        }
    },
    // Warning/Error (heavy, longer vibration)
    warning: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([50, 100, 50, 100, 50]);
        }
    },
    // Heavy impact (e.g. confirming a large transfer)
    heavy: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(40);
        }
    },
    // Biometric/Auth sequence
    auth: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([20, 50, 10, 50, 30]);
        }
    }
};

export const triggerHaptic = (pattern: number | number[] = 10, intensity: number = 80) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        // We can't really control intensity in navigator.vibrate, but we can simulate it with shorter durations if we wanted.
        // For standard Web API, just pass the pattern.
        navigator.vibrate(pattern);
    }
};

export const triggerSuccessHaptic = (intensity: number = 80) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([15, 100, 20]);
    }
};

export const triggerFailureHaptic = (intensity: number = 80) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([50, 100, 50, 100, 50]);
    }
};
