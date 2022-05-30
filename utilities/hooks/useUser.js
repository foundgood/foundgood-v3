// Packages
import { useEffect } from 'react';
import { createLocalStorageStateHook } from 'use-local-storage-state';

// Utilities
import { useAuthStore, useInitiativeDataStore } from 'utilities/store';
import { useElseware } from 'utilities/hooks';
import { salesForce } from 'utilities/api';

const useUser = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const {
        user,
        loggedIn,
        userInitiativeTeamMember,
        setUserInitiativeTeamMember,
    } = useAuthStore();

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { ewGet } = useElseware();
    const useLsUserData = createLocalStorageStateHook('fg_lsUserData', null);
    const [, setLsUserData] = useLsUserData();

    // ///////////////////
    // METHODS
    // ///////////////////

    // Get user id
    function getUserId() {
        return user?.user_id;
    }

    // Account ID is the ID of the account organisation
    function getUserAccountId() {
        return user?.AccountId;
    }

    // Account type of the user
    function getUserAccountType() {
        return user?.User_Account_Type__c;
    }

    // Get if the user is logged in
    function getUserLoggedIn() {
        return loggedIn;
    }

    // Get user name
    function getUserName() {
        return user?.name ?? null;
    }

    // Get user initiative team role
    function getUserInitiativeTeamRole() {
        return userInitiativeTeamMember
            ? userInitiativeTeamMember.Team_Member_Role__c
            : 'not-set';
    }

    // Log out
    function userLogout() {
        console.log('Auth: Logging out');

        salesForce.user.logout().then(() => {
            // Update localstorage
            setLsUserData(null);
            localStorage.removeItem('fg_lsUserSessionTimeout');

            // Redirect
            window.location.href = 'https://foundgood.org/';
        });
    }

    // ///////////////////
    // DATA
    // ///////////////////

    const { data: userInitiativeTeamMemberData } = ewGet(
        'initiative-team-member/get-member',
        {
            initiative: utilities.initiative.get().Id,
            id: getUserId(),
        },
        !!utilities.initiative.get().Id
    );

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        if (userInitiativeTeamMemberData) {
            setUserInitiativeTeamMember(userInitiativeTeamMemberData.data);
        }
    }, [userInitiativeTeamMemberData]);

    return {
        getUserId,
        getUserAccountId,
        getUserAccountType,
        getUserInitiativeTeamRole,
        getUserLoggedIn,
        getUserName,
        userLogout,
        user,
    };
};

export default useUser;
