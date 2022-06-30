const d = {
    // Parent items
    context: {
        title: 'MenuContext',
        visible: true,
        items: [],
    },
    inputs: {
        title: 'MenuInputs',
        visible: true,
        items: [],
    },
    activitiesParent: {
        title: 'MenuActivities',
        visible: true,
        items: [],
    },
    results: {
        title: 'MenuResults',
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
    // Child items
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
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
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
    resultsKnowledge: {
        baseUrl: 'results-knowledge',
        url(initiativeId) {
            return `/initiative/${initiativeId}/results-knowledge`;
        },
        title: 'InitiativeViewResultsKnowledgeHeading',
        labels: {
            form: {
                title: 'InitiativeWizardResultsKnowledgeHeading',
                preamble: 'InitiativeWizardResultsKnowledgeSubheading',
            },
            help: {
                why: 'InitiativeWizardResultsKnowledgeHelpWhy',
                what: 'InitiativeWizardResultsKnowledgeHelpWhat',
                guide: 'InitiativeWizardResultsKnowledgeHelpGuide',
            },
        },
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    resultsResearch: {
        baseUrl: 'results-research',
        url(initiativeId) {
            return `/initiative/${initiativeId}/results-research`;
        },
        title: 'InitiativeViewResultsResearchHeading',
        labels: {
            form: {
                title: 'InitiativeWizardResultsResearchHeading',
                preamble: 'InitiativeWizardResultsResearchSubheading',
            },
            help: {
                why: 'InitiativeWizardResultsResearchHelpWhy',
                what: 'InitiativeWizardResultsResearchHelpWhat',
                guide: 'InitiativeWizardResultsResearchHelpGuide',
            },
        },
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    resultsInfluence: {
        baseUrl: 'results-influence',
        url(initiativeId) {
            return `/initiative/${initiativeId}/results-influence`;
        },
        title: 'InitiativeViewResultsInfluenceHeading',
        labels: {
            form: {
                title: 'InitiativeWizardResultsInfluenceHeading',
                preamble: 'InitiativeWizardResultsInfluenceSubheading',
            },
            help: {
                why: 'InitiativeWizardResultsInfluenceHelpWhy',
                what: 'InitiativeWizardResultsInfluenceHelpWhat',
                guide: 'InitiativeWizardResultsInfluenceHelpGuide',
            },
        },
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    resultsInnovation: {
        baseUrl: 'results-innovation',
        url(initiativeId) {
            return `/initiative/${initiativeId}/results-innovation`;
        },
        title: 'InitiativeViewResultsInnovationHeading',
        labels: {
            form: {
                title: 'InitiativeWizardResultsInnovationHeading',
                preamble: 'InitiativeWizardResultsInnovationSubheading',
            },
            help: {
                why: 'InitiativeWizardResultsInnovationHelpWhy',
                what: 'InitiativeWizardResultsInnovationHelpWhat',
                guide: 'InitiativeWizardResultsInnovationHelpGuide',
            },
        },
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    resultsOutput: {
        baseUrl: 'results-output',
        url(initiativeId) {
            return `/initiative/${initiativeId}/results-output`;
        },
        title: 'InitiativeViewResultsOutputHeading',
        labels: {
            form: {
                title: 'InitiativeWizardResultsOutputHeading',
                preamble: 'InitiativeWizardResultsOutputSubheading',
            },
            help: {
                why: 'InitiativeWizardResultsOutputHelpWhy',
                what: 'InitiativeWizardResultsOutputHelpWhat',
                guide: 'InitiativeWizardResultsOutputHelpGuide',
            },
        },
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    resultsOutcome: {
        baseUrl: 'results-outcome',
        url(initiativeId) {
            return `/initiative/${initiativeId}/results-outcome`;
        },
        title: 'InitiativeViewResultsOutcomeHeading',
        labels: {
            form: {
                title: 'InitiativeWizardResultsOutcomeHeading',
                preamble: 'InitiativeWizardResultsOutcomeSubheading',
            },
            help: {
                why: 'InitiativeWizardResultsOutcomeHelpWhy',
                what: 'InitiativeWizardResultsOutcomeHelpWhat',
                guide: 'InitiativeWizardResultsOutcomeHelpGuide',
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
    Default: [
        {
            ...d.context,
            items: [d.overview],
        },
        {
            ...d.inputs,
            items: [
                d.goals,
                d.funders,
                d.applicants,
                d.collaborators,
                d.employeesFunded,
            ],
        },
        {
            ...d.activitiesParent,
            items: [
                d.activitiesDissemination,
                d.activitiesEngagement,
                d.activitiesEvaluation,
                d.activitiesTeamEducation,
                d.activitiesGeneral,
            ],
        },
        {
            ...d.results,
            items: [
                d.resultsInfluence,
                d.resultsInnovation,
                d.resultsOutput,
                d.resultsOutcome,
            ],
        },
        { ...d.logbook, items: [d.logbookEntry] },
        { ...d.reports, items: [d.reportSchedule] },
        d.complete,
        d.done,
    ],
    'Research infrastructure': [
        {
            ...d.context,
            items: [d.overview],
        },
        {
            ...d.inputs,
            items: [
                d.goals,
                d.applicants,
                d.collaborators,
                d.funders,
                d.employeesFunded,
                // d.regulations
            ],
        },
        {
            ...d.activitiesParent,
            items: [
                d.activitiesPhysical,
                d.activitiesEngagement,
                d.activitiesTeamEducation,
                d.activitiesGeneral,
            ],
        },
        {
            ...d.results,
            items: [
                d.resultsResearch,
                d.resultsInfluence,
                d.resultsKnowledge,
                d.resultsInnovation,
                d.resultsOutput,
                d.resultsOutcome,
            ],
        },
        { ...d.logbook, items: [d.logbookEntry] },
        { ...d.reports, items: [d.reportSchedule] },
        d.complete,
        d.done,
    ],
    Innovation: [
        {
            ...d.context,
            items: [d.overview],
        },
        {
            ...d.inputs,
            items: [
                d.goals,
                d.applicants,
                d.collaborators,
                d.funders,
                d.employeesFunded,
            ],
        },
        {
            ...d.activitiesParent,
            items: [
                d.activitiesDissemination,
                d.activitiesEngagement,
                d.activitiesEvaluation,
                d.activitiesTeamEducation,
                d.activitiesGeneral,
            ],
        },
        {
            ...d.results,
            items: [
                d.resultsResearch,
                d.resultsInfluence,
                d.resultsKnowledge,
                d.resultsInnovation,
                d.resultsOutput,
                d.resultsOutcome,
            ],
        },
        { ...d.logbook, items: [d.logbookEntry] },
        { ...d.reports, items: [d.reportSchedule] },
        d.complete,
        d.done,
    ],
};

export default initiativeStructures;
export { d };
