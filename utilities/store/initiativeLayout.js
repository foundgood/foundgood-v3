import create from 'zustand';

function labelTodo(label) {
    return label;
}

const useInitiativeLayoutStore = create(set => ({
    // Mobile menu toggle
    mobileMenuActive: false,
    toggleMobileMenu: toggle =>
        set(() => ({
            mobileMenuActive: toggle,
        })),

    // TODO - Remove! Update mobile version first...
    // Navigation object
    navigation: [
        { href: '/initiative/overview', label: labelTodo('Overview') },
        { href: '/initiative/activities', label: labelTodo('Activities') },
        { href: '/initiative/developments', label: labelTodo('Developments') },
        { href: '/initiative/logbook', label: labelTodo('Logbook') },
        { href: '/initiative/reports', label: labelTodo('Reports') },
    ],

    newNavigation: [
        { slug: 'overview', label: 'custom.FA_MenuContext' },
        {
            label: 'custom.FA_MenuInitiativeDetails',
            subItems: [
                {
                    slug: 'activities',
                    label: 'custom.FA_MenuActivities',
                },
                {
                    slug: 'developments',
                    label: 'custom.FA_MenuDevelopments',
                },
                { slug: 'logbook', label: 'custom.FA_MenuLogbook' },
            ],
        },
        { slug: 'reports', label: 'custom.FA_MenuReports' },
    ],
}));

export { useInitiativeLayoutStore };
