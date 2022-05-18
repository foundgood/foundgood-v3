// React
import React, { useEffect } from 'react';

// Packages
import { createLocalStorageStateHook } from 'use-local-storage-state';

// Utilities
import CryptoJS from 'crypto-js';
import { useAuthStore } from 'utilities/store';
import { hasWindow } from 'utilities';

// Components

const WithAuthComponent = Component => {
    const Wrapper = props => {
        // ///////////////////
        // STORES
        // ///////////////////

        const {
            setAccessToken,
            setInstanceUrl,
            setUser,
            setLoggedIn,
            reset,
        } = useAuthStore();

        // ///////////////////
        // HOOKS
        // ///////////////////

        const useLsUserData = createLocalStorageStateHook(
            'fg_lsUserData',
            null
        );
        const [lsUserData, setLsUserData] = useLsUserData();

        // ///////////////////
        // METHODS
        // ///////////////////

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
            return `${authUrl}/services/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}&prompt=login`;
        }

        // ///////////////////
        // EFFECTS
        // ///////////////////

        // Effect: Verify logged ind
        useEffect(() => {
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

        // ///////////////////
        // RENDER
        // ///////////////////

        return hasWindow() ? (
            lsUserData ? (
                <Component {...props} />
            ) : null
        ) : (
            <Component {...props} />
        );
    };

    // Add layout
    Wrapper.layout = Component.layout;

    return Wrapper;
};

WithAuthComponent.propTypes = {};

WithAuthComponent.defaultProps = {};

export default WithAuthComponent;
