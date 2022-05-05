const d = {
    introduction: {
        title: 'Introduction',
        baseUrl: 'introduction',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/introduction/${reportId}`;
        },
        visible: false,
        hideBack: true,
    },
    summary: {
        title: 'ReportWizardMenuHeading1',
        visible: true,
        items: [],
    },
    keyChanges: {
        title: 'ReportWizardMenuHeading2',
        visible: true,
        items: [],
    },
    keyResults: {
        title: 'ReportWizardMenuHeading3',
        visible: true,
        items: [],
    },
    reflections: {
        title: 'ReportWizardMenuHeading4',
        visible: true,
        items: [],
    },
    complete: {
        title: 'Complete',
        visible: false,
        hideBack: true,
        hideExit: true,
        baseUrl: 'complete',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/complete/${reportId}`;
        },
    },
    done: {
        title: 'Done',
        visible: false,
        url(initiativeId, reportId) {
            return `/${initiativeId}/reports/${reportId}`;
        },
    },

    reportDetails: {
        title: 'ReportWizardMenuReportDetails',
        labels: {
            form: {
                title: 'ReportWizardReportDetailsHeading',
                preamble: 'ReportWizardReportDetailsSubHeading',
            },
            help: {
                why: 'ReportWizardReportDetailsHelpWhy',
                what: 'ReportWizardReportDetailsHelpWhat',
                guide: 'ReportWizardReportDetailsHelpGuide',
            },
        },
        baseUrl: 'report-details',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/report-details/${reportId}`;
        },
    },
    funders: {
        title: 'ReportWizardMenuFunders',
        labels: {
            form: {
                title: 'ReportWizardFundersHeading',
                preamble: 'ReportWizardFundersSubHeading',
            },
            help: {
                why: 'ReportWizardFundersHelpWhy',
                what: 'ReportWizardFundersHelpWhat',
                guide: 'ReportWizardFundersHelpGuide',
            },
        },
        baseUrl: 'funders',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/funders/${reportId}`;
        },
    },
    overview: {
        title: 'ReportWizardMenuOverview',
        labels: {
            form: {
                title: 'ReportWizardOverviewHeading',
                preamble: 'ReportWizardOverviewSubHeading',
            },
            help: {
                why: 'ReportWizardOverviewHelpWhy',
                what: 'ReportWizardOverviewHelpWhat',
                guide: 'ReportWizardOverviewHelpGuide',
            },
        },
        baseUrl: 'overview',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/overview/${reportId}`;
        },
    },
    reportSummary: {
        title: 'ReportWizardMenuSummary',
        labels: {
            form: {
                title: 'ReportWizardReportSummaryHeading',
                preamble: 'ReportWizardReportSummarySubHeading',
            },
            help: {
                why: 'ReportWizardReportSummaryHelpWhy',
                what: 'ReportWizardReportSummaryHelpWhat',
                guide: 'ReportWizardReportSummaryHelpGuide',
            },
        },
        baseUrl: 'report-summary',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/report-summary/${reportId}`;
        },
    },
    risksAndChallenges: {
        title: 'ReportWizardMenuRisks',
        labels: {
            form: {
                title: 'ReportWizardRisksHeading',
                preamble: 'ReportWizardRisksSubHeading',
            },
            help: {
                why: 'ReportWizardRisksHelpWhy',
                what: 'ReportWizardRisksHelpWhat',
                guide: 'ReportWizardRisksHelpGuide',
            },
        },
        baseUrl: 'risks-and-challenges',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/risks-and-challenges/${reportId}`;
        },
    },
    applicants: {
        title: 'ReportWizardMenuApplicants',
        labels: {
            form: {
                title: 'ReportWizardApplicantsHeading',
                preamble: 'ReportWizardApplicantsSubHeading',
            },
            help: {
                why: 'ReportWizardApplicantsHelpWhy',
                what: 'ReportWizardApplicantsHelpWhat',
                guide: 'ReportWizardApplicantsHelpGuide',
            },
        },
        baseUrl: 'applicants',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/applicants/${reportId}`;
        },
    },
    collaborators: {
        title: 'ReportWizardMenuCollaborations',
        labels: {
            form: {
                title: 'ReportWizardCollaboratorsHeading',
                preamble: 'ReportWizardCollaboratorsSubHeading',
            },
            help: {
                why: 'ReportWizardCollaboratorsHelpWhy',
                what: 'ReportWizardCollaboratorsHelpWhat',
                guide: 'ReportWizardCollaboratorsHelpGuide',
            },
        },
        baseUrl: 'collaborators',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/collaborators/${reportId}`;
        },
    },
    employeesFunded: {
        title: 'ReportWizardMenuEmployees',
        labels: {
            form: {
                title: 'ReportWizardEmployeesHeading',
                preamble: 'ReportWizardEmployeesSubHeading',
            },
            help: {
                why: 'ReportWizardEmployeesHelpWhy',
                what: 'ReportWizardEmployeesHelpWhat',
                guide: 'ReportWizardEmployeesHelpGuide',
            },
        },
        baseUrl: 'employees-funded',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/employees-funded/${reportId}`;
        },
    },
    goals: {
        title: 'ReportWizardMenuGoals',
        labels: {
            form: {
                title: 'ReportWizardGoalsHeading',
                preamble: 'ReportWizardGoalsSubHeading',
            },
            help: {
                why: 'ReportWizardGoalsHelpWhy',
                what: 'ReportWizardGoalsHelpWhat',
                guide: 'ReportWizardGoalsHelpGuide',
            },
        },
        baseUrl: 'goals',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/goals/${reportId}`;
        },
    },
    activities: {
        title: 'ReportWizardMenuActivities',
        labels: {
            form: {
                title: 'ReportWizardActivitiesHeading',
                preamble: 'ReportWizardActivitiesSubHeading',
            },
            help: {
                why: 'ReportWizardActivitiesHelpWhy',
                what: 'ReportWizardActivitiesHelpWhat',
                guide: 'ReportWizardActivitiesHelpGuide',
            },
        },
        baseUrl: 'activities',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/activities/${reportId}`;
        },
    },
    indicators: {
        title: 'ReportWizardMenuIndicators',
        labels: {
            form: {
                title: 'ReportWizardIndicatorsHeading',
                preamble: 'ReportWizardIndicatorsSubheading',
            },
            help: {
                why: 'ReportWizardIndicatorsHelpWhy',
                what: 'ReportWizardIndicatorsHelpWhat',
                guide: 'ReportWizardIndicatorsHelpGuide',
            },
        },
        baseUrl: 'indicators',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/indicators/${reportId}`;
        },
    },
    progressSoFar: {
        title: 'ReportWizardMenuProgress',
        labels: {
            form: {
                title: 'ReportWizardProgressHeading',
                preamble: 'ReportWizardProgressSubHeading',
            },
            help: {
                why: 'ReportWizardProgressHelpWhy',
                what: 'ReportWizardProgressHelpWhat',
                guide: 'ReportWizardProgressHelpGuide',
            },
        },
        baseUrl: 'progress-so-far',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/progress-so-far/${reportId}`;
        },
    },
    sharingResults: {
        title: 'ReportWizardMenuSharing',
        labels: {
            form: {
                title: 'ReportWizardSharingHeading',
                preamble: 'ReportWizardSharingSubHeading',
            },
            help: {
                why: 'ReportWizardSharingHelpWhy',
                what: 'ReportWizardSharingHelpWhat',
                guide: 'ReportWizardSharingHelpGuide',
            },
        },
        baseUrl: 'sharing-results',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/sharing-results/${reportId}`;
        },
    },
    outcomes: {},
    logbookEntry: {},
    influenceOnPolicy: {
        title: 'ReportWizardMenuInfluence',
        labels: {
            form: {
                title: 'ReportWizardInfluenceHeading',
                preamble: 'ReportWizardInfluenceSubHeading',
            },
            help: {
                why: 'ReportWizardInfluenceHelpWhy',
                what: 'ReportWizardInfluenceHelpWhat',
                guide: 'ReportWizardInfluenceHelpGuide',
            },
        },
        baseUrl: 'influence-on-policy',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/influence-on-policy/${reportId}`;
        },
    },
    evaluations: {
        title: 'ReportWizardMenuEvaluations',
        labels: {
            form: {
                title: 'ReportWizardEvaluationsHeading',
                preamble: 'ReportWizardEvaluationsSubHeading',
            },
            help: {
                why: 'ReportWizardEvaluationsHelpWhy',
                what: 'ReportWizardEvaluationsHelpWhat',
                guide: 'ReportWizardEvaluationsHelpGuide',
            },
        },
        baseUrl: 'evaluations',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/evaluations/${reportId}`;
        },
    },
    endOfGrantReflections: {
        title: 'ReportWizardMenuEndReflections',
        labels: {
            form: {
                title: 'ReportWizardEndReflectionsHeading',
                preamble: 'ReportWizardEndReflectionsSubHeading',
            },
            help: {
                why: 'ReportWizardEndReflectionsHelpWhy',
                what: 'ReportWizardEndReflectionsHelpWhat',
                guide: 'ReportWizardEndReflectionsHelpGuide',
            },
        },
        baseUrl: 'end-of-grant-reflections',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/end-of-grant-reflections/${reportId}`;
        },
    },
    // postProjectActivities: {
    //     title: 'ReportWizardMenuPostProjectActivities',
    //     labels: {
    //         form: {
    //             title: 'ReportWizardPostProjectActivitiesHeading',
    //             preamble: 'ReportWizardPostProjectActivitiesSubHeading',
    //         },
    //         help: {
    //             why: 'ReportWizardPostProjectActivitiesHelpWhy',
    //             what: 'ReportWizardPostProjectActivitiesHelpWhat',
    //             guide: 'ReportWizardPostProjectActivitiesHelpGuide',
    //         },
    //     },
    //     baseUrl: 'post-project-activities',
    //     url(initiativeId, reportId) {
    //         return `/report/${initiativeId}/post-project-activities/${reportId}`;
    //     },
    // },
};

const reportStructures = {
    Final: [
        d.introduction,
        {
            ...d.summary,
            items: [d.reportDetails, d.funders, d.overview],
        },
        {
            ...d.keyChanges,
            items: [
                d.applicants,
                d.collaborators,
                d.employeesFunded,
                d.activities,
                d.indicators,
                d.progressSoFar,
                d.sharingResults,
            ],
        },
        {
            ...d.keyResults,
            items: [d.influenceOnPolicy, d.evaluations],
        },
        {
            ...d.reflections,
            items: [d.endOfGrantReflections, d.reportSummary],
        },
        d.complete,
        d.done,
    ],
    Status: [
        d.introduction,
        {
            ...d.summary,
            items: [d.reportDetails, d.funders, d.overview],
        },
        {
            ...d.keyChanges,
            items: [d.applicants, d.collaborators],
        },
        { ...d.reflections, items: [d.reportSummary] },
        d.complete,
        d.done,
    ],
    Annual: [
        d.introduction,
        {
            ...d.summary,
            items: [d.reportDetails, d.funders, d.overview],
        },
        {
            ...d.keyChanges,
            items: [
                d.applicants,
                d.collaborators,
                d.employeesFunded,
                d.activities,
                d.indicators,
                d.progressSoFar,
                d.sharingResults,
            ],
        },
        {
            ...d.keyResults,
            items: [d.influenceOnPolicy, d.evaluations],
        },

        { ...d.reflections, items: [d.reportSummary] },
        d.complete,
        d.done,
    ],
    Standard: [
        d.introduction,
        {
            ...d.summary,
            items: [d.reportDetails, d.funders, d.overview],
        },
        {
            ...d.keyChanges,
            items: [
                d.applicants,
                d.collaborators,
                d.employeesFunded,
                d.activities,
                d.indicators,
                d.progressSoFar,
                d.sharingResults,
            ],
        },
        {
            ...d.keyResults,
            items: [d.influenceOnPolicy, d.evaluations],
        },

        { ...d.reflections, items: [d.reportSummary] },
        d.complete,
        d.done,
    ],
    Extended: [
        d.introduction,
        {
            ...d.summary,
            items: [d.reportDetails, d.funders, d.overview],
        },
        {
            ...d.keyChanges,
            items: [
                d.applicants,
                d.collaborators,
                d.employeesFunded,
                d.activities,
                d.indicators,
                d.progressSoFar,
                d.sharingResults,
            ],
        },
        {
            ...d.keyResults,
            items: [d.influenceOnPolicy, d.evaluations],
        },

        { ...d.reflections, items: [d.reportSummary] },
        d.complete,
        d.done,
    ],
};

export default reportStructures;
