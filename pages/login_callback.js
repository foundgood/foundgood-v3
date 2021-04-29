// React
import React from 'react';

// Packages

// Utilities
import { useAuth } from 'utilities/hooks';

// Components

const LoginCallbackComponent = () => {
    const { handleLoginCallback } = useAuth();
    handleLoginCallback();
    return null;
};

export default LoginCallbackComponent;
