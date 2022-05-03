import { useEffect } from 'react';

// Packages
import { createLocalStorageStateHook } from 'use-local-storage-state';
import { useRouter } from 'next/router';

// Utilities
import CryptoJS from 'crypto-js';
import { salesForce, elseware } from 'utilities/api';
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
        userInitiativeRights,
        setUserInitiativeRights,
        updateUserTimeout: updateUserTimeoutStore,
    } = useAuthStore();

    // Hook: Persist user and user session timeout with localstorage
    const useLsUserData = createLocalStorageStateHook('fg_lsUserData', null);
    const [lsUserData, setLsUserData] = useLsUserData();

    // Helper: Extracts login url
    function _getLoginUrl() {
        const authUrl = process.env.NEXT_PUBLIC_END_USER_AUTH_URL;
        const clientId = CryptoJS.AES.decrypt(
            process.env.NEXT_PUBLIC_LOGIN_CLIENT_ID,
            process.env.NEXT_PUBLIC_SECRET
        ).toString(CryptoJS.enc.Utf8);
        const redirectUrl = encodeURIComponent(
            `${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL_PREFIX}/login_callback`
        );
        const state = encodeURIComponent(
            window.location.href.replace(
                process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL_PREFIX,
                ''
            )
        );
        return `${authUrl}/services/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}`;
    }

    // Method to push user to login if no longer logged in
    function verifyLoggedIn() {
        return useEffect(() => {
            console.log('Auth: Verify user');

            // Check for lsUser and timestamp
            if (
                !lsUserData ||
                localStorage.getItem('fg_lsUserSessionTimeout') < Date.now()
            ) {
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

                    // Update localstorage timeout
                    localStorage.setItem(
                        'fg_lsUserSessionTimeout',
                        Date.now() + process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MS
                    );

                    // Get user info from sf api
                    elseware
                        .get({ path: 'user/user', token: access_token })
                        .then(user => {
                            // Update localstorage user
                            setLsUserData({
                                user,
                                accessToken: access_token,
                                instanceUrl: instance_url,
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
                            localStorage.removeItem('fg_lsUserSessionTimeout');
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

    // Update user timeout
    function updateUserTimeout() {
        if (!updateUserTimeoutStore()) {
            logout();
        }
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

    // Get current user access rights
    function getUserInitiativeRights(initiativeId) {
        // Get user access rights info from sf api
        salesForce.custom
            .getUserInitiativeRights(initiativeId)
            .then(data => {
                if (data) {
                    setUserInitiativeRights({
                        canView: data?.data.bHasCreateRelatedRecordsAccess,
                        canEdit: data?.data.bHasCreateTeamMemberAccess,
                        other: {
                            ...data?.data,
                        },
                    });
                }
            })
            .catch(error => {
                console.warn(error);
            });
    }

    return {
        handleLoginCallback,
        logout,
        loggedIn,
        user,
        verifyLoggedIn,
        updateUserTimeout,
        getUserInitiativeRights,
        userInitiativeRights,
    };
};

export default useAuth;
