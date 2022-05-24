// React
import React, { useEffect, useState } from 'react';

// Packages
import { useRouter } from 'next/router';
import _camelCase from 'lodash.camelcase';

// Utilities
import { getPermissionRules } from 'utilities';
import { useUser, useContext } from 'utilities/hooks';

// Components

const WithPermissionComponent = Component => {
    const Wrapper = props => {
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
            if (Component.permissions === 'context') {
                // Context from current page
                const context = MODE;

                // Path from current page
                const path = _camelCase(PATH);

                // Is it update or not
                const permissionObject = UPDATE ? 'update' : 'add';

                // Set rules
                setRules(getPermissionRules(context, path, permissionObject));
            } else {
                console.warn(
                    'No permissions rules set on component (xxxComponent.permissions)'
                );
            }
        }, [Component.permissions, PATH, MODE, UPDATE]);

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

        return allowRender ? <Component {...props} /> : null;
    };

    // Add layout
    Wrapper.layout = Component.layout;

    return Wrapper;
};

WithPermissionComponent.propTypes = {};

WithPermissionComponent.defaultProps = {};

export default WithPermissionComponent;
