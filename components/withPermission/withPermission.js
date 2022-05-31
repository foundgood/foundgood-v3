// React
import React, { useEffect, useState } from 'react';

// Packages
import { useRouter } from 'next/router';
import _camelCase from 'lodash.camelcase';
import t from 'prop-types';

// Utilities
import { getPermissionRules } from 'utilities';
import { useContext, usePermissions } from 'utilities/hooks';

// Components

const WithPermissionComponent = ({ children, context }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const router = useRouter();
    const { grantPermission, permissionUserUpdated } = usePermissions();
    const { MODE, UPDATE, PATH } = useContext();

    // ///////////////////
    // STATE
    // ///////////////////

    const [rules, setRules] = useState([]);

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        // Context based rules - based on getPermissionRules and configuration files
        if (context) {
            // Context from current page
            const pageContext = MODE;

            // Path from current page
            const path = _camelCase(PATH);

            // Is it update or not
            const permissionObject = UPDATE ? 'update' : 'add';

            // Set rules
            setRules(getPermissionRules(pageContext, path, permissionObject));
        } else {
            console.warn('No context permissions rules set on component');
        }
    }, [context, PATH, MODE, UPDATE]);

    useEffect(() => {
        // Only do something, if all data is present
        if (rules && rules.length > 0) {
            // Figure out allow based on permissions rule
            const allow = grantPermission(rules);

            // Redirect if false
            if (!allow) {
                router.push('/');
            }
        }
    }, [rules, permissionUserUpdated]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return <>{children}</>;
};

WithPermissionComponent.propTypes = {
    context: t.bool,
};

WithPermissionComponent.defaultProps = {
    context: false,
};

export default WithPermissionComponent;
