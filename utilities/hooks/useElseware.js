// Packages
import useSWR from 'swr';

// Utilities
import { elseware } from 'utilities/api';
import { useInitiativeDataStore, useAuthStore } from 'utilities/store';

const useElseware = () => {
    // ///////////////////
    // STORES
    // ///////////////////
    const { loggedIn, updateUserTimeout } = useAuthStore();
    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // METHODS
    // ///////////////////

    // Method for consuming GET with elseware API
    // Path is the elseware path - e.g. initiative-activity/initiative-activity
    // Params is optional object that will be converted to URL Params - e.g. id
    // Returns normal swr object ({ data, error, isValidating, mutate })
    function ewGet(path, params, condition = true) {
        return useSWR(
            loggedIn && condition ? { path, params } : null,
            elseware.get,
            {
                revalidateOnFocus: false,
                onSuccess: updateUserTimeout,
            }
        );
    }

    // Method for creating any object with elseware API
    // Path is the elseware path - e.g. initiative-activity/initiative-activity
    // Data is the data as json object
    // Remember to add parent id in data if this is in someway is a reference to this.
    // E.g. {..., "Initiative__c": "a0p1x0000008CbtAAE"}
    // Returns created object
    async function ewCreate(path, data) {
        try {
            const responseData = await elseware.create({ path, data });

            // Update user timeout
            updateUserTimeout();

            return responseData;
        } catch (error) {
            console.warn(error);
        }
    }

    // Method for updating any object with elseware API
    // Path is the elseware path - e.g. initiative-activity/initiative-activity
    // Id is the id of the object - e.g. a0p1x0000008CbtAAE
    // Data is the data as json object
    // Returns nothing
    async function ewUpdate(path, id, data) {
        try {
            const responseData = await elseware.update({
                path,
                params: { id },
                data,
            });

            // Update user timeout
            updateUserTimeout();

            return responseData;
        } catch (error) {
            console.warn(error);
        }
    }

    // Method for deleting any object with elseware API
    // Path is the elseware path - e.g. initiative-activity/initiative-activity
    // Id is the id of the object - e.g. a0p1x0000008CbtAAE
    // Returns nothing
    async function ewDelete(path, id) {
        try {
            const responseData = await elseware.remove({
                path,
                params: { id },
            });

            // Update user timeout
            updateUserTimeout();

            return responseData;
        } catch (error) {
            console.warn(error);
        }
    }

    // Wrapper method for creating or updating any object with elseware API
    // It also updates the object in the initiative data store as a side effect
    // Path is the elseware path - e.g. initiative-activity/initiative-activity
    // Id is the id of the object - e.g. a0p1x0000008CbtAAE - treated as a condition in expression
    // Data is the data as json object
    // ParentId is the optional parent object and id for a given child
    // Initiative
    // Returns data from creation/update
    async function ewCreateUpdateWrapper(
        path,
        id,
        updateData = {},
        createData = {},
        initiativePath = null
    ) {
        const { data: responseData } = id
            ? await ewUpdate(path, id, updateData)
            : await ewCreate(path, {
                  ...updateData,
                  ...createData,
              });

        // Update store
        if (initiativePath)
            utilities.updateInitiativeData(initiativePath, responseData);

        // Return data
        return responseData;
    }

    return {
        ewGet,
        ewCreate,
        ewDelete,
        ewUpdate,
        ewCreateUpdateWrapper,
    };
};

export default useElseware;
