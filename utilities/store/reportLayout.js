import create from 'zustand';

const useReportLayoutStore = create(set => ({
    // Left menu
    leftMenuActive: true,
    toggleLeftMenu: toggle =>
        set(() => ({
            leftMenuActive: toggle,
        })),
}));

export { useReportLayoutStore };
