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
    onGotoNext: () =>
        set(state => {
            state.onGoto(1);
        }),
    onGotoPrevious: () => {},
    onGoto: num => {
        set(state => {
            const currSubId = state.currentSubSectionId;
            const nextSubId = state.currentSubSectionId + num;
            const subLength =
                state.navItems[state.currentSectionId].items.length - num;

            // Go to next sub-section
            if (nextSubId <= subLength) {
                state.currentSubSectionId = nextSubId;

                // Maybe not?
                state.onSetCompleted(state.currentSectionId, currSubId, true); // Previous completed
                state.onSetInProgess(state.currentSectionId, nextSubId, true); // Current in progress
            }

            // Go to next section
            if (nextSubId > subLength) {
                const currId = state.currentSectionId;
                const nextId = state.currentSectionId + num;
                const length = state.navItems.length - num;

                // Reached the end
                if (nextId > length) {
                    // Maybe not?
                    state.onSetCompleted(currId, currSubId, true); // Last completed
                    return;
                }

                state.currentSubSectionId = 0;
                state.currentSectionId = nextId;

                // Maybe not?
                state.onSetCompleted(currId, currSubId, true); // Previous item completed?
                state.onSetInProgess(nextId, 0, true); // Set first item to 'inProgress'
                state.onSetCollapsed(currId, true); // Collapse previous nav
                state.onSetCollapsed(nextId, false); // Expand next nav
            }
        });
    },
    currentSectionId: 0,
    currentSubSectionId: 0,

    navItems: [
        {
            title: 'Initiative information',
            collapsed: false,
            items: [{ title: 'Overview', inProgress: true, completed: false }],
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
