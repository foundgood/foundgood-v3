import create from 'zustand';
import produce from 'immer';

const useReportNavigationStore = create(set => ({
    // Update nested state values
    // https://morioh.com/p/a687e3129a67
    set: fn => set(produce(fn)),

    // Set progress icon - nav item (only one Item can be inProgress)
    onSetInProgess: (index, value) =>
        set(state => {
            // Deselect previous "inProgress" item
            state.navItems.find(item => {
                if (item.inProgress) {
                    item.inProgress = false;
                }
            });

            // Select current "inProgress" item
            state.navItems[index].inProgress = value;
            state.currentSectionId = index;
        }),

    // Set complete icon - nav item
    onSetCompleted: (index, value) =>
        set(state => {
            state.navItems[index].completed = value;
        }),
    // Keep track of current section
    currentSectionId: 0,

    // TODO - Get nav data from SalesForce
    navItems: [
        { title: 'Overview', inProgress: true, completed: false },
        { title: 'Overall performance', inProgress: false, completed: false },
        {
            title: 'Challenges and learnings',
            inProgress: false,
            completed: false,
        },
        { title: 'Funding', inProgress: false, completed: false },
        { title: 'Project members', inProgress: false, completed: false },
        { title: 'Collaborators', inProgress: false, completed: false },
        { title: 'Activities', inProgress: false, completed: false },
        { title: 'Sharing of results', inProgress: false, completed: false },
        { title: 'Evaluations', inProgress: false, completed: false },
        { title: 'Influence on policy', inProgress: false, completed: false },
    ],
}));

export { useReportNavigationStore };
