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
        try {
            const { id } = await salesForce.crud.create({ object, data });

            // Update user timeout
            updateUserTimeout();

            return id;
        } catch (error) {
            console.warn(error);
        }
    }

    // Method for updating any object in the SalesForce API
    // Object is the name of the object - e.g. Initiative__c
    // Id is the id of the object - e.g. a0p1x0000008CbtAAE
    // Data is the data as json object
    // Returns nothing
    async function sfUpdate({ object, id, data }) {
        try {
            await salesForce.crud.update({ object, id, data });

            // Update user timeout
            updateUserTimeout();

            return id;
        } catch (error) {
            console.warn(error);
        }
    }

    // Method for deleting any object in the SalesForce API
    // Object is the name of the object - e.g. Initiative_Activity__c
    // Remember to add parent id in data if this is in someway is a reference to this.
    // E.g. {..., "Initiative__c": "a0p1x0000008CbtAAE"}
    // Returns nothing
    async function sfDelete({ object, id }) {
        try {
            await salesForce.crud.remove({ object, id });

            // Update user timeout
            updateUserTimeout();

            return id;
        } catch (error) {
            console.warn(error);
        }
    }

    return {
        sfQuery,
        sfCreate,
        sfUpdate,
        sfDelete,
        queries: salesForce.queries,
    };
};

export default useSalesForce;
