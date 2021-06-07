// Packages
import axios from 'axios';

// Utilities
import { useAuthStore } from 'utilities/store';
import { queries } from 'utilities/api/salesForce/queries';
import { query } from 'utilities/api/salesForce/fetchers';

// Retrieve access token from auth store
const accessToken = () => useAuthStore.getState().accessToken ?? null;

async function login(username, password) {
    return axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/services/oauth2/token`,
        new URLSearchParams({
            grant_type: 'password',
            client_id: process.env.SYSTEM_LOGIN_CLIENT_ID,
            client_secret: process.env.SYSTEM_LOGIN_CLIENT_SECRET,
            username,
            password,
        })
    );
}

async function logout(token = accessToken()) {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_AUTH_URL}/services/oauth2/revoke`,
            new URLSearchParams({
                token,
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
        // Get user info
        const userInfo = await getUserInfo(token, url);
        // Get users linked account info
        const accountInfo = await getAccountInfo(userInfo.user_id, token, url);

        const user = { ...userInfo, ...accountInfo };

        return user;
    } catch (error) {
        console.warn(error);
        return error;
    }
}

async function getUserInfo(token, url) {
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

async function getAccountInfo(id, token, url) {
    try {
        const response = await query(queries.user.getUser(id), token, url);
        if (response?.totalSize !== 1) {
            throw {
                statusText: response.statusText,
                response,
            };
        }

        return response.records[0];
    } catch (error) {
        console.warn(error);
        return error;
    }
}

export { login, logout, getInfo };
