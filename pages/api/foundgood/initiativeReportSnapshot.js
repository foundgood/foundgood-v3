import { salesForce, s3 } from 'utilities/api';

export default async (req, res) => {
    const {
        method,
        body: { ids, version = '1.1' },
    } = req;

    try {
        // Check for method and content
        if (method === 'POST' && Array.isArray(ids) && ids.length > 0) {
            // Got the ids now send response
            res.status(202).send(); // For when it's done

            // Login to SalesForce with OAuth2
            const { data: sfLoginData } = await salesForce.user.login(
                process.env.SYSTEM_LOGIN_USERNAME,
                process.env.SYSTEM_LOGIN_PASSWORD
            );

            // Create array of promises based on ids
            const sfDataPromises = ids.map(id =>
                salesForce.fetchers.query(
                    salesForce.queries.initiativeReportComplete.get(id),
                    sfLoginData.access_token,
                    sfLoginData.instance_url
                )
            );

            // Resolve SalesForce promises to get SalesForce data
            const sfDataObjects = await Promise.all(sfDataPromises);

            // Create array of promises based on results to send to S3
            const s3DataPromises = sfDataObjects.map(dataObject => {
                const data = dataObject?.records[0] ?? null;
                if (data) {
                    return s3.uploadInitiativeReport({
                        json: data,
                        fileName: data.Id,
                    });
                } else {
                    return new Promise(resolve => resolve());
                }
            });

            // Resolve S3 promises to get URLs
            const s3Data = await Promise.all(s3DataPromises);

            // Map data from s3 to fit SalesForce custom endpoint
            const exportResults = s3Data.map(item => ({
                initiativeReportId: item.key
                    .replace('snapshots/', '')
                    .replace('.json', ''),
                reportViewerVersion: version,
                exportedReportUrl: item.Location,
            }));

            // Send to SalesForce custom endpoint
            await salesForce.custom.setExportResults(
                exportResults,
                sfLoginData.access_token,
                sfLoginData.instance_url
            );

            // Logout from SalesForce
            await salesForce.user.logout(sfLoginData.access_token);
            return;
        }
    } catch (error) {
        // Otherwise fail
        res.status(400).json(error);
        return;
    }
};
