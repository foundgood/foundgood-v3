import create from 'zustand';

const useInitiativeLayoutStore = create(set => ({
    // Mobile menu toggle
    mobileMenuActive: false,
    toggleMobileMenu: toggle =>
        set(() => ({
            mobileMenuActive: toggle,
        })),

    // Navigation object
    navigation: [
        { slug: 'overview', label: 'MenuContext' },
        {
            label: 'MenuInitiativeDetails',
            subItems: [
                {
                    slug: 'activities',
                    label: 'MenuActivities',
                },
                {
                    slug: 'developments',
                    label: 'MenuDevelopments',
                },
                { slug: 'logbook', label: 'MenuLogbook' },
            ],
        },
        { slug: 'reports', label: 'TabReports' },
    ],
}));

export { useInitiativeLayoutStore };
