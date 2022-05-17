// React
import { useEffect } from 'react';

// Packages
import useTimeout from '@rooks/use-timeout';

// Utilities
import { useAuthStore } from 'utilities/store';
import { useUser } from 'utilities/hooks';

// Components

const LoginTimeoutComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { userSessionTimeout } = useAuthStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { userLogout } = useUser();
    const { start, clear } = useTimeout(
        userLogout,
        process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MS
    );

    useEffect(() => {
        clear();
        setTimeout(() => {
            start();
        }, 1000);
    }, [userSessionTimeout]);
    return null;
};

LoginTimeoutComponent.propTypes = {};

LoginTimeoutComponent.defaultProps = {};

export default LoginTimeoutComponent;
