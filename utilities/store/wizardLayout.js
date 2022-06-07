import create from 'zustand';

const useWizardLayoutStore = create(set => ({
    // Right menu
    rightMenuActive: false,
    toggleRightMenu: toggle =>
        set(() => ({
            rightMenuActive: toggle,
        })),

    // Left menu
    leftMenuActive: false,
    toggleLeftMenu: toggle =>
        set(() => ({
            leftMenuActive: toggle,
        })),
}));

export { useWizardLayoutStore };
