// React
import { useEffect } from 'react';

// Packages
import { createLocalStorageStateHook } from 'use-local-storage-state';
import { useRouter } from 'next/router';

// Utilities
import { elseware } from 'utilities/api';
import { useAuthStore } from 'utilities/store';
import { hasWindow } from 'utilities';

const LoginCallbackComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { reset } = useAuthStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const router = useRouter();
    const useLsUserData = createLocalStorageStateHook('fg_lsUserData', null);
    const [, setLsUserData] = useLsUserData();

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        if (hasWindow()) {
            console.log('Auth: Handling Login Callback');

            // Get hash params
            const hashParams = window.location.hash.replace('#', '').split('&');

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
    return null;
};

export default LoginCallbackComponent;
