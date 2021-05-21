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
        { href: '/initiative/overview', label: labelTodo('Overview') },
        { href: '/initiative/activities', label: labelTodo('Activities') },
        { href: '/initiative/developments', label: labelTodo('Developments') },
        { href: '/initiative/logbook', label: labelTodo('Logbook') },
        { href: '/initiative/reports', label: labelTodo('Reports') },
    ],

    // TODO!
    newNavigation: [
        { slug: 'overview', label: labelTodo('Overview') },
        {
            label: labelTodo('Initiative details'),
            subItems: [
                {
                    slug: 'activities',
                    label: labelTodo('Activities'),
                },
                {
                    slug: 'developments',
                    label: labelTodo('Developments'),
                },
                { slug: 'logbook', label: labelTodo('Logbook') },
            ],
        },
        { slug: 'reports', label: labelTodo('Reports') },
    ],
}));

export { useInitiativeLayoutStore };
