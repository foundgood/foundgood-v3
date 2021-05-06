// Packages
import axios from 'axios';

// Utilities
import { useAuthStore } from 'utilities/store';

// Retrieve access token and instance url from auth store
const accessToken = () => useAuthStore.getState().accessToken ?? null;
const instanceUrl = () => useAuthStore.getState().instanceUrl ?? null;

// Remember to add parent id in data if this is in someway is a reference to this.
// E.g. {..., "Initiative__c": "a0p1x0000008CbtAAE"}
async function create({ object, data }) {
    try {
        const response = await axios.post(
            `${instanceUrl()}/services/data/v${
                process.env.NEXT_PUBLIC_SF_VERSION
            }/sobjects/${object}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken()}`,
                },
            }
        );

        // Convert non-ok HTTP responses into errors:
        if (response.status !== 201) {
            throw {
                statusText: response.statusText,
                response,
            };
        }

        return response.data;
    } catch (error) {
        console.warn(error);
        return error;
    }
}

async function update({ object, id, data }) {
    try {
        const response = await axios.patch(
            `${instanceUrl()}/services/data/v${
                process.env.NEXT_PUBLIC_SF_VERSION
            }/sobjects/${object}/${id}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken()}`,
                },
            }
        );

        // Convert non-ok HTTP responses into errors:
        if (response.status !== 204) {
            throw {
                statusText: response,
                response,
            };
        }

        return 'All ok';
    } catch (error) {
        console.warn(error);
        return error;
    }
}

export { create, update };
