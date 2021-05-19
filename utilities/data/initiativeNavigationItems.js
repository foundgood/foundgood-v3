const initiativeItems = () => [
    {
        title: 'Introduction',
        url: '/wizard/introduction',
        visible: false,
        hideBack: true,
    },
    {
        title: 'Information capture',
        url: '/wizard/information-capture',
        visible: false,
        hideBack: true,
    },
    {
        title: 'Projects details',
        visible: true,
        items: [
            {
                title: 'Overview',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/overview',
            },
            {
                title: 'Funders',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/funders',
            },
            {
                title: 'Applicants',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/applicants',
            },
            {
                title: 'Collaborators',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/collaborators',
            },
            {
                title: 'Employees funded',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/employees-funded',
            },
        ],
    },
    {
        title: 'Activities',
        visible: true,
        items: [
            {
                title: 'Goals',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/goals',
            },
            {
                title: 'Activities',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/activities',
            },
            {
                title: 'Indicators',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/indicators',
            },
            {
                title: 'Sharing results',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/sharing-results',
            },
        ],
    },
    {
        title: 'Progress',
        visible: true,
        items: [
            {
                title: 'Progress so far',
                url: '/wizard/progress-so-far',
            },
            // {
            //     title: 'Evaluations',
            //     url: '/wizard/evaluations',
            // },
            // {
            //     title: 'Influence on policy',
            //     url: '/wizard/influence-on-policy',
            // },
        ],
    },
    // {
    //     title: 'Logbook',
    //     visible: true,
    //     items: [
    //         {
    //             title: 'Logbook entry',
    //             url: '/wizard/logbook-entry',
    //         },
    //     ],
    // },
    {
        title: 'Reports',
        visible: true,
        items: [
            {
                title: 'Report schedule',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/report-schedule',
            },
        ],
    },
    {
        title: 'Done',
        visible: false,
        url: '/',
    },
];

const initiativeDetailingItems = () => [
    // {
    //     title: 'Background',
    //     visible: true,
    //     items: [
    //         {
    //             title: 'Problems to be solved',
    //             url: '/wizard/problems-to-be-solved',
    //         },
    //         {
    //             title: 'Causes of the problem',
    //             url: '/wizard/causes-of-the-problem',
    //         },
    //         {
    //             title: 'Organisational focus',
    //             url: '/wizard/organisational-focus',
    //         },
    //         {
    //             title: 'Our vision',
    //             url: '/wizard/our-vision',
    //         },
    //         {
    //             title: 'Reasons for this solve',
    //             url: '/wizard/reasons-for-this-solve',
    //         },
    //     ],
    // },
];

const initiativePlanningItems = () => [
    // {
    //     title: 'Targets',
    //     url: '/wizard/targets',
    // },
    // {
    //     title: 'Outcomes',
    //     url: '/wizard/outcomes',
    // },
];

export { initiativeItems, initiativeDetailingItems, initiativePlanningItems };
