// Packages
import axios from 'axios';

async function logout({ accessToken }) {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SF_USER_SERVER}/services/oauth2/revoke`,
            new URLSearchParams({
                token: accessToken,
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

export { logout };
