// Packages
import axios from 'axios';

const _userLoginXml = ({
    username,
    password,
    orgId,
    secretToken,
}) => `<?xml version="1.0" encoding="utf-8" ?>
<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:env="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:urn="urn:partner.soap.sforce.com">
  <env:Header>
    <urn:LoginScopeHeader>
        <urn:organizationId>${orgId}</urn:organizationId>
    </urn:LoginScopeHeader>
  </env:Header>
  <env:Body>
    <urn:login>
      <urn:username>${username}</urn:username>
      <urn:password>${password}${secretToken}</urn:password>
    </urn:login>
  </env:Body>
</env:Envelope>`;

async function login({
    username,
    password,
    orgId = process.env.NEXT_PUBLIC_SF_ORG_ID,
    secretToken = '',
}) {
    try {
        const { status, data } = await axios.post(
            `${process.env.NEXT_PUBLIC_SF_USER_SERVER}/services/Soap/u/${process.env.NEXT_PUBLIC_SF_VERSION}`,
            _userLoginXml({ username, password, orgId, secretToken }),
            {
                headers: {
                    'Content-Type': 'text/xml',
                    SOAPAction: 'login',
                },
            }
        );

        // Convert non-ok HTTP responses into errors:
        if (status !== 200) {
            throw {
                statusText: response.statusText,
                response,
            };
        }

        // Parse xml response
        const xmlParser = new DOMParser();
        const parsedXml = xmlParser.parseFromString(data, 'text/xml');

        // Deduct user information
        const userInfo = [
            ...parsedXml.getElementsByTagName('userInfo')[0].childNodes,
        ].reduce(
            (acc, node) => ({
                ...acc,
                [node.nodeName]: node.innerHTML,
            }),
            {}
        );

        // Get access token (session id)
        const accessToken = parsedXml.getElementsByTagName('sessionId')[0]
            .innerHTML;

        // Get timestamp when session is invalid
        const sessionInvalidTimestamp =
            Date.now() + parseInt(userInfo.sessionSecondsValid, 10) * 1000;

        return {
            ...userInfo,
            accessToken,
            sessionInvalidTimestamp,
            sessionCreatedTimestamp: Date.now(),
        };
    } catch (error) {
        console.warn(error);
        return error;
    }
}

export { login };
