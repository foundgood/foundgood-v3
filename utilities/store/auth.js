// Packages
import create from 'zustand';

const useAuthStore = create(set => ({
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
}));

export { useAuthStore };
