import create from 'zustand';
import produce from 'immer';

const useWizardNavigationStore = create(set => ({
    // Update nested state values
    // https://morioh.com/p/a687e3129a67
    set: fn => set(produce(fn)),
    onSetCollapsed: (topLevelIndex, value) =>
        set(state => {
            state.navItems[topLevelIndex].collapsed = value;
        }),
    onSetInProgess: (topLevelIndex, subLevelIndex, value) =>
        set(state => {
            state.navItems[topLevelIndex].items[
                subLevelIndex
            ].inProgress = value;
        }),
    onSetCompleted: (topLevelIndex, subLevelIndex, value) =>
        set(state => {
            state.navItems[topLevelIndex].items[
                subLevelIndex
            ].completed = value;
        }),

    onGotoNext: () => {
        set(state => {
            // Go to next sub-section
            const currSubId = state.currentSubSectionId;
            const nextSubId = state.currentSubSectionId + 1;
            const subLength = state.navItems[state.currentSectionId].items.length - 1
            // console.log('subId ', state.currentSubSectionId, nextSubId, '    length ', subLength);
            
            if (nextSubId <= subLength) {
                state.currentSubSectionId = nextSubId;

                // Maybe not?
                state.onSetCompleted(state.currentSectionId, currSubId, true) // Previous completed
                state.onSetInProgess(state.currentSectionId, nextSubId, true) // Current in progress
            }
            
            // Go to next section
            if (nextSubId > subLength) {
                const currId = state.currentSectionId;
                const nextId = state.currentSectionId + 1;
                const length = state.navItems.length - 1

                // Reached the end
                if (nextId > length) {
                    state.onSetCompleted(currId, currSubId, true) // Last completed
                    return; 
                }
                
                state.currentSubSectionId = 0;
                state.currentSectionId = nextId;
                
                // Maybe not?
                state.onSetCompleted(currId, currSubId, true) // Previous completed
                state.onSetInProgess(nextId, 0, true) // Set first child nav to inProgress
                state.onSetCollapsed(currId, true) // Fold previous nav
                state.onSetCollapsed(nextId, false) // Open next nav
            }
        });
    },
    onGotoPrevious: () => set(state => {}),
    currentSectionId: 0,
    currentSubSectionId: 0,

    navItems: [
        {
            title: 'Initiative information',
            collapsed: false,
            items: [
                { title: 'Overview 0', inProgress: true, completed: false },
                { title: 'Overview 1', inProgress: false, completed: false },
                { title: 'Overview 2', inProgress: false, completed: false },
                { title: 'Overview 3', inProgress: false, completed: false },
                { title: 'Overview 4', inProgress: false, completed: false },
                { title: 'Overview 5', inProgress: false, completed: false },
                { title: 'Overview 6', inProgress: false, completed: false },
            ],
        },
        {
            title: 'Summary',
            collapsed: true,
            items: [
                {
                    title: 'Overall performance',
                    inProgress: false,
                    completed: false,
                },
                {
                    title: 'Challenges and learnings',
                    inProgress: false,
                    completed: false,
                },
            ],
        },
        {
            title: 'Key changes',
            collapsed: true,
            items: [
                { title: 'Funding', inProgress: false, completed: false },
                {
                    title: 'Project members',
                    inProgress: false,
                    completed: false,
                },
                { title: 'Collaborators', inProgress: false, completed: false },
            ],
        },
        {
            title: 'Key results',
            collapsed: true,
            items: [
                { title: 'Activities', inProgress: false, completed: false },
                {
                    title: 'Sharing of results',
                    inProgress: false,
                    completed: false,
                },
                {
                    title: 'Evaluations',
                    inProgress: false,
                    completed: false,
                },
                {
                    title: 'Influence on policy',
                    inProgress: false,
                    completed: false,
                },
            ],
        },
    ],
}));

export { useWizardNavigationStore };
