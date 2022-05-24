// React
import React, { useState, useEffect } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useUser } from 'utilities/hooks';

// Components

const PermissionComponent = ({ children, rules, additionalRules }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { getUserAccountType, getUserInitiativeTeamRole } = useUser();

    // ///////////////////
    // STATE
    // ///////////////////

    const [allowRender, setAllowRender] = useState(false);
    const [allowAdditional, setAllowAdditional] = useState(false);

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
        if (rules.length > 0) {
            setAllowRender(
                rules.every(rule => {
                    const [account, role] = rule.split('.');
                    if (account && role) {
                        return (
                            getUserAccountType() === ACCOUNTS[account] &&
                            getUserInitiativeTeamRole() === ROLES[role]
                        );
                    } else if (account) {
                        return getUserAccountType() === ACCOUNTS[account];
                    }
                })
            );
        }
    }, [rules]);

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
