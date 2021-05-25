import { salesForce, s3 } from 'utilities/api';
import atob from 'atob';

export default async (req, res) => {
    const { method, body } = req;

    const validUser =
        (req?.headers?.authorization ?? false) &&
        atob(req.headers.authorization.replace('Basic ', '')) ===
            `${process.env.API_USER}:${process.env.API_PASSWORD}`;

    try {
        // Chcek if valid user
        if (!validUser) {
            res.status(401).send();
            return;
        }

        // Check for authentication, method and content
        if (
            method === 'POST' &&
            Array.isArray(body.ids) &&
            body.ids.length > 0
        ) {
            // Login to SalesForce with OAuth2
            const { data: sfLoginData } = await salesForce.user.login(
                process.env.SYSTEM_LOGIN_USERNAME,
                process.env.SYSTEM_LOGIN_PASSWORD
            );

            console.log({ sfLoginData });

            // Create array of promises based on ids
            const sfDataPromises = body.ids.map(id =>
                salesForce.fetchers.query(
                    salesForce.queries.snapshot.initiativeReportAndinitiativeData(
                        [id]
                    ),
                    sfLoginData.access_token,
                    sfLoginData.instance_url
                )
            );

            // console.log({ sfDataPromises });

            // Resolve SalesForce promises to get SalesForce data
            const sfDataObjects = await Promise.all(sfDataPromises);

            // console.log({ sfDataObjects });

            // // Create array of promises based on results to send to S3
            // const s3DataPromises = sfDataObjects.map(dataObject => {
            //     const data = dataObject?.records[0] ?? null;
            //     if (data) {
            //         return s3.uploadInitiativeReport({
            //             json: data,
            //             fileName: data.Id,
            //         });
            //     } else {
            //         return new Promise(resolve => resolve());
            //     }
            // });

            // // console.log({ s3DataPromises });

            // // Resolve S3 promises to get URLs
            // const s3Data = await Promise.all(s3DataPromises);

            // // console.log({ s3Data });

            // // Map data from s3 to fit SalesForce custom endpoint
            // const exportResults = s3Data.map(item => ({
            //     initiativeReportId: item.key
            //         .replace('snapshots/', '')
            //         .replace('.json', ''),
            //     reportViewerVersion: body.version ?? '1.1',
            //     exportedReportUrl: item.Location,
            // }));

            // // console.log({ exportResults });

            // // Send to SalesForce custom endpoint
            // const { data } = await salesForce.custom.setExportResults(
            //     exportResults,
            //     sfLoginData.access_token,
            //     sfLoginData.instance_url
            // );

            // console.log({ data });

            // Logout from SalesForce
            await salesForce.user.logout(sfLoginData.access_token);

            res.status(200).json(sfDataObjects);
            // res.status(200).json({ Status: 'Complete' }); // For when it's done

            return;
        }
    } catch (error) {
        // Otherwise fail
        res.status(400).json(error);
        return;
    }
};
