import create from 'zustand';

const useWizardLayoutStore = create(set => ({
    // Right menu
    rightMenuActive: true,
    toggleRightMenu: toggle =>
        set(() => ({
            rightMenuActive: toggle,
        })),

    // Left menu
    leftMenuActive: true,
    toggleLeftMenu: toggle =>
        set(() => ({
            leftMenuActive: toggle,
        })),
}));

export { useWizardLayoutStore };
