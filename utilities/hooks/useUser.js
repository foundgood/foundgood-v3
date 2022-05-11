import { useEffect } from 'react';

// Packages

// Utilities
import { useAuthStore } from 'utilities/store';

const useUser = () => {
    // Store: Auth
    const { user, userInitiativeRights } = useAuthStore();

    // Account ID is the ID of the account organisation
    function getUserAccountId() {
        return user?.AccountId;
    }

    function getUserAccountType() {
        return user?.User_Account_Type__c;
    }

    return { getUserAccountId, getUserAccountType, user };
};

export default useUser;
