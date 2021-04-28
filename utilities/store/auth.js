// Packages
import create from 'zustand';

const useAuthStore = create(set => ({
    user: null,
    setUser: user =>
        set(() => ({
            user: user,
        })),
    loggedIn: false,
    setLoggedIn: loggedIn =>
        set(() => ({
            loggedIn,
        })),
    initialized: false,
    setInitialized: () =>
        set(() => ({
            initialized: true,
        })),
}));

export { useAuthStore };
