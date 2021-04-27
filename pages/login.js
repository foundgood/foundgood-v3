// React
import React from 'react';

// Packages
import t from 'prop-types';
import Link from 'next/link';

// Utilities
import { useAuth } from 'utilities/hooks';

// Components
import Button from 'components/button';

const LoginComponent = ({ pageProps }) => {
    const { login, logout } = useAuth();

    return (
        <div className="t-h1">
            Login
            <div className="flex flex-wrap px-32 mt-32 space-x-32">
                <Button action={() => login()}>Login</Button>
                <Button theme="amber" action={() => logout()}>
                    Logout
                </Button>
            </div>
            <Link href="/">Navigate to index</Link>
        </div>
    );
};

LoginComponent.propTypes = {
    pageProps: t.object,
};

LoginComponent.defaultProps = {
    pageProps: {},
};

export default LoginComponent;
