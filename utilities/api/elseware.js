// Packages
import axios from 'axios';

// Utilities
import { useAuthStore } from 'utilities/store';

// Retrieve access token and instance url from auth store
const accessToken = () => useAuthStore.getState().accessToken ?? null;

async function get({ path, params = {}, token = accessToken() }) {
    const urlParams = new URLSearchParams(params).toString();
    try {
        const { status, statusText, data } = await axios.get(
            `${process.env.NEXT_PUBLIC_ELSEWARE_URL}/api/${path}${
                urlParams.length > 0 ? `?${urlParams}` : ''
            }`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            }
        );

        // Convert non-ok HTTP responses into errors:
        if (status !== 200) {
            throw {
                statusText: statusText,
            };
        }

        return data;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function create({ path, data = {}, token = accessToken() }) {
    try {
        const { status, statusText, data: responseData } = await axios.post(
            `${process.env.NEXT_PUBLIC_ELSEWARE_URL}/api/${path}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            }
        );

        // Convert non-ok HTTP responses into errors:
        if (status !== 201) {
            throw {
                statusText: statusText,
                response,
            };
        }

        return responseData;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function update({ path, data = {}, params = {}, token = accessToken() }) {
    try {
        const urlParams = new URLSearchParams(params).toString();
        const { status, statusText, data: responseData } = await axios.put(
            `${process.env.NEXT_PUBLIC_ELSEWARE_URL}/api/${path}${
                urlParams.length > 0 ? `?${urlParams}` : ''
            }`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            }
        );

        // Convert non-ok HTTP responses into errors:
        if (status !== 200) {
            throw {
                statusText: statusText,
                response,
            };
        }

        return responseData;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function remove({ path, params = {}, token = accessToken() }) {
    try {
        const urlParams = new URLSearchParams(params).toString();
        const { status, statusText, data: responseData } = await axios.delete(
            `${process.env.NEXT_PUBLIC_ELSEWARE_URL}/api/${path}${
                urlParams.length > 0 ? `?${urlParams}` : ''
            }`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            }
        );

        // Convert non-ok HTTP responses into errors:
        if (status !== 200) {
            throw {
                statusText: statusText,
                response,
            };
        }

        return responseData;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

export default { get, create, update, remove };
