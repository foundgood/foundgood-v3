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
            return `/wizard/${initiativeId}/complete/${reportId}`;
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
            return `/wizard/${initiativeId}/report-details/${reportId}`;
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
            return `/wizard/${initiativeId}/funders/${reportId}`;
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
            return `/wizard/${initiativeId}/overview/${reportId}`;
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
            return `/wizard/${initiativeId}/report-summary/${reportId}`;
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
            return `/wizard/${initiativeId}/risks-and-challenges/${reportId}`;
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
            return `/wizard/${initiativeId}/applicants/${reportId}`;
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
            return `/wizard/${initiativeId}/collaborators/${reportId}`;
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
            return `/wizard/${initiativeId}/employees-funded/${reportId}`;
        },
    },
    goals: {
        title: 'ReportWizardMenuGoals',
        titleNNF: 'ReportViewHeadingFunderObjectives', // Show different title to NNF
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
            return `/wizard/${initiativeId}/goals/${reportId}`;
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
            return `/wizard/${initiativeId}/activities/${reportId}`;
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
            return `/wizard/${initiativeId}/indicators/${reportId}`;
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
            return `/wizard/${initiativeId}/progress-so-far/${reportId}`;
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
            return `/wizard/${initiativeId}/sharing-results/${reportId}`;
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
            return `/wizard/${initiativeId}/influence-on-policy/${reportId}`;
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
            return `/wizard/${initiativeId}/evaluations/${reportId}`;
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
            return `/wizard/${initiativeId}/end-of-grant-reflections/${reportId}`;
        },
    },
    postProjectActivities: {
        title: 'ReportWizardMenuPostProjectActivities',
        labels: {
            form: {
                title: 'ReportWizardPostProjectActivitiesHeading',
                preamble: 'ReportWizardPostProjectActivitiesSubHeading',
            },
            help: {
                why: 'ReportWizardPostProjectActivitiesHelpWhy',
                what: 'ReportWizardPostProjectActivitiesHelpWhat',
                guide: 'ReportWizardPostProjectActivitiesHelpGuide',
            },
        },
        baseUrl: 'post-project-activities',
        url(initiativeId, reportId) {
            return `/wizard/${initiativeId}/post-project-activities/${reportId}`;
        },
    },
};

export { reportWizardDictionary };
