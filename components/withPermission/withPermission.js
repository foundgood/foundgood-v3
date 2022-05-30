// React
import React, { useEffect, useState } from 'react';

// Packages
import { useRouter } from 'next/router';
import _camelCase from 'lodash.camelcase';
import t from 'prop-types';

// Utilities
import { getPermissionRules } from 'utilities';
import { useUser, useContext } from 'utilities/hooks';

// Components

const WithPermissionComponent = ({ children, context }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const router = useRouter();
    const { getUserAccountType, getUserInitiativeTeamRole } = useUser();
    const { MODE, UPDATE, PATH } = useContext();

    // ///////////////////
    // STATE
    // ///////////////////

    const [rules, setRules] = useState([]);
    const [allowRender, setAllowRender] = useState(false);

    // ///////////////////
    // DATA
    // ///////////////////

    // Match values from SalesForce (Enums)
    const ACCOUNTS = {
        funder: 'Funder',
        grantee: 'Grantee',
        organisation: 'Organisation',
        super: 'Super',
    };

    // Match values from SalesForce (Enums)
    const ROLES = {
        admin: 'Admin',
        collaborator: 'Collaborator',
        member: 'Member',
    };

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
        if (
            rules &&
            rules.length > 0 &&
            getUserAccountType() &&
            getUserInitiativeTeamRole()
        ) {
            // Figure out allow based on permissions rule
            const allow = rules.every(rule => {
                const [account, role] = rule.split('.');
                if (account && role) {
                    return (
                        getUserAccountType() === ACCOUNTS[account] &&
                        getUserInitiativeTeamRole() === ROLES[role]
                    );
                } else if (account) {
                    return getUserAccountType() === ACCOUNTS[account];
                }
            });

            // Set allow
            setAllowRender(allow);

            // Redirect if false
            if (!allow) {
                router.push('/');
            }
        }
    }, [rules, getUserAccountType(), getUserInitiativeTeamRole()]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return allowRender ? <>{children}</> : null;
};

WithPermissionComponent.propTypes = {
    context: t.bool,
};

WithPermissionComponent.defaultProps = {
    context: false,
};

export default WithPermissionComponent;
