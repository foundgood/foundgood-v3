// React
import React, { useEffect } from 'react';

// Packages
import useTimeout from '@rooks/use-timeout';

// Utilities
import { useAuthStore } from 'utilities/store';
import { useAuth } from 'utilities/hooks';

// Components

const LoginTimeoutComponent = ({ data }) => {
    const { userSessionTimeout } = useAuthStore();
    const { logout } = useAuth();

    const { start, clear } = useTimeout(
        logout,
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
