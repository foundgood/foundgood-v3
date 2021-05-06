const reportingItems = () => [
    {
        title: 'Introduction',
        url: '/wizard/initiative/introduction',
        collapsed: true,
        visible: false,
        hideBack: true,
    },
    {
        title: 'Information capture',
        url: '/wizard/initiative/information-capture',
        collapsed: true,
        visible: false,
        hideBack: true,
    },
    {
        title: 'Projects details',
        collapsed: true,
        visible: true,
        items: [
            {
                title: 'Overview',
                url: '/wizard/initiative/overview',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Funders',
                url: '/wizard/initiative/funders',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Applicants',
                url: '/wizard/initiative/applicants',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Collaborators',
                url: '/wizard/initiative/collaborators',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Employees funded',
                url: '/wizard/initiative/employees-funded',
                inProgress: false,
                completed: false,
            },
        ],
    },
    {
        title: 'Activities',
        collapsed: true,
        visible: true,
        items: [
            {
                title: 'Goals',
                url: '/wizard/initiative/goals',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Activities',
                url: '/wizard/initiative/activities',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Indicators',
                url: '/wizard/initiative/indicators',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Sharing results',
                url: '/wizard/initiative/sharing-results',
                inProgress: false,
                completed: false,
            },
        ],
    },
    {
        title: 'Progress',
        collapsed: true,
        visible: true,
        items: [
            {
                title: 'Progress so far',
                url: '/wizard/initiative/progress-so-far',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Evaluations',
                url: '/wizard/initiative/evaluations',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Influence on policy',
                url: '/wizard/initiative/influence-on-policy',
                inProgress: false,
                completed: false,
            },
        ],
    },
    {
        title: 'Logbook',
        collapsed: true,
        visible: true,
        items: [
            {
                title: 'Logbook entry',
                url: '/wizard/initiative/logbook-entry',
                inProgress: false,
                completed: false,
            },
        ],
    },
    {
        title: 'Reports',
        collapsed: true,
        visible: true,
        items: [
            {
                title: 'Report schedule',
                url: '/wizard/initiative/report-schedule',
                inProgress: false,
                completed: false,
            },
        ],
    },
];

const detailingItems = () => [
    {
        title: 'Background',
        collapsed: true,
        visible: true,
        items: [
            {
                title: 'Causes of the problem',
                url: '/wizard/initiative/causes-of-the-problem',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Our vision',
                url: '/wizard/initiative/our-vision',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Organisational focus',
                url: '/wizard/initiative/organisational-focus',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Problems to be solved',
                url: '/wizard/initiative/problems-to-be-solved',
                inProgress: false,
                completed: false,
            },
            {
                title: 'Reasons for this solve',
                url: '/wizard/initiative/reasons-for-this-solve',
                inProgress: false,
                completed: false,
            },
        ],
    },
];

const planningItems = () => [
    {
        title: 'Targets',
        url: '/wizard/initiative/targets',
        inProgress: false,
        completed: false,
    },
    {
        title: 'Outcomes',
        url: '/wizard/initiative/outcomes',
        inProgress: false,
        completed: false,
    },
];

export { reportingItems, detailingItems, planningItems };
