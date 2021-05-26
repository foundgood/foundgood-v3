import axios from 'axios';

async function fetcher(jsonUrl) {
    try {
        const response = await axios.get(jsonUrl);

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

export default { fetcher };
