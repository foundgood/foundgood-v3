// Packages
import axios from 'axios';

// Utilities
import { useAuthStore } from 'utilities/store';

// Retrieve access token and instance url from auth store
const accessToken = () => useAuthStore.getState().accessToken ?? null;
const instanceUrl = () => useAuthStore.getState().instanceUrl ?? null;

async function setExportResults(
    results,
    token = accessToken(),
    url = instanceUrl()
) {
    try {
        const response = await axios.post(
            `${url}/services/apexrest/InitiativeReport/setExportResults`,
            {
                listExportResults: results,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Convert non-ok HTTP responses into errors:
        if (response.status !== 200) {
            throw 'error';
        }

        return response;
    } catch (error) {
        console.warn(error);
        return error;
    }
}

export { setExportResults };
