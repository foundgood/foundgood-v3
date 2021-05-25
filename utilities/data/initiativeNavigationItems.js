const initiativeItems = () => [
    {
        title: 'Introduction',
        baseUrl: 'introduction',
        visible: false,
        hideBack: true,
    },
    {
        title: 'Information capture',
        baseUrl: 'information-capture',
        url(initiativeId) {
            return `/wizard/${initiativeId}/information-capture`;
        },
        visible: false,
        hideBack: true,
    },
    {
        title: 'custom.FA_MenuContext',
        visible: true,
        items: [
            {
                baseUrl: 'overview',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/overview`;
                },
                title: 'custom.FA_InitiativeViewOverviewHeading',
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardOverviewHeading',
                        preamble:
                            'custom.FA_InitiativeWizardOverviewSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardOverviewHelpWhy',
                        what: 'custom.FA_InitiativeWizardOverviewHelpWhat',
                        guide: 'custom.FA_InitiativeWizardOverviewHelpGuide',
                    },
                },
            },
            {
                baseUrl: 'funders',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/funders`;
                },
                title: 'custom.FA_InitiativeViewFundersGrantsHeading',
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardFundersHeading',
                        preamble: 'custom.FA_InitiativeWizardFundersSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardFundersHelpWhy',
                        what: 'custom.FA_InitiativeWizardFundersHelpWhat',
                        guide: 'custom.FA_InitiativeWizardFundersHelpGuide',
                    },
                },
            },
            {
                baseUrl: 'applicants',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/applicants`;
                },
                title: 'custom.FA_InitiativeViewApplicantsHeading',
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardApplicantsHeading',
                        preamble:
                            'custom.FA_InitiativeWizardApplicantsSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardApplicantsHelpWhy',
                        what: 'custom.FA_InitiativeWizardApplicantsHelpWhat',
                        guide: 'custom.FA_InitiativeWizardApplicantsHelpGuide',
                    },
                },
            },
            {
                baseUrl: 'collaborators',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/collaborators`;
                },
                title: 'custom.FA_InitiativeViewCollaboratorsHeading',
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardCollaboratorsHeading',
                        preamble:
                            'custom.FA_InitiativeWizardCollaboratorsSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardCollaboratorsHelpWhy',
                        what: 'custom.FA_InitiativeWizardCollaboratorsHelpWhat',
                        guide:
                            'custom.FA_InitiativeWizardCollaboratorsHelpGuide',
                    },
                },
            },
            {
                baseUrl: 'employees-funded',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/employees-funded`;
                },
                title: 'custom.FA_InitiativeViewEmployeesFundedHeading',
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardEmployeesHeading',
                        preamble:
                            'custom.FA_InitiativeWizardEmployeesSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardEmployeesHelpWhy',
                        what: 'custom.FA_InitiativeWizardEmployeesHelpWhat',
                        guide: 'custom.FA_InitiativeWizardEmployeesHelpGuide',
                    },
                },
            },
        ],
    },
    {
        title: 'custom.FA_MenuActivities',
        visible: true,
        items: [
            {
                baseUrl: 'goals',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/goals`;
                },
                title: 'custom.FA_InitiativeViewGoalsHeading',
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardGoalsHeading',
                        preamble: 'custom.FA_InitiativeWizardGoalsSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardGoalsHelpWhy',
                        what: 'custom.FA_InitiativeWizardGoalsHelpWhat',
                        guide: 'custom.FA_InitiativeWizardGoalsHelpGuide',
                    },
                },
            },
            {
                baseUrl: 'activities',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/activities`;
                },
                title: 'custom.FA_InitiativeViewActivitiesHeading',
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardActivitiesHeading',
                        preamble:
                            'custom.FA_InitiativeWizardActivitiesSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardActivitiesHelpWhy',
                        what: 'custom.FA_InitiativeWizardActivitiesHelpWhat',
                        guide: 'custom.FA_InitiativeWizardActivitiesHelpGuide',
                    },
                },
            },
            {
                baseUrl: 'indicators',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/indicators`;
                },
                title: 'custom.FA_InitiativeViewIndicatorsHeading',
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardIndicatorsHeading',
                        preamble:
                            'custom.FA_InitiativeWizardIndicatorsSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardIndicatorsHelpWhy',
                        what: 'custom.FA_InitiativeWizardIndicatorsHelpWhat',
                        guide: 'custom.FA_InitiativeWizardIndicatorsHelpGuide',
                    },
                },
            },
            {
                baseUrl: 'sharing-results',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/sharing-results`;
                },
                title: 'custom.FA_InitiativeViewSharingResultsHeading',
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardSharingHeading',
                        preamble: 'custom.FA_InitiativeWizardSharingSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardSharingHelpWhy',
                        what: 'custom.FA_InitiativeWizardSharingHelpWhat',
                        guide: 'custom.FA_InitiativeWizardSharingHelpGuide',
                    },
                },
            },
        ],
    },
    {
        title: 'custom.FA_MenuDevelopments',
        visible: true,
        items: [
            {
                title: 'custom.FA_InitiativeViewProgressHeading',
                baseUrl: 'progress-so-far',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/progress-so-far`;
                },
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardProgressHeading',
                        preamble:
                            'custom.FA_InitiativeWizardProgressSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardProgressHelpWhy',
                        what: 'custom.FA_InitiativeWizardProgressHelpWhat',
                        guide: 'custom.FA_InitiativeWizardProgressHelpGuide',
                    },
                },
            },
            // {
            //     title: 'custom.FA_InitiativeViewEvaluationsHeading',
            //     baseUrl: 'evaluations',
            // url(initiativeId) {return `/wizard/${initiativeId}/evaluations`},
            //     labels: {
            //         form: {
            //             title: 'custom.FA_InitiativeWizardEvaluationsHeading',
            //             preamble: 'custom.FA_InitiativeWizardEvaluationsSubheading',
            //         },
            //         help: { why: 'custom.FA_InitiativeWizardEvaluationsHelpWhy', what: 'custom.FA_InitiativeWizardEvaluationsHelpWhat', guide: 'custom.FA_InitiativeWizardEvaluationsHelpGuide' },
            //     },
            // },
            // {
            //     title: 'custom.FA_InitiativeViewInfluenceHeading',
            //     baseUrl: 'influence-on-policy',
            // url(initiativeId) {return `/wizard/${initiativeId}/influence-on-policy`},
            //     labels: {
            //         form: {
            //             title: 'custom.FA_InitiativeWizardInfluenceHeading',
            //             preamble: 'custom.FA_InitiativeWizardInfluenceSubheading',
            //         },
            //         help: { why: 'custom.FA_InitiativeWizardInfluenceHelpWhy', what: 'custom.FA_InitiativeWizardInfluenceHelpWhat', guide: 'custom.FA_InitiativeWizardInfluenceHelpGuide' },
            //     },
            // },
        ],
    },
    // {
    //     title: 'custom.FA_MenuLogbook',
    //     visible: true,
    //     items: [
    //         {
    //             title: 'custom.FA_InitiativeViewLogEntryHeading',
    //             baseUrl: 'logbook-entry',
    // url(initiativeId) {return `/wizard/${initiativeId}/logbook-entry`},
    //             labels: {
    //                 form: {
    //                     title: 'custom.FA_InitiativeWizardLogEntryHeading',
    //                     preamble: 'custom.FA_InitiativeWizardLogEntrySubheading',
    //                 },
    //                 help: { why: 'custom.FA_InitiativeWizardLogEntryHelpWhy', what: 'custom.FA_InitiativeWizardLogEntryHelpWhat', guide: 'custom.FA_InitiativeWizardLogEntryHelpGuide' },
    //             },
    //         },
    //     ],
    // },
    {
        title: 'custom.FA_MenuReports',
        visible: true,
        items: [
            {
                title: 'custom.FA_InitiativeViewReportsScheduleHeading',
                labels: {
                    form: {
                        title:
                            'custom.FA_InitiativeWizardReportsScheduleHeading',
                        preamble:
                            'FA_InitiativeWizardReportsScheduleSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardReportsScheduleHelpWhy',
                        what:
                            'custom.FA_InitiativeWizardReportsScheduleHelpWhat',
                        guide:
                            'custom.FA_InitiativeWizardReportsScheduleHelpGuide',
                    },
                },
                baseUrl: 'report-schedule',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/report-schedule`;
                },
            },
        ],
    },
    {
        title: 'Done',
        visible: false,
        baseUrl: '',
        url(initiativeId) {
            return `/${initiativeId}/overview`;
        },
    },
];

const initiativeDetailingItems = () => [
    {
        title: 'custom.FA_MenuInitiativeDetails',
        visible: true,
        items: [
            {
                title: 'custom.FA_InitiativeViewProblemsHeading',
                baseUrl: 'problems-to-be-solved',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/problems-to-be-solved`;
                },
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardProblemsHeading',
                        preamble:
                            'custom.FA_InitiativeWizardProblemsSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardProblemsHelpWhy',
                        what: 'custom.FA_InitiativeWizardProblemsHelpWhat',
                        guide: 'custom.FA_InitiativeWizardProblemsHelpGuide',
                    },
                },
            },
            {
                title: 'custom.FA_InitiativeViewCausesHeading',
                baseUrl: 'causes-of-the-problem',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/causes-of-the-problem`;
                },
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardCausesHeading',
                        preamble: 'custom.FA_InitiativeWizardCausesSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardCausesHelpWhy',
                        what: 'custom.FA_InitiativeWizardCausesHelpWhat',
                        guide: 'custom.FA_InitiativeWizardCausesHelpGuide',
                    },
                },
            },
            {
                title: 'custom.FA_InitiativeViewOrgFocusHeading',
                baseUrl: 'organisational-focus',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/organisational-focus`;
                },
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardOrgFocusHeading',
                        preamble:
                            'custom.FA_InitiativeWizardOrgFocusSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardOrgFocusHelpWhy',
                        what: 'custom.FA_InitiativeWizardOrgFocusHelpWhat',
                        guide: 'custom.FA_InitiativeWizardOrgFocusHelpGuide',
                    },
                },
            },
            {
                title: 'custom.FA_InitiativeViewVisionHeading',
                baseUrl: 'our-vision',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/our-vision`;
                },
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardVisionHeading',
                        preamble: 'custom.FA_InitiativeWizardVisionSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardVisionHelpWhy',
                        what: 'custom.FA_InitiativeWizardVisionHelpWhat',
                        guide: 'custom.FA_InitiativeWizardVisionHelpGuide',
                    },
                },
            },
            {
                title: 'custom.FA_InitiativeViewReasonsHeading',
                baseUrl: 'reasons-for-this-solve',
                url(initiativeId) {
                    return `/wizard/${initiativeId}/reasons-for-this-solve`;
                },
                labels: {
                    form: {
                        title: 'custom.FA_InitiativeWizardReasonsHeading',
                        preamble: 'custom.FA_InitiativeWizardReasonsSubheading',
                    },
                    help: {
                        why: 'custom.FA_InitiativeWizardReasonsHelpWhy',
                        what: 'custom.FA_InitiativeWizardReasonsHelpWhat',
                        guide: 'custom.FA_InitiativeWizardReasonsHelpGuide',
                    },
                },
            },
        ],
    },
];

const initiativePlanningItems = () => [
    {
        title: 'custom.FA_InitiativeViewTargetsHeading',
        baseUrl: 'targets',
        url(initiativeId) {
            return `/wizard/${initiativeId}/targets`;
        },
        labels: {
            form: {
                title: 'custom.FA_InitiativeWizardTargetsHeading',
                preamble: 'custom.FA_InitiativeWizardTargetsSubheading',
            },
            help: {
                why: 'custom.FA_InitiativeWizardTargetsHelpWhy',
                what: 'custom.FA_InitiativeWizardTargetsHelpWhat',
                guide: 'custom.FA_InitiativeWizardTargetsHelpGuide',
            },
        },
    },
    {
        title: 'custom.FA_InitiativeViewOutcomesHeading',
        baseUrl: 'outcomes',
        url(initiativeId) {
            return `/wizard/${initiativeId}/outcomes`;
        },
        labels: {
            form: {
                title: 'custom.FA_InitiativeWizardOutcomesHeading',
                preamble: 'custom.FA_InitiativeWizardOutcomesSubheading',
            },
            help: {
                why: 'custom.FA_InitiativeWizardOutcomesHelpWhy',
                what: 'custom.FA_InitiativeWizardOutcomesHelpWhat',
                guide: 'custom.FA_InitiativeWizardOutcomesHelpGuide',
            },
        },
    },
];

export { initiativeItems, initiativeDetailingItems, initiativePlanningItems };
