const reportItems = () => [
    {
        title: 'Introduction',
        url: '/wizard/introduction',
        visible: false,
        hideBack: true,
    },
    {
        title: 'Initiative information',
        visible: true,
        items: [
            {
                title: 'Report details',
                url: '/wizard/report-details',
            },
            {
                title: 'Funders',
                url: '/wizard/funders',
            },
            {
                title: 'Overview',
                url: '/wizard/overview',
            },
            {
                title: 'Report Summary',
                url: '/wizard/report-summary',
            },
        ],
    },
    {
        title: 'Key changes',
        visible: true,
        items: [
            {
                title: 'Applicants',
                url: '/wizard/applicants',
            },
            {
                title: 'Collaborators',
                url: '/wizard/collaborators',
            },
            {
                title: 'Employees funded',
                url: '/wizard/employees-funded',
            },
            {
                title: 'Goals',
                url: '/wizard/goals',
            },
            {
                title: 'Activities',
                url: '/wizard/activities',
            },
            {
                title: 'Indicators',
                url: '/wizard/indicators',
            },
            {
                title: 'Progress so far',
                url: '/wizard/progress-so-far',
            },
            {
                title: 'Sharing results',
                url: '/wizard/sharing-results',
            },
        ],
    },
    {
        title: 'Key results',
        visible: true,
        items: [
            {
                title: 'Influence on policy',
                url: '/wizard/influence-on-policy',
            },
            {
                title: 'Evaluations',
                url: '/wizard/evaluations',
            },
        ],
    },
];

export { reportItems };
