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
    learnings: {
        title: 'MenuLearnings',
        visible: true,
        items: [],
    },
    // Child items
    introduction: {
        title: 'Introduction',
        baseUrl: 'introduction',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/introduction/${reportId}`;
        },
        visible: false,
        hideBack: true,
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
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
        permissions: {
            add: ['super'],
            update: ['super'],
            delete: ['super'],
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
        permissions: {
            add: ['super'],
            update: ['super'],
            delete: ['super'],
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
    },
    activitiesDissemination: {
        baseUrl: 'activities-dissemination',
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/activities-dissemination/${reportId}`;
        },
        title: 'ReportWizardMenuActivitiesDisseminationHeading',
        labels: {
            form: {
                title: 'ReportWizardActivitiesDisseminationHeading',
                preamble: 'ReportWizardActivitiesDisseminationSubheading',
            },
            help: {
                why: 'ReportWizardActivitiesDisseminationHelpWhy',
                what: 'ReportWizardActivitiesDisseminationHelpWhat',
                guide: 'ReportWizardActivitiesDisseminationHelpGuide',
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
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/activities-engagement/${reportId}`;
        },
        title: 'ReportWizardMenuActivitiesEngagementHeading',
        labels: {
            form: {
                title: 'ReportWizardActivitiesEngagementHeading',
                preamble: 'ReportWizardActivitiesEngagementSubheading',
            },
            help: {
                why: 'ReportWizardActivitiesEngagementHelpWhy',
                what: 'ReportWizardActivitiesEngagementHelpWhat',
                guide: 'ReportWizardActivitiesEngagementHelpGuide',
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
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/activities-physical/${reportId}`;
        },
        title: 'ReportWizardMenuActivitiesPhysicalHeading',
        labels: {
            form: {
                title: 'ReportWizardActivitiesPhysicalHeading',
                preamble: 'ReportWizardActivitiesPhysicalSubheading',
            },
            help: {
                why: 'ReportWizardActivitiesPhysicalHelpWhy',
                what: 'ReportWizardActivitiesPhysicalHelpWhat',
                guide: 'ReportWizardActivitiesPhysicalHelpGuide',
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
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/activities-team-education/${reportId}`;
        },
        title: 'ReportWizardMenuActivitiesTeamEducationHeading',
        labels: {
            form: {
                title: 'ReportWizardActivitiesTeamEducationHeading',
                preamble: 'ReportWizardActivitiesTeamEducationSubheading',
            },
            help: {
                why: 'ReportWizardActivitiesTeamEducationHelpWhy',
                what: 'ReportWizardActivitiesTeamEducationHelpWhat',
                guide: 'ReportWizardActivitiesTeamEducationHelpGuide',
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
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/activities-evaluation/${reportId}`;
        },
        title: 'ReportWizardMenuActivitiesEvaluationHeading',
        labels: {
            form: {
                title: 'ReportWizardActivitiesEvaluationHeading',
                preamble: 'ReportWizardActivitiesEvaluationSubheading',
            },
            help: {
                why: 'ReportWizardActivitiesEvaluationHelpWhy',
                what: 'ReportWizardActivitiesEvaluationHelpWhat',
                guide: 'ReportWizardActivitiesEvaluationHelpGuide',
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
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/activities-general/${reportId}`;
        },
        title: 'ReportWizardMenuActivitiesHeading',
        labels: {
            form: {
                title: 'ReportWizardActivitiesHeading',
                preamble: 'ReportWizardActivitiesSubheading',
            },
            help: {
                why: 'ReportWizardActivitiesHelpWhy',
                what: 'ReportWizardActivitiesHelpWhat',
                guide: 'ReportWizardActivitiesHelpGuide',
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
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/results-knowledge/${reportId}`;
        },
        title: 'ReportWizardMenuResultsKnowledgeHeading',
        labels: {
            form: {
                title: 'ReportWizardResultsKnowledgeHeading',
                preamble: 'ReportWizardResultsKnowledgeSubheading',
            },
            help: {
                why: 'ReportWizardResultsKnowledgeHelpWhy',
                what: 'ReportWizardResultsKnowledgeHelpWhat',
                guide: 'ReportWizardResultsKnowledgeHelpGuide',
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
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/results-research/${reportId}`;
        },
        title: 'ReportWizardMenuResultsResearchHeading',
        labels: {
            form: {
                title: 'ReportWizardResultsResearchHeading',
                preamble: 'ReportWizardResultsResearchSubheading',
            },
            help: {
                why: 'ReportWizardResultsResearchHelpWhy',
                what: 'ReportWizardResultsResearchHelpWhat',
                guide: 'ReportWizardResultsResearchHelpGuide',
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
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/results-influence/${reportId}`;
        },
        title: 'ReportWizardMenuResultsInfluenceHeading',
        labels: {
            form: {
                title: 'ReportWizardResultsInfluenceHeading',
                preamble: 'ReportWizardResultsInfluenceSubheading',
            },
            help: {
                why: 'ReportWizardResultsInfluenceHelpWhy',
                what: 'ReportWizardResultsInfluenceHelpWhat',
                guide: 'ReportWizardResultsInfluenceHelpGuide',
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
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/results-innovation/${reportId}`;
        },
        title: 'ReportWizardMenuResultsInnovationHeading',
        labels: {
            form: {
                title: 'ReportWizardResultsInnovationHeading',
                preamble: 'ReportWizardResultsInnovationSubheading',
            },
            help: {
                why: 'ReportWizardResultsInnovationHelpWhy',
                what: 'ReportWizardResultsInnovationHelpWhat',
                guide: 'ReportWizardResultsInnovationHelpGuide',
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
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/results-output/${reportId}`;
        },
        title: 'ReportWizardMenuResultsOutputHeading',
        labels: {
            form: {
                title: 'ReportWizardResultsOutputHeading',
                preamble: 'ReportWizardResultsOutputSubheading',
            },
            help: {
                why: 'ReportWizardResultsOutputHelpWhy',
                what: 'ReportWizardResultsOutputHelpWhat',
                guide: 'ReportWizardResultsOutputHelpGuide',
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
        url(initiativeId, reportId) {
            return `/report/${initiativeId}/results-outcome/${reportId}`;
        },
        title: 'ReportWizardMenuResultsOutcomeHeading',
        labels: {
            form: {
                title: 'ReportWizardResultsOutcomeHeading',
                preamble: 'ReportWizardResultsOutcomeSubheading',
            },
            help: {
                why: 'ReportWizardResultsOutcomeHelpWhy',
                what: 'ReportWizardResultsOutcomeHelpWhat',
                guide: 'ReportWizardResultsOutcomeHelpGuide',
            },
        },
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
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
        permissions: {
            add: ['grantee.admin', 'grantee.collaborator', 'super'],
            update: ['grantee.admin', 'grantee.collaborator', 'super'],
            delete: ['grantee.admin', 'grantee.collaborator', 'super'],
        },
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
};

const reportStructures = {
    Default: {
        Status: [
            d.introduction,
            {
                ...d.context,
                showChildrenOnly: true,
                items: [
                    d.overview,
                    d.applicants,
                    d.collaborators,
                    d.funders,
                    d.reportSummary,
                ],
            },
            d.complete,
            d.done,
        ],
        Annual: [
            d.introduction,
            {
                ...d.context,
                items: [d.overview],
            },
            {
                ...d.inputs,
                items: [
                    d.applicants,
                    d.collaborators,
                    d.funders,
                    d.employeesFunded,
                ],
            },
            {
                ...d.activitiesParent,
                items: [
                    d.activitiesTeamEducation,
                    d.activitiesDissemination,
                    d.activitiesEngagement,
                    d.activitiesEvaluation,
                    d.activitiesGeneral,
                ],
            },
            {
                ...d.results,
                items: [d.resultsInfluence, d.resultsOutput, d.resultsOutcome],
            },

            {
                ...d.learnings,
                items: [d.reportSummary],
            },
            d.complete,
            d.done,
        ],
        Final: [
            d.introduction,
            {
                ...d.context,
                items: [d.overview],
            },
            {
                ...d.inputs,
                items: [
                    d.applicants,
                    d.collaborators,
                    d.funders,
                    d.employeesFunded,
                ],
            },
            {
                ...d.activitiesParent,
                items: [
                    d.activitiesTeamEducation,
                    d.activitiesDissemination,
                    d.activitiesEngagement,
                    d.activitiesEvaluation,
                    d.activitiesGeneral,
                ],
            },
            {
                ...d.results,
                items: [d.resultsInfluence, d.resultsOutput, d.resultsOutcome],
            },

            {
                ...d.learnings,
                items: [d.reportSummary, d.endOfGrantReflections],
            },
            d.complete,
            d.done,
        ],
    },
    'Research infrastructure': {
        Status: [
            d.introduction,
            {
                ...d.context,
                showChildrenOnly: true,
                items: [
                    d.overview,
                    d.applicants,
                    d.collaborators,
                    d.funders,
                    d.reportSummary,
                ],
            },
            d.complete,
            d.done,
        ],
        Annual: [
            d.introduction,
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
                    // d.regulations // TODO
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

            {
                ...d.learnings,
                items: [d.reportSummary],
            },
            d.complete,
            d.done,
        ],
        Final: [
            d.introduction,
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
                    // d.regulations // TODO
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

            {
                ...d.learnings,
                items: [d.reportSummary, d.endOfGrantReflections],
            },
            d.complete,
            d.done,
        ],
    },
    Innovation: {
        Status: [
            d.introduction,
            {
                ...d.context,
                showChildrenOnly: true,
                items: [
                    d.overview,
                    d.applicants,
                    d.collaborators,
                    d.funders,
                    d.reportSummary,
                ],
            },
            d.complete,
            d.done,
        ],
        Annual: [
            d.introduction,
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
                    // d.regulations // TODO
                ],
            },
            {
                ...d.activitiesParent,
                items: [
                    d.activitiesTeamEducation,
                    d.activitiesDissemination,
                    d.activitiesEngagement,
                    d.activitiesEvaluation,
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

            {
                ...d.learnings,
                items: [d.reportSummary],
            },
            d.complete,
            d.done,
        ],
        Final: [
            d.introduction,
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
                    // d.regulations // TODO
                ],
            },
            {
                ...d.activitiesParent,
                items: [
                    d.activitiesTeamEducation,
                    d.activitiesDissemination,
                    d.activitiesEngagement,
                    d.activitiesEvaluation,
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

            {
                ...d.learnings,
                items: [d.reportSummary, d.endOfGrantReflections],
            },
            d.complete,
            d.done,
        ],
    },
};
export { d };
export default reportStructures;
