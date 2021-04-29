// Packages
import useSWR from 'swr';

// Utilities
import { useAuth } from 'utilities/hooks';
import { salesForce } from 'utilities/api';

const useSalesForce = () => {
    // Hook: Auth
    const { loggedIn, updateUserTimeout } = useAuth();

    // Method for consuming the "query" part of the SalesForce API
    // Returns normal swr object ({ data, error, isValidating, mutate })
    function sfQuery(query) {
        return useSWR(loggedIn ? query : null, salesForce.fetchers.query, {
            revalidateOnFocus: false,
            onSuccess: updateUserTimeout,
        });
    }

    // Method for creating any object in the SalesForce API
    // Object is the name of the object - e.g. Initiative_Activity__c
    // Data is the data as json object
    // Remember to add parent id in data if this is in someway is a reference to this.
    // E.g. {..., "Initiative__c": "a0p1x0000008CbtAAE"}
    // Returns id of created object
    async function sfCreate({ object, data }) {
        const { id } = await salesForce.crud.create({ object, data });

        // Update user timeout
        updateUserTimeout();

        return id;
    }

    // Method for updating any object in the SalesForce API
    // Object is the name of the object - e.g. Initiative__c
    // Id is the id of the object - e.g. a0p1x0000008CbtAAE
    // Data is the data as json object
    // Returns nothing
    async function sfUpdate({ object, id, data }) {
        await salesForce.crud.update({ object, id, data });

        // Update user timeout
        updateUserTimeout();
    }

    // Method for setting the user language in the SalesForce API
    // Language is either 'da' or 'en_US'
    async function sfSetUserLanguage(language) {
        await salesForce.custom.setUserLanguage({ language });

        // Update user timeout
        updateUserTimeout();
    }

    // Method for getting current user initiative rights of the SalesForce API
    // Returns normal swr object ({ data, error, isValidating, mutate })
    function sfGetUserInitiativeRights(initiativeId) {
        return useSWR(
            loggedIn ? 'custom/getUserInitiativeRights' : null,
            salesForce.custom.getUserInitiativeRights({ initiativeId }),
            {
                revalidateOnFocus: false,
                onSuccess: updateUserTimeout,
            }
        );
    }

    // Method for getting intiatives list of the SalesForce API
    // Returns normal swr object ({ data, error, isValidating, mutate })
    function sfGetInitiativeList(offset) {
        return useSWR(
            loggedIn ? 'custom/getInitiativeList' : null,
            salesForce.custom.getInitiativeList({ offset }),
            {
                revalidateOnFocus: false,
                onSuccess: updateUserTimeout,
            }
        );
    }

    return {
        sfQuery,
        sfCreate,
        sfUpdate,
        sfSetUserLanguage,
        sfGetUserInitiativeRights,
        sfGetInitiativeList,
        queries: salesForce.queries,
    };
};

export default useSalesForce;
