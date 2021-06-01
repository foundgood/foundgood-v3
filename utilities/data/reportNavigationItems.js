const reportWizardDictionary = {
    introduction: {
        title: 'Introduction',
        baseUrl: 'introduction',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/introduction/${reportId}`;
        },
        visible: false,
        hideBack: true,
    },
    summary: {
        title: 'custom.FA_ReportWizardMenuHeading1',
        visible: true,
        items: [],
    },
    keyChanges: {
        title: 'custom.FA_ReportWizardMenuHeading2',
        visible: true,
        items: [],
    },
    keyResults: {
        title: 'custom.FA_ReportWizardMenuHeading3',
        visible: true,
        items: [],
    },
    reflections: {
        title: 'custom.FA_ReportWizardMenuHeading4',
        visible: true,
        items: [],
    },
    done: {
        title: 'Done',
        visible: false,
        url(initiativeId, reportId) {
            return `/${initiativeId}/reports/${reportId}`;
        },
    },

    reportDetails: {
        title: 'custom.FA_ReportWizardMenuReportDetails',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardReportDetailsHeading',
                preamble: 'custom.FA_ReportWizardReportDetailsSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardReportDetailsHelpWhy',
                what: 'custom.FA_ReportWizardReportDetailsHelpWhat',
                guide: 'custom.FA_ReportWizardReportDetailsHelpGuide',
            },
        },
        baseUrl: 'report-details',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/report-details/${reportId}`;
        },
    },
    funders: {
        title: 'custom.FA_ReportWizardMenuFunders',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardFundersHeading',
                preamble: 'custom.FA_ReportWizardFundersSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardFundersHelpWhy',
                what: 'custom.FA_ReportWizardFundersHelpWhat',
                guide: 'custom.FA_ReportWizardFundersHelpGuide',
            },
        },
        baseUrl: 'funders',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/funders/${reportId}`;
        },
    },
    overview: {
        title: 'custom.FA_ReportWizardMenuOverview',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardOverviewHeading',
                preamble: 'custom.FA_ReportWizardOverviewSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardOverviewHelpWhy',
                what: 'custom.FA_ReportWizardOverviewHelpWhat',
                guide: 'custom.FA_ReportWizardOverviewHelpGuide',
            },
        },
        baseUrl: 'overview',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/overview/${reportId}`;
        },
    },
    reportSummary: {
        title: 'custom.FA_ReportWizardMenuSummary',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardReportSummaryHeading',
                preamble: 'custom.FA_ReportWizardReportSummarySubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardReportSummaryHelpWhy',
                what: 'custom.FA_ReportWizardReportSummaryHelpWhat',
                guide: 'custom.FA_ReportWizardReportSummaryHelpGuide',
            },
        },
        baseUrl: 'report-summary',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/report-summary/${reportId}`;
        },
    },
    risksAndChallenges: {
        title: 'custom.FA_ReportWizardMenuRisks',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardRisksHeading',
                preamble: 'custom.FA_ReportWizardRisksSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardRisksHelpWhy',
                what: 'custom.FA_ReportWizardRisksHelpWhat',
                guide: 'custom.FA_ReportWizardRisksHelpGuide',
            },
        },
        baseUrl: 'risks-and-challenges',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/risks-and-challenges/${reportId}`;
        },
    },
    applicants: {
        title: 'custom.FA_ReportWizardMenuApplicants',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardApplicantsHeading',
                preamble: 'custom.FA_ReportWizardApplicantsSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardApplicantsHelpWhy',
                what: 'custom.FA_ReportWizardApplicantsHelpWhat',
                guide: 'custom.FA_ReportWizardApplicantsHelpGuide',
            },
        },
        baseUrl: 'applicants',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/applicants/${reportId}`;
        },
    },
    collaborators: {
        title: 'custom.FA_ReportWizardMenuCollaborations',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardCollaboratorsHeading',
                preamble: 'custom.FA_ReportWizardCollaboratorsSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardCollaboratorsHelpWhy',
                what: 'custom.FA_ReportWizardCollaboratorsHelpWhat',
                guide: 'custom.FA_ReportWizardCollaboratorsHelpGuide',
            },
        },
        baseUrl: 'collaborators',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/collaborators/${reportId}`;
        },
    },
    employeesFunded: {
        title: 'custom.FA_ReportWizardMenuEmployees',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardEmployeesHeading',
                preamble: 'custom.FA_ReportWizardEmployeesSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardEmployeesHelpWhy',
                what: 'custom.FA_ReportWizardEmployeesHelpWhat',
                guide: 'custom.FA_ReportWizardEmployeesHelpGuide',
            },
        },
        baseUrl: 'employees-funded',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/employees-funded/${reportId}`;
        },
    },
    goals: {
        title: 'custom.FA_ReportWizardMenuGoals',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardGoalsHeading',
                preamble: 'custom.FA_ReportWizardGoalsSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardGoalsHelpWhy',
                what: 'custom.FA_ReportWizardGoalsHelpWhat',
                guide: 'custom.FA_ReportWizardGoalsHelpGuide',
            },
        },
        baseUrl: 'goals',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/goals/${reportId}`;
        },
    },
    activities: {
        title: 'custom.FA_ReportWizardMenuActivities',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardActivitiesHeading',
                preamble: 'custom.FA_ReportWizardActivitiesSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardActivitiesHelpWhy',
                what: 'custom.FA_ReportWizardActivitiesHelpWhat',
                guide: 'custom.FA_ReportWizardActivitiesHelpGuide',
            },
        },
        baseUrl: 'activities',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/activities/${reportId}`;
        },
    },
    indicators: {
        title: 'custom.FA_ReportWizardMenuIndicators',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardIndicatorsHeading',
                preamble: 'custom.FA_ReportWizardIndicatorsSubheading',
            },
            help: {
                why: 'custom.FA_ReportWizardIndicatorsHelpWhy',
                what: 'custom.FA_ReportWizardIndicatorsHelpWhat',
                guide: 'custom.FA_ReportWizardIndicatorsHelpGuide',
            },
        },
        baseUrl: 'indicators',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/indicators/${reportId}`;
        },
    },
    progressSoFar: {
        title: 'custom.FA_ReportWizardMenuProgress',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardProgressHeading',
                preamble: 'custom.FA_ReportWizardProgressSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardProgressHelpWhy',
                what: 'custom.FA_ReportWizardProgressHelpWhat',
                guide: 'custom.FA_ReportWizardProgressHelpGuide',
            },
        },
        baseUrl: 'progress-so-far',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/progress-so-far/${reportId}`;
        },
    },
    sharingResults: {
        title: 'custom.FA_ReportWizardMenuSharing',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardSharingHeading',
                preamble: 'custom.FA_ReportWizardSharingSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardSharingHelpWhy',
                what: 'custom.FA_ReportWizardSharingHelpWhat',
                guide: 'custom.FA_ReportWizardSharingHelpGuide',
            },
        },
        baseUrl: 'sharing-results',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/sharing-results/${reportId}`;
        },
    },
    outcomes: {},
    logbookEntry: {},
    influenceOnPolicy: {
        title: 'custom.FA_ReportWizardMenuInfluence',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardInfluenceHeading',
                preamble: 'custom.FA_ReportWizardInfluenceSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardInfluenceHelpWhy',
                what: 'custom.FA_ReportWizardInfluenceHelpWhat',
                guide: 'custom.FA_ReportWizardInfluenceHelpGuide',
            },
        },
        baseUrl: 'influence-on-policy',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/influence-on-policy/${reportId}`;
        },
    },
    evaluations: {
        title: 'custom.FA_ReportWizardMenuEvaluations',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardEvaluationsHeading',
                preamble: 'custom.FA_ReportWizardEvaluationsSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardEvaluationsHelpWhy',
                what: 'custom.FA_ReportWizardEvaluationsHelpWhat',
                guide: 'custom.FA_ReportWizardEvaluationsHelpGuide',
            },
        },
        baseUrl: 'evaluations',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/evaluations/${reportId}`;
        },
    },
    endOfGrantReflections: {
        title: 'custom.FA_ReportWizardMenuEndReflections',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardEndReflectionsHeading',
                preamble: 'custom.FA_ReportWizardEndReflectionsSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardEndReflectionsHelpWhy',
                what: 'custom.FA_ReportWizardEndReflectionsHelpWhat',
                guide: 'custom.FA_ReportWizardEndReflectionsHelpGuide',
            },
        },
        baseUrl: 'end-of-grant-reflections',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/end-of-grant-reflections/${reportId}`;
        },
    },
    postProjectActivities: {
        title: 'custom.FA_ReportWizardMenuPostProjectActivities',
        labels: {
            form: {
                title: 'custom.FA_ReportWizardPostProjectActivitiesHeading',
                preamble:
                    'custom.FA_ReportWizardPostProjectActivitiesSubHeading',
            },
            help: {
                why: 'custom.FA_ReportWizardPostProjectActivitiesHelpWhy',
                what: 'custom.FA_ReportWizardPostProjectActivitiesHelpWhat',
                guide: 'custom.FA_ReportWizardPostProjectActivitiesHelpGuide',
            },
        },
        baseUrl: 'post-project-activities',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/post-project-activities/${reportId}`;
        },
    },
};

export { reportWizardDictionary };
