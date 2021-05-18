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
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/report-details',
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
                title: 'Report Summary',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
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
                title: 'Progress so far',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/progress-so-far',
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
        title: 'Key results',
        visible: true,
        items: [
            {
                title: 'Influence on policy',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/influence-on-policy',
            },
            {
                title: 'Evaluations',
                labels: {
                    form: {
                        title: '',
                        preamble: '',
                    },
                    help: { title: '', why: '', what: '', guide: '' },
                },
                url: '/wizard/evaluations',
            },
        ],
    },
    {
        title: 'Done',
        visible: false,
        url: '/',
    },
];

export { reportItems };
