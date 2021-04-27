// Packages
import axios from 'axios';

// Utilities
import { useAuthStore } from 'utilities/store';

// Retrieve access token from user in auth store
const accessToken = () => useAuthStore.getState().user?.accessToken ?? null;

async function query(query) {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SF_ENDPOINT}/services/data/v${process.env.NEXT_PUBLIC_SF_VERSION}/query/?q=${query}`,
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
