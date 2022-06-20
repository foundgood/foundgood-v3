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
    activitiesDissemination: {
        baseUrl: 'activities-dissemination',
        url(initiativeId) {
            return `/initiative/${initiativeId}/activities-dissemination`;
        },
        title: 'InitiativeViewActivitiesDisseminationHeading',
        labels: {
            form: {
                title: 'InitiativeWizardActivitiesDisseminationHeading',
                preamble: 'InitiativeWizardActivitiesDisseminationSubheading',
            },
            help: {
                why: 'InitiativeWizardActivitiesDisseminationHelpWhy',
                what: 'InitiativeWizardActivitiesDisseminationHelpWhat',
                guide: 'InitiativeWizardActivitiesDisseminationHelpGuide',
            },
        },
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    activitiesEngagement: {
        baseUrl: 'activities-engagement',
        url(initiativeId) {
            return `/initiative/${initiativeId}/activities-engagement`;
        },
        title: 'InitiativeViewActivitiesEngagementHeading',
        labels: {
            form: {
                title: 'InitiativeWizardActivitiesEngagementHeading',
                preamble: 'InitiativeWizardActivitiesEngagementSubheading',
            },
            help: {
                why: 'InitiativeWizardActivitiesEngagementHelpWhy',
                what: 'InitiativeWizardActivitiesEngagementHelpWhat',
                guide: 'InitiativeWizardActivitiesEngagementHelpGuide',
            },
        },
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    activitiesPhysical: {
        baseUrl: 'activities-physical',
        url(initiativeId) {
            return `/initiative/${initiativeId}/activities-physical`;
        },
        title: 'InitiativeViewActivitiesPhysicalHeading',
        labels: {
            form: {
                title: 'InitiativeWizardActivitiesPhysicalHeading',
                preamble: 'InitiativeWizardActivitiesPhysicalSubheading',
            },
            help: {
                why: 'InitiativeWizardActivitiesPhysicalHelpWhy',
                what: 'InitiativeWizardActivitiesPhysicalHelpWhat',
                guide: 'InitiativeWizardActivitiesPhysicalHelpGuide',
            },
        },
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    activitiesTeamEducation: {
        baseUrl: 'activities-team-education',
        url(initiativeId) {
            return `/initiative/${initiativeId}/activities-team-education`;
        },
        title: 'InitiativeViewActivitiesTeamEducationHeading',
        labels: {
            form: {
                title: 'InitiativeWizardActivitiesTeamEducationHeading',
                preamble: 'InitiativeWizardActivitiesTeamEducationSubheading',
            },
            help: {
                why: 'InitiativeWizardActivitiesTeamEducationHelpWhy',
                what: 'InitiativeWizardActivitiesTeamEducationHelpWhat',
                guide: 'InitiativeWizardActivitiesTeamEducationHelpGuide',
            },
        },
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    activitiesEvaluation: {
        baseUrl: 'activities-evaluation',
        url(initiativeId) {
            return `/initiative/${initiativeId}/activities-evaluation`;
        },
        title: 'InitiativeViewActivitiesEvaluationHeading',
        labels: {
            form: {
                title: 'InitiativeWizardActivitiesEvaluationHeading',
                preamble: 'InitiativeWizardActivitiesEvaluationSubheading',
            },
            help: {
                why: 'InitiativeWizardActivitiesEvaluationHelpWhy',
                what: 'InitiativeWizardActivitiesEvaluationHelpWhat',
                guide: 'InitiativeWizardActivitiesEvaluationHelpGuide',
            },
        },
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    activitiesGeneral: {
        baseUrl: 'activities-general',
        url(initiativeId) {
            return `/initiative/${initiativeId}/activities-general`;
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
            items: [
                d.goals,
                d.activitiesDissemination,
                d.activitiesEngagement,
                d.activitiesPhysical,
                d.activitiesTeamEducation,
                d.activitiesEvaluation,
                d.activitiesGeneral,
                d.indicators,
            ],
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
