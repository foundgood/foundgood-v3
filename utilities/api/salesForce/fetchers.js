// Packages
import axios from 'axios';

// Utilities
import { useAuthStore } from 'utilities/store';

// Retrieve access token and instance url from auth store
const accessToken = () => useAuthStore.getState().accessToken ?? null;
const instanceUrl = () => useAuthStore.getState().instanceUrl ?? null;

async function query(query) {
    try {
        const response = await axios.get(
            `${instanceUrl()}/services/data/v${
                process.env.NEXT_PUBLIC_SF_VERSION
            }/query/?q=${query}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken()}`,
                },
            }
        );

        // Convert non-ok HTTP responses into errors:
        if (response.status !== 200) {
            throw {
                statusText: response.statusText,
                response,
            };
        }

        return response;
    } catch (error) {
        console.warn(error);
        return error;
    }
}

export { query };
