import { useEffect } from 'react';

// Packages
import { createLocalStorageStateHook } from 'use-local-storage-state';
import { useRouter } from 'next/router';

// Utilities
import { salesForce } from 'utilities/api';
import { useAuthStore } from 'utilities/store';
import { hasWindow } from 'utilities';

const useAuth = () => {
    // Hook: Router
    const router = useRouter();

    // Store: Auth
    const {
        setAccessToken,
        setInstanceUrl,
        setUser,
        setLoggedIn,
        loggedIn,
        user,
        reset,
    } = useAuthStore();

    // Hook: Persist login with localstorage
    const useLsUserData = createLocalStorageStateHook('fg_lsUserData', null);
    const [lsUserData, setLsUserData] = useLsUserData();

    // Helper: Extracts login url
    function _getLoginUrl() {
        const authUrl = process.env.NEXT_PUBLIC_LOGIN_AUTH_URL;
        const clientId = process.env.NEXT_PUBLIC_LOGIN_CLIENT_ID;
        const redirectUrl = encodeURIComponent(
            `${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL_PREFIX}/login_callback`
        );
        const state = encodeURIComponent(`${router.route}`);
        return `${authUrl}/services/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}`;
    }

    // Method to push user to login if no longer logged in
    function verifyLoggedIn() {
        return useEffect(() => {
            console.log('Auth: Verify user');

            // Check for lsUser and timestamp
            if (lsUserData?.sessionTimeout > Date.now() ?? false) {
                // Log
                console.log('Auth: Returning user', lsUserData.user);
            } else {
                console.log('Auth: Session has timed out or does not exist');
                setUser(null);
                setLoggedIn(false);
                setLsUserData(null);

                // Restart login
                window.location.href = _getLoginUrl();
            }
        }, []);
    }

    // Handle login callback
    function handleLoginCallback() {
        // username: 'allen.dziedzic@example.com',
        // password: 's^7Vy_MFY1fsad_$23xCp_1',
        return useEffect(() => {
            if (hasWindow()) {
                console.log('Auth: Handling Login Callback');

                // Get hash params
                const hashParams = window.location.hash
                    .replace('#', '')
                    .split('&');

                // Check for any params
                if (hashParams.length > 0) {
                    // Reduce into usable object
                    const params = hashParams.reduce((acc, hash) => {
                        // Split by key/value =
                        const hashSplit = hash.split('=');
                        return {
                            ...acc,
                            [hashSplit[0]]: decodeURIComponent(hashSplit[1]),
                        };
                    }, {});

                    // Get from params
                    const { access_token, instance_url } = params;

                    // Get user info from sf api
                    salesForce.user
                        .getInfo({ token: access_token, url: instance_url })
                        .then(user => {
                            // Update localstorage object
                            setLsUserData({
                                user,
                                accessToken: access_token,
                                instanceUrl: instance_url,
                                sessionTimeout:
                                    parseInt(params.issued_at, 10) +
                                    1800 * 1000,
                            });

                            // Log
                            console.log('Auth: User', user);

                            // Replace history to hide params
                            router.replace(params.state);
                        })
                        .catch(() => {
                            // Reset store
                            reset();

                            // Update localstorage
                            setLsUserData(null);
                        });
                }
            }
        }, []);
    }

    // Log out
    function logout() {
        console.log('Auth: Logging out');

        salesForce.user.logout().then(() => {
            // Update localstorage
            setLsUserData(null);

            // Redirect
            window.location.href = 'https://foundgood.org/';
        });
    }

    // Effect: Update data in store based on localstorage object
    useEffect(() => {
        if (lsUserData) {
            const { user, accessToken, instanceUrl } = lsUserData;
            setUser(user);
            setLoggedIn(true);
            setAccessToken(accessToken);
            setInstanceUrl(instanceUrl);
        } else {
            reset();
        }
    }, [lsUserData]);

    return {
        handleLoginCallback,
        logout,
        loggedIn,
        user,
        verifyLoggedIn,
    };
};

export default useAuth;
