import { salesForce, s3 } from 'utilities/api';
import atob from 'atob';

function _keyValues(state, i) {
    return { ...state, [i.Id]: i };
}

export default async (req, res) => {
    const { method, body } = req;

    const validUser =
        (req?.headers?.authorization ?? false) &&
        atob(req.headers.authorization.replace('Basic ', '')) ===
            `${process.env.API_USER}:${process.env.API_PASSWORD}`;

    console.log({
        body: body,
    });

    console.log({
        bodyids: body.ids,
    });

    console.log({
        bodyidslength: body.ids.length,
    });

    console.log({
        bodyidsarray: Array.isArray(body.ids),
    });

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
            console.log('check 2', {
                user: process.env.SYSTEM_LOGIN_USERNAME,
                pw: process.env.SYSTEM_LOGIN_PASSWORD,
            });

            // Login to SalesForce with OAuth2
            const { data: sfLoginData } = await salesForce.user.login(
                process.env.SYSTEM_LOGIN_USERNAME,
                process.env.SYSTEM_LOGIN_PASSWORD
            );

            console.log({ sfLoginData });

            // Reports object
            let initiatives;

            // InitiativeReports (and InitiativeId)
            const sfInitiativeReports = await salesForce.fetchers.query(
                salesForce.queries.initiativeReport.getMultiple(body.ids),
                sfLoginData.access_token,
                sfLoginData.instance_url
            );

            // Handle no reports
            if (!sfInitiativeReports?.records ?? false) {
                // One of the ids are not there
                res.status(400).json({
                    message: 'No reports with ids',
                    ids: body.ids,
                });

                return;
            }

            // Create simple object with only initiative ids and base structure
            initiatives = sfInitiativeReports.records.reduce(
                (acc, report) => ({
                    ...acc,
                    [report.Initiative__c]: {},
                }),
                {}
            );

            // Get report details
            const sfReportDetails = await salesForce.fetchers.query(
                salesForce.queries.initiativeReportDetail.getAllReportMultiple(
                    body.ids
                ),
                sfLoginData.access_token,
                sfLoginData.instance_url
            );

            // Get initiatives
            const sfInitiatives = await salesForce.fetchers.query(
                salesForce.queries.initiative.getMultiple(
                    Object.keys(initiatives)
                ),
                sfLoginData.access_token,
                sfLoginData.instance_url
            );

            // Get initiative collaborators
            const sfInitiativeCollaborators = await salesForce.fetchers.query(
                salesForce.queries.initiativeCollaborator.getAllMultiple(
                    Object.keys(initiatives)
                ),
                sfLoginData.access_token,
                sfLoginData.instance_url
            );

            // Get initiative funders
            const sfInitiativeFunders = await salesForce.fetchers.query(
                salesForce.queries.initiativeFunder.getAllMultiple(
                    Object.keys(initiatives)
                ),
                sfLoginData.access_token,
                sfLoginData.instance_url
            );

            // Get initiative employees funded
            const sfInitiativeEmployeesFunded = await salesForce.fetchers.query(
                salesForce.queries.initiativeEmployeeFunded.getAllMultiple(
                    Object.keys(initiatives)
                ),
                sfLoginData.access_token,
                sfLoginData.instance_url
            );

            // Get initiative goals
            const sfInitiativeGoals = await salesForce.fetchers.query(
                salesForce.queries.initiativeGoal.getAllMultiple(
                    Object.keys(initiatives)
                ),
                sfLoginData.access_token,
                sfLoginData.instance_url
            );

            // Get initiative activites
            const sfInitiativeActivities = await salesForce.fetchers.query(
                salesForce.queries.initiativeActivity.getAllMultiple(
                    Object.keys(initiatives)
                ),
                sfLoginData.access_token,
                sfLoginData.instance_url
            );

            // Get initiative activites
            const sfInitiativeActivitiesSuccessMetrics = await salesForce.fetchers.query(
                salesForce.queries.initiativeActivitySuccessMetric.getAllMultiple(
                    Object.keys(initiatives)
                ),
                sfLoginData.access_token,
                sfLoginData.instance_url
            );

            // Update initiatives
            initiatives = Object.keys(initiatives).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: {
                        ...sfInitiatives.records.filter(i => i.Id === key)[0],
                        _reports: sfInitiativeReports.records
                            .filter(i => i.Initiative__c === key)
                            .reduce(_keyValues, {}),
                        _reportDetails: sfReportDetails.records
                            .filter(
                                i =>
                                    i.Initiative_Report__r.Initiative__c === key
                            )
                            .reduce(_keyValues, {}),
                        _collaborators: sfInitiativeCollaborators.records.reduce(
                            _keyValues,
                            {}
                        ),
                        _funders: sfInitiativeFunders.records.reduce(
                            _keyValues,
                            {}
                        ),
                        _employeesFunded: sfInitiativeEmployeesFunded.records.reduce(
                            _keyValues,
                            {}
                        ),
                        _goals: sfInitiativeGoals.records.reduce(
                            _keyValues,
                            {}
                        ),
                        _activities: sfInitiativeActivities.records.reduce(
                            _keyValues,
                            {}
                        ),
                        _activitySuccessMetrics: sfInitiativeActivitiesSuccessMetrics.records.reduce(
                            _keyValues,
                            {}
                        ),

                        // Not used according to Robin
                        // _activityGoals: {},
                        // _initiativeUpdates: {},
                    },
                }),
                {}
            );

            console.log({ initiatives });

            // Create array of promises based on results to send to S3
            const s3DataPromises = Object.values(initiatives)
                .map(initiative => {
                    if (initiative) {
                        return Object.values(initiative._reports).map(
                            report => {
                                return s3.uploadInitiativeReport({
                                    json: initiative,
                                    fileName: report.Id,
                                });
                            }
                        );
                    } else {
                        return new Promise(resolve => resolve());
                    }
                })
                .flat();

            console.log({ s3DataPromises });

            // Resolve S3 promises to get URLs
            const s3Data = await Promise.all(s3DataPromises);

            console.log({ s3Data });

            // Map data from s3 to fit SalesForce custom endpoint
            const exportResults = s3Data.map(item => ({
                initiativeReportId: item.key
                    .replace('snapshots/', '')
                    .replace('.json', ''),
                reportViewerVersion: body.version ?? '1.1',
                exportedReportUrl: item.Location,
            }));

            console.log({ exportResults });

            // Send to SalesForce custom endpoint
            const { data } = await salesForce.custom.setExportResults(
                exportResults,
                sfLoginData.access_token,
                sfLoginData.instance_url
            );

            console.log({ data });

            // Logout from SalesForce
            await salesForce.user.logout(sfLoginData.access_token);

            // res.status(200).json(exportResults);
            res.status(200).json({ Status: 'Complete' }); // For when it's done

            return;
        }
    } catch (error) {
        // Otherwise fail
        res.status(400).json(error);
        return;
    }
};
