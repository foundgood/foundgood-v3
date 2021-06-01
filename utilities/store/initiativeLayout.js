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

    // Navigation object
    navigation: [
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
                // { slug: 'logbook', label: 'custom.FA_MenuLogbook' },
            ],
        },
        { slug: 'reports', label: 'custom.FA_TabReports' },
    ],
}));

export { useInitiativeLayoutStore };
