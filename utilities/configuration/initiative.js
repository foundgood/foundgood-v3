const d = {
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
    complete: {
        title: 'Complete',
        visible: false,
        hideBack: true,
        hideExit: true,
        baseUrl: 'complete',
        url(initiativeId) {
            return `/initiative/${initiativeId}/complete`;
        },
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
            return `/initiative/${initiativeId}/overview`;
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
        permissions: {
            add: [
                'funder.admin',
                'funder.collaborator',
                'grantee.admin',
                'grantee.collaborator',
                'super',
            ],
            update: [
                'funder.admin',
                'funder.collaborator',
                'grantee.admin',
                'grantee.collaborator',
                'super',
            ],
            delete: [
                'funder.admin',
                'funder.collaborator',
                'grantee.admin',
                'grantee.collaborator',
                'super',
            ],
        },
    },

    funders: {
        baseUrl: 'funders',
        url(initiativeId) {
            return `/initiative/${initiativeId}/funders`;
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
        permissions: {
            add: [
                'funder.admin',
                'funder.collaborator',
                'grantee.admin',
                'grantee.collaborator',
                'super',
            ],
            update: [
                'funder.admin',
                'funder.collaborator',
                'grantee.admin',
                'grantee.collaborator',
                'super',
            ],
            delete: [
                'funder.admin',
                'funder.collaborator',
                'grantee.admin',
                'grantee.collaborator',
                'super',
            ],
        },
    },
    applicants: {
        baseUrl: 'applicants',
        url(initiativeId) {
            return `/initiative/${initiativeId}/applicants`;
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
        permissions: {
            add: [
                'funder.admin',
                'funder.collaborator',
                'grantee.admin',
                'grantee.collaborator',
                'super',
            ],
            update: ['super'],
            delete: ['super'],
        },
    },
    collaborators: {
        baseUrl: 'collaborators',
        url(initiativeId) {
            return `/initiative/${initiativeId}/collaborators`;
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
        permissions: {
            add: [
                'funder.admin',
                'funder.collaborator',
                'grantee.admin',
                'grantee.collaborator',
                'super',
            ],
            update: ['super'],
            delete: ['super'],
        },
    },
    employeesFunded: {
        baseUrl: 'employees-funded',
        url(initiativeId) {
            return `/initiative/${initiativeId}/employees-funded`;
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    problemsToBeSolved: {
        title: 'InitiativeViewProblemsHeading',
        baseUrl: 'problems-to-be-solved',
        url(initiativeId) {
            return `/initiative/${initiativeId}/problems-to-be-solved`;
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
            return `/initiative/${initiativeId}/causes-of-the-problem`;
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
            return `/initiative/${initiativeId}/organisational-focus`;
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
            return `/initiative/${initiativeId}/our-vision`;
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
            return `/initiative/${initiativeId}/reasons-for-this-solve`;
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
            return `/initiative/${initiativeId}/goals`;
        },
        title: 'InitiativeViewGoalsHeading',
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    activities: {
        baseUrl: 'activities',
        url(initiativeId) {
            return `/initiative/${initiativeId}/activities`;
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    indicators: {
        baseUrl: 'indicators',
        url(initiativeId) {
            return `/initiative/${initiativeId}/indicators`;
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    sharingResults: {
        baseUrl: 'sharing-results',
        url(initiativeId) {
            return `/initiative/${initiativeId}/sharing-results`;
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    targets: {
        title: 'InitiativeViewTargetsHeading',
        baseUrl: 'targets',
        url(initiativeId) {
            return `/initiative/${initiativeId}/targets`;
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
            return `/initiative/${initiativeId}/progress-so-far`;
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
            return `/initiative/${initiativeId}/logbook-entry`;
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
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
            return `/initiative/${initiativeId}/report-schedule`;
        },
        permissions: {
            add: ['funder.admin', 'funder.collaborator', 'super'],
            update: ['funder.admin', 'funder.collaborator', 'super'],
            delete: ['super'],
        },
    },
};

const initiativeStructures = {
    Reporting: [
        {
            ...d.context,
            items: [
                d.overview,
                d.funders,
                d.applicants,
                d.collaborators,
                d.employeesFunded,
            ],
        },
        {
            ...d.activitiesParent,
            items: [d.goals, d.activities, d.indicators],
        },
        {
            ...d.developments,
            items: [d.sharingResults],
        },
        { ...d.logbook, items: [d.logbookEntry] },
        { ...d.reports, items: [d.reportSchedule] },
        d.complete,
        d.done,
    ],
};

export default initiativeStructures;
export { d };
