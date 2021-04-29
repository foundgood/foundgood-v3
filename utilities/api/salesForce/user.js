// Packages
import axios from 'axios';

// Utilities
import { useAuthStore } from 'utilities/store';

// Retrieve access token from auth store
const accessToken = () => useAuthStore.getState().accessToken ?? null;

async function logout() {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_LOGIN_AUTH_URL}/services/oauth2/revoke`,
            new URLSearchParams({
                token: accessToken(),
            })
        );

        // Convert non-ok HTTP responses into errors:
        if (response.status !== 200) {
            throw {
                statusText: response.statusText,
                response,
            };
        }

        return 'User have been logged out';
    } catch (error) {
        console.warn(error);
        return error;
    }
}

async function getInfo({ token, url }) {
    try {
        const response = await axios.get(
            `${url}/services/apexrest/User/getCurrentUserInfo`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
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

        return response.data;
    } catch (error) {
        console.warn(error);
        return error;
    }
}

export { logout, getInfo };
