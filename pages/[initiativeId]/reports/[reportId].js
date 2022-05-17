// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import useSWR from 'swr';

// Utilities
import { useContext } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';
import { simpleJson } from 'utilities/api';

// Components
import WithAuth from 'components/withAuth';
import Report_1_0 from 'components/_report/templates/report_1_0';
import Report_1_1 from 'components/_report/templates/report_1_1';

const ReportComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { REPORT_ID } = useContext();

    // ///////////////////
    // STATE
    // ///////////////////

    const [reportVersion, setReportVersion] = useState(null);

    // ///////////////////
    // DATA
    // ///////////////////

    // Fetcher stand by for json data if report version number matches
    const { data: initiativeFromJson } = useSWR(
        ['1.0', '1.1'].includes(reportVersion)
            ? utilities.reports.get(REPORT_ID).Exported_Report_URL__c
            : null,
        simpleJson.fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Effect: React to new report ids and set version accordingly
    useEffect(() => {
        if (utilities.reports.get(REPORT_ID)?.Id) {
            setReportVersion(
                utilities.reports.get(REPORT_ID)?.Report_Viewer_Version__c ??
                    'default'
            );
        }
    }, [REPORT_ID, utilities.reports.get(REPORT_ID)?.Report_Viewer_Version__c]);

    // ///////////////////
    // RENDER
    // ///////////////////

    // Method: Return correct template
    function getReportTemplate() {
        switch (reportVersion) {
            case '1.0':
                // Version 1.0 with JSON data
                return (
                    <Report_1_0
                        {...{
                            initiativeData: initiativeFromJson,
                            reportData: initiativeFromJson?._reports[REPORT_ID],
                        }}
                    />
                );
            case '1.1':
                // Version 1.1 with JSON data
                return (
                    <Report_1_1
                        {...{
                            initiativeData: initiativeFromJson,
                            reportData: initiativeFromJson?._reports[REPORT_ID],
                        }}
                    />
                );
            default:
                // Version 1.1 with Salesforce data
                return (
                    <Report_1_1
                        {...{
                            initiativeData: utilities.initiative.get(),
                            reportData: utilities.reports.get(REPORT_ID),
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

export default WithAuth(ReportComponent);
