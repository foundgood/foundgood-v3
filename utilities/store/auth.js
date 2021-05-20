// Packages
import create from 'zustand';
import createVanilla from 'zustand/vanilla';
import dayjs from 'dayjs';

const authStore = createVanilla((set, get) => ({
    accessToken: null,
    setAccessToken: accessToken =>
        set(() => ({
            accessToken,
        })),

    instanceUrl: null,
    setInstanceUrl: instanceUrl =>
        set(() => ({
            instanceUrl,
        })),

    user: null,
    setUser: user =>
        set(() => ({
            user,
        })),
    userSessionTimeout: null,
    setUserSessionTimeout: userSessionTimeout =>
        set(() => ({
            userSessionTimeout,
        })),
    loggedIn: false,
    setLoggedIn: loggedIn =>
        set(() => ({
            loggedIn,
        })),

    reset: () =>
        set(() => ({
            accessToken: null,
            instanceUrl: null,
            user: null,
            loggedIn: false,
            initialized: false,
        })),

    updateUserTimeout() {
        if (localStorage.getItem('fg_lsUserSessionTimeout') ?? 0 > Date.now()) {
            // Update logout timeout
            const newTimeout = dayjs().add(
                process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MS,
                'ms'
            );

            // Update timeout
            localStorage.setItem(
                'fg_lsUserSessionTimeout',
                newTimeout.valueOf()
            );
            get().setUserSessionTimeout(newTimeout.valueOf());

            console.info(
                `You will be logged out with ${
                    process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MS / 1000 / 60
                } minutes of inactivity (${newTimeout.format('HH:mm:ss')})`
            );

            return true;
        } else {
            return false;
        }
    },
}));

const useAuthStore = create(authStore);

export { useAuthStore, authStore };
