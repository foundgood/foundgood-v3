// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import useSWR from 'swr';

// Utilities
import { useAuth, useContext } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';
import { simpleJson } from 'utilities/api';

// Components
import Report_1_0 from 'components/_report/templates/report_1_0';
import Report_1_1 from 'components/_report/templates/report_1_1';

const ReportComponent = () => {
    // Hook: Context
    const { REPORT_ID } = useContext();

    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Store: InitiativeData
    const {
        initiative: initiativeFromSalesForce,
        populateReportDetails,
        populateReport,
        getReport,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Effect: Populate report and reportDetails based on id
    useEffect(() => {
        populateReport(REPORT_ID);
        populateReportDetails(REPORT_ID);
    }, [REPORT_ID]);

    // State: Report version
    const [reportVersion, setReportVersion] = useState(null);

    // Effect: React to new report ids and set version accordingly
    useEffect(() => {
        if (getReport(REPORT_ID)?.Id) {
            setReportVersion(
                getReport(REPORT_ID)?.Report_Viewer_Version__c ?? 'default'
            );
        }
    }, [REPORT_ID, getReport(REPORT_ID)?.Report_Viewer_Version__c]);

    // Fetcher stand by for json data if report version number matches
    const { data: initiativeFromJson } = useSWR(
        ['1.0', '1.1'].includes(reportVersion)
            ? getReport(REPORT_ID).Exported_Report_URL__c
            : null,
        simpleJson.fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    // Method: Return correct template
    function getReportTemplate() {
        switch (reportVersion) {
            case '1.0':
                // Version 1.0 with JSON data
                return (
                    <Report_1_0
                        {...{
                            initiative: initiativeFromJson,
                            report: initiativeFromJson?._reports[REPORT_ID],
                            CONSTANTS,
                        }}
                    />
                );
            case '1.1':
                // Version 1.1 with JSON data
                return (
                    <Report_1_1
                        {...{
                            initiative: initiativeFromJson,
                            report: initiativeFromJson?._reports[REPORT_ID],
                            CONSTANTS,
                        }}
                    />
                );
            default:
                // Version 1.1 with Salesforce data
                return (
                    <Report_1_1
                        {...{
                            initiative: initiativeFromSalesForce,
                            report:
                                initiativeFromSalesForce?._reports[REPORT_ID],
                            CONSTANTS,
                        }}
                    />
                );
        }
    }

    return getReportTemplate();
};

ReportComponent.propTypes = {
    pageProps: t.object,
};

ReportComponent.defaultProps = {
    pageProps: {},
};

ReportComponent.layout = 'report';

export default ReportComponent;
