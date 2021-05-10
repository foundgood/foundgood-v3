const reportingItems = () => [
    {
        title: 'Introduction',
        url: '/wizard/initiative/introduction',
        visible: false,
        hideBack: true,
    },
    {
        title: 'Information capture',
        url: '/wizard/initiative/information-capture',
        visible: false,
        hideBack: true,
    },
    {
        title: 'Projects details',
        visible: true,
        items: [
            {
                title: 'Overview',
                url: '/wizard/initiative/overview',
            },
            {
                title: 'Funders',
                url: '/wizard/initiative/funders',
            },
            {
                title: 'Applicants',
                url: '/wizard/initiative/applicants',
            },
            {
                title: 'Collaborators',
                url: '/wizard/initiative/collaborators',
            },
            {
                title: 'Employees funded',
                url: '/wizard/initiative/employees-funded',
            },
        ],
    },
    {
        title: 'Activities',
        visible: true,
        items: [
            {
                title: 'Goals',
                url: '/wizard/initiative/goals',
            },
            {
                title: 'Activities',
                url: '/wizard/initiative/activities',
            },
            {
                title: 'Indicators',
                url: '/wizard/initiative/indicators',
            },
            {
                title: 'Sharing results',
                url: '/wizard/initiative/sharing-results',
            },
        ],
    },
    {
        title: 'Progress',
        visible: true,
        items: [
            {
                title: 'Progress so far',
                url: '/wizard/initiative/progress-so-far',
            },
            // {
            //     title: 'Evaluations',
            //     url: '/wizard/initiative/evaluations',
            // },
            // {
            //     title: 'Influence on policy',
            //     url: '/wizard/initiative/influence-on-policy',
            // },
        ],
    },
    // {
    //     title: 'Logbook',
    //     visible: true,
    //     items: [
    //         {
    //             title: 'Logbook entry',
    //             url: '/wizard/initiative/logbook-entry',
    //         },
    //     ],
    // },
    {
        title: 'Reports',
        visible: true,
        items: [
            {
                title: 'Report schedule',
                url: '/wizard/initiative/report-schedule',
            },
        ],
    },
];

const detailingItems = () => [
    // {
    //     title: 'Background',
    //     visible: true,
    //     items: [
    //         {
    //             title: 'Problems to be solved',
    //             url: '/wizard/initiative/problems-to-be-solved',
    //         },
    //         {
    //             title: 'Causes of the problem',
    //             url: '/wizard/initiative/causes-of-the-problem',
    //         },
    //         {
    //             title: 'Organisational focus',
    //             url: '/wizard/initiative/organisational-focus',
    //         },
    //         {
    //             title: 'Our vision',
    //             url: '/wizard/initiative/our-vision',
    //         },
    //         {
    //             title: 'Reasons for this solve',
    //             url: '/wizard/initiative/reasons-for-this-solve',
    //         },
    //     ],
    // },
];

const planningItems = () => [
    // {
    //     title: 'Targets',
    //     url: '/wizard/initiative/targets',
    // },
    // {
    //     title: 'Outcomes',
    //     url: '/wizard/initiative/outcomes',
    // },
];

export { reportingItems, detailingItems, planningItems };
