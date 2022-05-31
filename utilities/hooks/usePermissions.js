// Packages
import { useEffect, useState } from 'react';

// Utilities
import { useUser } from 'utilities/hooks';

const usePermissions = () => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const {
        getUserAccountType,
        getUserInitiativeTeamRole,
        getUserAccountId,
    } = useUser();

    // ///////////////////
    // STATE
    // ///////////////////

    const [permissionUserUpdated, setPermissionUserUpdated] = useState(0);

    // ///////////////////
    // DATA
    // ///////////////////

    // Match values from SalesForce (Enums)
    const ACCOUNTS = {
        funder: 'Foundation',
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
    // METHODS
    // ///////////////////

    // Grant permission - base method
    function grantPermission(rules) {
        // Get simple rules - just a string
        const simpleRules = rules.filter(rule => typeof rule === 'string');

        // Other rules must be held within one object
        const otherRules =
            rules.filter(rule => typeof rule === 'object')[0] ?? {};

        // Validation of the simpler rules
        const validateSimpleRules = simpleRules.some(rule => {
            const [account, role] = rule.split('.');
            if (account && role) {
                return (
                    getUserAccountType() === ACCOUNTS[account] &&
                    getUserInitiativeTeamRole() === ROLES[role]
                );
            } else if (account) {
                return getUserAccountType() === ACCOUNTS[account];
            } else return false;
        });

        // Validation of the other rules
        const validateOtherRules = Object.entries(otherRules).some(
            ([ruleName, ruleData]) => {
                switch (ruleName) {
                    case 'account':
                        return ruleData === getUserAccountId();
                    default:
                        return false;
                }
            }
        );

        // Are anything validated
        return [validateSimpleRules, validateOtherRules].some(rule => rule);
    }

    // Disable input field if not...
    function enableInputField(rules) {
        return !grantPermission(rules);
    }

    // Require input field if not...
    function requireInputField(rules) {
        return grantPermission(rules);
    }

    // Filter input values based on rules
    // E.g. { 'Lead funder': ['super'] }
    function valuePermissions(valueRules, options) {
        return options.flatMap(option => {
            const rules = valueRules[option.value];
            if (rules) {
                return grantPermission(valueRules[option.value]) ? option : [];
            }
            return option;
        });
    }

    // Button action enabler
    function enableAction(rules, action) {
        return grantPermission(rules) ? action : null;
    }

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        setPermissionUserUpdated(permissionUserUpdated + 1);
    }, [getUserAccountType(), getUserInitiativeTeamRole()]);

    return {
        grantPermission,
        permissionUserUpdated,
        enableInputField,
        requireInputField,
        valuePermissions,
        enableAction,
    };
};

export default usePermissions;
