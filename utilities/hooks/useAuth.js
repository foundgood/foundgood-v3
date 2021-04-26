import { useEffect } from 'react';

// Packages
import { createLocalStorageStateHook } from 'use-local-storage-state';

// Utilities
import { salesforce } from 'utilities/api';
import { useAuthStore } from 'utilities/store';

const useAuth = (initialize = false) => {
    // Store: Auth
    const {
        setInitialized,
        setUser,
        setLoggedIn,
        initialized,
        loggedIn,
        user,
    } = useAuthStore();

    // Hook: Persist login with localstorage
    const useLsUser = createLocalStorageStateHook('fg_lsUser', null);
    const [lsUser, setLsUser] = useLsUser();

    // Initialize
    useEffect(() => {
        if (initialize) {
            console.log('Auth: Init');

            // Check for lsUser and timestamp
            if (lsUser?.sessionInvalidTimestamp > Date.now() ?? false) {
                console.log('Auth: Returning user');
                setUser(lsUser);
                setLoggedIn(true);

                // Log
                console.log('Auth: User', lsUser);
            } else {
                console.log('Auth: Session has timed out or does not exist');
                setUser(null);
                setLoggedIn(false);
                setLsUser.reset();
            }

            // Init complete
            setInitialized(true);
        }
    }, []);

    // Log in
    async function login(username, password) {
        console.log('Auth: Logging in');

        const user =
            process.env.NODE_ENV === 'development'
                ? await salesforce.user.login({
                      username: 'allen.dziedzic@example.com',
                      password: 's^7Vy_MFY1fsad_$23xCp_1',
                  })
                : await salesforce.user.login({ username, password });

        // Update store
        setUser(user);
        setLoggedIn(true);

        // Update localstorage
        setLsUser(user);

        // Log
        console.log('Auth: User', user);

        return user;
    }

    // Log out
    async function logout() {
        console.log('Auth: Logging out');

        if (loggedIn) {
            await salesforce.user.logout({
                accessToken: user.accessToken,
            });
        }

        // Update store
        setUser(null);
        setLoggedIn(false);

        // Update localstorage
        setLsUser(null);
    }

    return { login, logout, initialized, loggedIn, user };
};

export default useAuth;
