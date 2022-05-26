import axios from 'axios';

async function checkUser(user) {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_LOCAL_SERVER_URL}/api/foundgood/checkUser`,
            { user },
            {
                headers: {
                    'Content-Type': 'application/json',
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

export default checkUser;
