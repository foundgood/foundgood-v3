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
        { href: '/initiative/project', label: labelTodo('Project details') },
        { href: '/initiative/background', label: labelTodo('Background') },
        { href: '/initiative/activities', label: labelTodo('Activities') },
        { href: '/initiative/logbook', label: labelTodo('Logbook') },
        { href: '/initiative/reports', label: labelTodo('Reports') },
    ],
}));

export { useInitiativeLayoutStore };