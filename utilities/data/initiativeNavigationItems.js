const initiativeWizardDictionary = {
    introduction: {
        title: 'Introduction',
        baseUrl: 'introduction',
        visible: false,
        hideBack: true,
    },
    informationCapture: {
        title: 'Information capture',
        baseUrl: 'information-capture',
        url(initiativeId) {
            return `/wizard/${initiativeId}/information-capture`;
        },
        visible: false,
        hideBack: true,
    },
    context: {
        title: 'MenuContext',
        visible: true,
        items: [],
    },
    background: {
        title: 'MenuInitiativeDetails',
        visible: true,
        items: [],
    },
    activitiesParent: {
        title: 'MenuActivities',
        visible: true,
        items: [],
    },
    developments: {
        title: 'MenuDevelopments',
        visible: true,
        items: [],
    },
    logbook: {
        title: 'MenuLogbook',
        visible: true,
        items: [],
    },
    reports: {
        title: 'TabReports',
        visible: true,
        items: [],
    },
    done: {
        title: 'Done',
        visible: false,
        baseUrl: '',
        url(initiativeId) {
            return `/${initiativeId}/overview`;
        },
    },

    overview: {
        baseUrl: 'overview',
        url(initiativeId) {
            return `/wizard/${initiativeId}/overview`;
        },
        title: 'InitiativeViewOverviewHeading',
        labels: {
            form: {
                title: 'InitiativeWizardOverviewHeading',
                preamble: 'InitiativeWizardOverviewSubheading',
            },
            help: {
                why: 'InitiativeWizardOverviewHelpWhy',
                what: 'InitiativeWizardOverviewHelpWhat',
                guide: 'InitiativeWizardOverviewHelpGuide',
            },
        },
    },

    funders: {
        baseUrl: 'funders',
        url(initiativeId) {
            return `/wizard/${initiativeId}/funders`;
        },
        title: 'InitiativeViewFundersGrantsHeading',
        labels: {
            form: {
                title: 'InitiativeWizardFundersHeading',
                preamble: 'InitiativeWizardFundersSubheading',
            },
            help: {
                why: 'InitiativeWizardFundersHelpWhy',
                what: 'InitiativeWizardFundersHelpWhat',
                guide: 'InitiativeWizardFundersHelpGuide',
            },
        },
    },
    applicants: {
        baseUrl: 'applicants',
        url(initiativeId) {
            return `/wizard/${initiativeId}/applicants`;
        },
        title: 'InitiativeViewApplicantsHeading',
        labels: {
            form: {
                title: 'InitiativeWizardApplicantsHeading',
                preamble: 'InitiativeWizardApplicantsSubheading',
            },
            help: {
                why: 'InitiativeWizardApplicantsHelpWhy',
                what: 'InitiativeWizardApplicantsHelpWhat',
                guide: 'InitiativeWizardApplicantsHelpGuide',
            },
        },
    },
    collaborators: {
        baseUrl: 'collaborators',
        url(initiativeId) {
            return `/wizard/${initiativeId}/collaborators`;
        },
        title: 'InitiativeViewCollaboratorsHeading',
        labels: {
            form: {
                title: 'InitiativeWizardCollaboratorsHeading',
                preamble: 'InitiativeWizardCollaboratorsSubheading',
            },
            help: {
                why: 'InitiativeWizardCollaboratorsHelpWhy',
                what: 'InitiativeWizardCollaboratorsHelpWhat',
                guide: 'InitiativeWizardCollaboratorsHelpGuide',
            },
        },
    },
    employeesFunded: {
        baseUrl: 'employees-funded',
        url(initiativeId) {
            return `/wizard/${initiativeId}/employees-funded`;
        },
        title: 'InitiativeViewEmployeesFundedHeading',
        labels: {
            form: {
                title: 'InitiativeWizardEmployeesHeading',
                preamble: 'InitiativeWizardEmployeesSubheading',
            },
            help: {
                why: 'InitiativeWizardEmployeesHelpWhy',
                what: 'InitiativeWizardEmployeesHelpWhat',
                guide: 'InitiativeWizardEmployeesHelpGuide',
            },
        },
    },
    problemsToBeSolved: {
        title: 'InitiativeViewProblemsHeading',
        baseUrl: 'problems-to-be-solved',
        url(initiativeId) {
            return `/wizard/${initiativeId}/problems-to-be-solved`;
        },
        labels: {
            form: {
                title: 'InitiativeWizardProblemsHeading',
                preamble: 'InitiativeWizardProblemsSubheading',
            },
            help: {
                why: 'InitiativeWizardProblemsHelpWhy',
                what: 'InitiativeWizardProblemsHelpWhat',
                guide: 'InitiativeWizardProblemsHelpGuide',
            },
        },
    },
    causesOfTheProblem: {
        title: 'InitiativeViewCausesHeading',
        baseUrl: 'causes-of-the-problem',
        url(initiativeId) {
            return `/wizard/${initiativeId}/causes-of-the-problem`;
        },
        labels: {
            form: {
                title: 'InitiativeWizardCausesHeading',
                preamble: 'InitiativeWizardCausesSubheading',
            },
            help: {
                why: 'InitiativeWizardCausesHelpWhy',
                what: 'InitiativeWizardCausesHelpWhat',
                guide: 'InitiativeWizardCausesHelpGuide',
            },
        },
    },
    organisationalFocus: {
        title: 'InitiativeViewOrgFocusHeading',
        baseUrl: 'organisational-focus',
        url(initiativeId) {
            return `/wizard/${initiativeId}/organisational-focus`;
        },
        labels: {
            form: {
                title: 'InitiativeWizardOrgFocusHeading',
                preamble: 'InitiativeWizardOrgFocusSubheading',
            },
            help: {
                why: 'InitiativeWizardOrgFocusHelpWhy',
                what: 'InitiativeWizardOrgFocusHelpWhat',
                guide: 'InitiativeWizardOrgFocusHelpGuide',
            },
        },
    },
    ourVision: {
        title: 'InitiativeViewVisionHeading',
        baseUrl: 'our-vision',
        url(initiativeId) {
            return `/wizard/${initiativeId}/our-vision`;
        },
        labels: {
            form: {
                title: 'InitiativeWizardVisionHeading',
                preamble: 'InitiativeWizardVisionSubheading',
            },
            help: {
                why: 'InitiativeWizardVisionHelpWhy',
                what: 'InitiativeWizardVisionHelpWhat',
                guide: 'InitiativeWizardVisionHelpGuide',
            },
        },
    },
    reasonsForThisSolve: {
        title: 'InitiativeViewReasonsHeading',
        baseUrl: 'reasons-for-this-solve',
        url(initiativeId) {
            return `/wizard/${initiativeId}/reasons-for-this-solve`;
        },
        labels: {
            form: {
                title: 'InitiativeWizardReasonsHeading',
                preamble: 'InitiativeWizardReasonsSubheading',
            },
            help: {
                why: 'InitiativeWizardReasonsHelpWhy',
                what: 'InitiativeWizardReasonsHelpWhat',
                guide: 'InitiativeWizardReasonsHelpGuide',
            },
        },
    },
    goals: {
        baseUrl: 'goals',
        url(initiativeId) {
            return `/wizard/${initiativeId}/goals`;
        },
        title: 'InitiativeViewGoalsHeading',
        titleNNF: 'ReportViewHeadingFunderObjectives', // Show different title to NNF
        labels: {
            form: {
                title: 'InitiativeWizardGoalsHeading',
                preamble: 'InitiativeWizardGoalsSubheading',
            },
            help: {
                why: 'InitiativeWizardGoalsHelpWhy',
                what: 'InitiativeWizardGoalsHelpWhat',
                guide: 'InitiativeWizardGoalsHelpGuide',
            },
        },
    },
    activities: {
        baseUrl: 'activities',
        url(initiativeId) {
            return `/wizard/${initiativeId}/activities`;
        },
        title: 'InitiativeViewActivitiesHeading',
        labels: {
            form: {
                title: 'InitiativeWizardActivitiesHeading',
                preamble: 'InitiativeWizardActivitiesSubheading',
            },
            help: {
                why: 'InitiativeWizardActivitiesHelpWhy',
                what: 'InitiativeWizardActivitiesHelpWhat',
                guide: 'InitiativeWizardActivitiesHelpGuide',
            },
        },
    },
    indicators: {
        baseUrl: 'indicators',
        url(initiativeId) {
            return `/wizard/${initiativeId}/indicators`;
        },
        title: 'InitiativeViewIndicatorsHeading',
        labels: {
            form: {
                title: 'InitiativeWizardIndicatorsHeading',
                preamble: 'InitiativeWizardIndicatorsSubheading',
            },
            help: {
                why: 'InitiativeWizardIndicatorsHelpWhy',
                what: 'InitiativeWizardIndicatorsHelpWhat',
                guide: 'InitiativeWizardIndicatorsHelpGuide',
            },
        },
    },
    sharingResults: {
        baseUrl: 'sharing-results',
        url(initiativeId) {
            return `/wizard/${initiativeId}/sharing-results`;
        },
        title: 'InitiativeViewSharingResultsHeading',
        labels: {
            form: {
                title: 'InitiativeWizardSharingHeading',
                preamble: 'InitiativeWizardSharingSubheading',
            },
            help: {
                why: 'InitiativeWizardSharingHelpWhy',
                what: 'InitiativeWizardSharingHelpWhat',
                guide: 'InitiativeWizardSharingHelpGuide',
            },
        },
    },
    targets: {
        title: 'InitiativeViewTargetsHeading',
        baseUrl: 'targets',
        url(initiativeId) {
            return `/wizard/${initiativeId}/targets`;
        },
        labels: {
            form: {
                title: 'InitiativeWizardTargetsHeading',
                preamble: 'InitiativeWizardTargetsSubheading',
            },
            help: {
                why: 'InitiativeWizardTargetsHelpWhy',
                what: 'InitiativeWizardTargetsHelpWhat',
                guide: 'InitiativeWizardTargetsHelpGuide',
            },
        },
    },
    progressSoFar: {
        title: 'InitiativeViewProgressHeading',
        baseUrl: 'progress-so-far',
        url(initiativeId) {
            return `/wizard/${initiativeId}/progress-so-far`;
        },
        labels: {
            form: {
                title: 'InitiativeWizardProgressHeading',
                preamble: 'InitiativeWizardProgressSubheading',
            },
            help: {
                why: 'InitiativeWizardProgressHelpWhy',
                what: 'InitiativeWizardProgressHelpWhat',
                guide: 'InitiativeWizardProgressHelpGuide',
            },
        },
    },
    logbookEntry: {
        title: 'InitiativeViewLogEntryHeading',
        baseUrl: 'logbook-entry',
        url(initiativeId) {
            return `/wizard/${initiativeId}/logbook-entry`;
        },
        labels: {
            form: {
                title: 'InitiativeWizardLogEntryHeading',
                preamble: 'InitiativeWizardLogEntrySubheading',
            },
            help: {
                why: 'InitiativeWizardLogEntryHelpWhy',
                what: 'InitiativeWizardLogEntryHelpWhat',
                guide: 'InitiativeWizardLogEntryHelpGuide',
            },
        },
    },
    reportSchedule: {
        title: 'InitiativeViewReportsScheduleHeading',
        labels: {
            form: {
                title: 'InitiativeWizardReportsScheduleHeading',
                preamble: 'InitiativeWizardReportsScheduleSubheading',
            },
            help: {
                why: 'InitiativeWizardReportScheduleHelpWhy',
                what: 'InitiativeWizardReportScheduleHelpWhat',
                guide: 'InitiativeWizardReportScheduleHelpGuide',
            },
        },
        baseUrl: 'report-schedule',
        url(initiativeId) {
            return `/wizard/${initiativeId}/report-schedule`;
        },
    },
};

export { initiativeWizardDictionary };
