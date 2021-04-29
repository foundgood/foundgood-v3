// Packages
import axios from 'axios';

// Utilities
import { useAuthStore } from 'utilities/store';

// Retrieve access token and instance url from auth store
const accessToken = () => useAuthStore.getState().accessToken ?? null;
const instanceUrl = () => useAuthStore.getState().instanceUrl ?? null;

// Default limit
const limit = 100;

async function setUserLanguage({ language }) {
    try {
        const response = await axios.patch(
            `${instanceUrl()}/services/apexrest/User/setCurrentUserLanguage`,
            {
                languageCode: language,
            },
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
                statusText: response,
                response,
            };
        }

        return response;
    } catch (error) {
        console.warn(error);
        return error;
    }
}

async function getUserInitiativeRights({ initiativeId }) {
    try {
        const response = await axios.get(
            `${instanceUrl()}/services/apexrest/Initiative/getCurrentUserInitiativeRights?initiativeId=${initiativeId}`,
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
                statusText: response,
                response,
            };
        }

        return response;
    } catch (error) {
        console.warn(error);
        return error;
    }
}

async function getInitiativeList({ offset = 0 }) {
    try {
        const response = await axios.get(
            `${instanceUrl()}/services/apexrest/Initiative/getInitiativeList?SOQLLimit=${limit}&SOQLOffset=${offset}`,
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
                statusText: response,
                response,
            };
        }

        return response;
    } catch (error) {
        console.warn(error);
        return error;
    }
}

export { setUserLanguage, getUserInitiativeRights, getInitiativeList };
