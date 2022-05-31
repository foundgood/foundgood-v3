// React
import React, { useState, useEffect } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { usePermissions } from 'utilities/hooks';

// Components

const PermissionComponent = ({ children, rules, additionalRules }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { grantPermission, permissionUserUpdated } = usePermissions();

    // ///////////////////
    // STATE
    // ///////////////////

    const [allowRender, setAllowRender] = useState(false);
    const [allowAdditional, setAllowAdditional] = useState(false);

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        if (rules.length > 0) {
            setAllowRender(grantPermission(rules));
        }
    }, [rules, permissionUserUpdated]);

    useEffect(() => {
        setAllowAdditional(additionalRules.every(rule => rule));
    }, [additionalRules]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return <>{allowRender && allowAdditional ? children : null}</>;
};

PermissionComponent.propTypes = {
    rules: t.array.isRequired,
    additionalRules: t.array,
};

PermissionComponent.defaultProps = {
    additionalRules: [],
    rules: [],
};

export default PermissionComponent;
