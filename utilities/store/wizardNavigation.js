import create from 'zustand';
import produce from 'immer';

const useWizardNavigationStore = create(set => ({
    // Update nested state values
    // https://morioh.com/p/a687e3129a67
    set: fn => set(produce(fn)),

    // Collapse navigation group
    onSetCollapsed: (topLevelIndex, value) =>
        set(state => {
            state.navItems[topLevelIndex].collapsed = value;
        }),
    // Set progress icon - nav item (only one Item can be inProgress)
    onSetInProgess: (topLevelIndex, subLevelIndex, value) =>
        set(state => {
            // Deselect previous "inProgress" item
            state.navItems.find(parentItem => {
                parentItem.items.find(item => {
                    if (item.inProgress) {
                        item.inProgress = false;
                    }
                });
            });

            // Select current "inProgress" item
            state.navItems[topLevelIndex].items[
                subLevelIndex
            ].inProgress = value;

            state.currentSectionId = topLevelIndex;
            state.currentSubSectionId = subLevelIndex;
        }),

    // Set complete icon - nav item
    onSetCompleted: (topLevelIndex, subLevelIndex, value) =>
        set(state => {
            state.navItems[topLevelIndex].items[
                subLevelIndex
            ].completed = value;
        }),

    // Update active section in naviagtion
    onGotoNext: () =>
        set(state => {
            state.onGoto(1);
        }),
    onGotoPrevious: () =>
        set(state => {
            state.onGoto(-1);
        }),

    onGoto: num => {
        set(state => {
            // Keep reference to state variables -
            // Note: using the state direclty can cause unwanted effects (depending on the order, the state will be different)
            const currId = state.currentSectionId;
            const nextSubId = state.currentSubSectionId + num;
            const subLength =
                state.navItems[state.currentSectionId].items.length - num;
            // const currSubId = state.currentSubSectionId;

            // Go to next/previous section
            if (nextSubId > subLength || nextSubId < 0) {
                const nextId = state.currentSectionId + num;
                const length = state.navItems.length - num;

                // Reached the beginning
                if (nextId < 0) {
                    return;
                }
                // Reached the end
                if (nextId > length) {
                    return;
                }

                const subId =
                    nextSubId < 0 ? state.navItems[nextId].items.length - 1 : 0;
                state.currentSubSectionId = subId;
                state.currentSectionId = nextId;

                state.onSetInProgess(nextId, subId, true); // Set first item to 'inProgress'
                state.onSetCollapsed(nextId, false); // Expand next nav
                // state.onSetCompleted(currId, currSubId, true); // Previous item completed
                // state.onSetCollapsed(currId, true); // Collapse previous nav ???
            }

            // Go to next/previous sub-section
            if (nextSubId <= subLength && nextSubId > -1) {
                state.currentSubSectionId = nextSubId;
                state.onSetInProgess(currId, nextSubId, true); // Current in progress
                // state.onSetCompleted(currId, currSubId, true); // Previous completed
            }
        });
    },
    // Keep track of current form section
    currentSectionId: 0,
    currentSubSectionId: 0,

    // TODO - Get nav data from SalesForce
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
