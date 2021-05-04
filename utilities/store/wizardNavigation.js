import Router from 'next/router';
import create from 'zustand';
import produce from 'immer';

const useWizardNavigationStore = create(set => ({
    // Update nested state values
    // https://morioh.com/p/a687e3129a67
    set: fn => set(produce(fn)),

    // Collapse navigation group
    onSetCollapsed: (topLevelIndex, value) =>
        set(state => {
            state.items[topLevelIndex].collapsed = value;
        }),
    // Set progress icon - nav item (only one Item can be inProgress)
    onSetInProgess: (topLevelIndex, subLevelIndex, value) =>
        set(state => {
            // Deselect previous "inProgress" item
            state.items.find(parentItem => {
                if (parentItem.items) {
                    parentItem.items.find(item => {
                        if (item.inProgress) {
                            item.inProgress = false;
                        }
                    });
                }
            });

            // Select current "inProgress" item
            state.items[topLevelIndex].items[subLevelIndex].inProgress = value;

            state.currentSectionId = topLevelIndex;
            state.currentSubSectionId = subLevelIndex;
        }),

    // Set complete icon - nav item
    onSetCompleted: (topLevelIndex, subLevelIndex, value) =>
        set(state => {
            state.items[topLevelIndex].items[subLevelIndex].completed = value;
        }),

    // Update active section in navigation
    onGotoNext: () => {
        set(state => {
            state.onGoto(1);
        });
    },
    onGotoPrevious: () =>
        set(state => {
            state.onGoto(-1);
        }),

    onGoto: num => {
        set(state => {
            // Keep reference to state variables
            // Note: using the state direclty can cause unwanted effects (depending on the order, the state will be different)

            const currId = state.currentSectionId;
            const nextId = state.currentSectionId + num;
            const nextSubId = state.currentSubSectionId + num;

            // "Introduction" pages are not visible in Navigation
            // Simply to to next step, without "setCollpase" or "setProgress" etc
            if (!state.items[currId].visible) {
                // Make sure we are within bounds
                if (nextId >= 0) {
                    state.currentSubSectionId = nextId;
                    state.currentSectionId = 0;

                    // Update to new URL
                    const url = state.items[nextId].url
                        ? state.items[nextId].url
                        : state.items[nextId].items[0].url;
                    Router.push(url);
                }
                return;
            }

            const subLength =
                state.items[state.currentSectionId].items.length - num;

            // Go to next/previous topLevel section
            if (nextSubId > subLength || nextSubId < 0) {
                // const nextId = state.currentSectionId + num;
                const length = state.items.length - num;

                // Reached the end
                if (nextId > length) {
                    return;
                }
                // Reached the beginning
                if (!state.items[nextId].visible) {
                    return;
                }

                const subId =
                    nextSubId < 0 ? state.items[nextId].items.length - 1 : 0;
                state.currentSubSectionId = subId;
                state.currentSectionId = nextId;

                state.onSetInProgess(nextId, subId, true); // Set first item to 'inProgress'
                state.onSetCollapsed(nextId, false); // Expand next nav
                // state.onSetCompleted(currId, currSubId, true); // Previous item completed
                // state.onSetCollapsed(currId, true); // Collapse previous nav ???

                // Update to new URL
                const url = state.items[nextId].items[subId].url;
                Router.push(url);
            }

            // Go to next/previous sub-section
            if (nextSubId <= subLength && nextSubId > -1) {
                state.currentSubSectionId = nextSubId;
                state.onSetInProgess(currId, nextSubId, true); // Current in progress
                // state.onSetCompleted(currId, currSubId, true); // Previous completed

                // Update to new URL!
                const url = state.items[currId].items[nextSubId].url;
                Router.push(url);
            }
        });
    },

    // Set current section id
    onUrlChanged: path => {
        set(state => {
            state.items.find((parentItem, parentIndex) => {
                if (parentItem.url == path) {
                    state.currentSectionId = parentIndex;
                    state.currentSubSectionId = 0;
                    return;
                }

                if (parentItem.items) {
                    parentItem.items.find((item, index) => {
                        if (item.url == path) {
                            state.currentSectionId = parentIndex;
                            state.currentSubSectionId = index;
                            state.onSetInProgess(parentIndex, index, true); // Set first item to 'inProgress'
                            state.onSetCollapsed(parentIndex, false); // Expand group
                        }
                    });
                }
            });
        });
    },

    // Add "Planning" or "Detailing" sections
    extendWizard: (addPlanning = true, addDetailing = true) => {
        set(state => {
            if (addPlanning) {
                state.items = state.items.concat(state.planningItems);
            }
            if (addDetailing) {
                state.items = state.items.concat(state.detailingItems);
            }

            // console.log('items: ', state.items);
        });
    },

    // Keep track of current form section
    currentSectionId: 0,
    currentSubSectionId: 0,

    // TODO - Get nav data from SalesForce
    items: [
        {
            title: 'introduction',
            url: '/wizard/initiative/introduction',
            collapsed: true,
            visible: false,
        },
        {
            title: 'information-capture',
            url: '/wizard/initiative/information-capture',
            collapsed: true,
            visible: false,
        },
        {
            title: 'Initiative information',
            collapsed: true,
            visible: true,
            items: [
                {
                    title: 'Overview',
                    url: '/wizard/initiative/overview',
                    inProgress: false,
                    completed: false,
                },
            ],
        },
        {
            title: 'Summary',
            collapsed: true,
            visible: true,
            items: [
                {
                    title: 'Overall performance',
                    url: '/wizard/initiative/overall-perfomance',
                    inProgress: false,
                    completed: false,
                },
                {
                    title: 'Challenges and learnings',
                    url: '/wizard/initiative/challenges-and-learnings',
                    inProgress: false,
                    completed: false,
                },
            ],
        },
        {
            title: 'Key changes',
            collapsed: true,
            visible: true,
            items: [
                {
                    title: 'Funding',
                    url: '/wizard/initiative/funding',
                    inProgress: false,
                    completed: false,
                },
                {
                    title: 'Project members',
                    url: '/wizard/initiative/project-members',
                    inProgress: false,
                    completed: false,
                },
                {
                    title: 'Collaborators',
                    url: '/wizard/initiative/collaborators',
                    inProgress: false,
                    completed: false,
                },
            ],
        },
        {
            title: 'Key results',
            collapsed: true,
            visible: true,
            items: [
                {
                    title: 'Activities',
                    url: '/wizard/initiative/activities',
                    inProgress: false,
                    completed: false,
                },
                {
                    title: 'Sharing of results',
                    url: '/wizard/initiative/sharing-of-results',
                    inProgress: false,
                    completed: false,
                },
                {
                    title: 'Evaluations',
                    url: '/wizard/initiative/evaluations',
                    inProgress: false,
                    completed: false,
                },
                {
                    title: 'Influence on policy',
                    url: '/wizard/initiative/influence-on-policy',
                    inProgress: false,
                    completed: false,
                },
            ],
        },
    ],

    planningItems: [
        {
            title: 'Planning',
            collapsed: true,
            visible: true,
            items: [
                {
                    title: 'Planning',
                    url: '/wizard/initiative/planning',
                    inProgress: false,
                    completed: false,
                },
            ],
        },
    ],
    detailingItems: [
        {
            title: 'Detailing',
            collapsed: true,
            visible: true,
            items: [
                {
                    title: 'Detailing',
                    url: '/wizard/initiative/detailing',
                    inProgress: false,
                    completed: false,
                },
            ],
        },
    ],

    // items: {
    //     introduction: {
    //         order: 0,
    //         visible: false,
    //         title: 'Introduction',
    //         url: '/wizard/initiative/introduction',
    //     },
    //     informationCapture: {
    //         order: 1,
    //         visible: false,
    //         title: 'bajs',
    //         url: '/wizard/initiative/information-capture',
    //     },
    //     initiativeInformation: {
    //         order: 2,
    //         visible: true,
    //         title: 'Initiative information',
    //         url: '/wizard/initiative/initiative-information',
    //         overview: {
    //             order: 2,
    //             subOrder: 0,
    //             visible: true,
    //             title: 'Overview',
    //             url: '/wizard/initiative/overview',
    //         },
    //     },
    //     summary: {
    //         order: 3,
    //         visible: true,
    //         title: 'Summary',
    //         url: '/wizard/initiative/summary',

    //         overallPerformance: {
    //             order: 3,
    //             subOrder: 0,
    //             title: 'Overall performance',
    //             url: '/wizard/initiative/overall-perfomance',
    //             inProgress: false,
    //             completed: false,
    //         },
    //         challengesAndLearnings: {
    //             order: 3,
    //             subOrder: 1,
    //             title: 'Challenges and learnings',
    //             url: '/wizard/initiative/challenges-and-learnings',
    //             inProgress: false,
    //             completed: false,
    //         },
    //     },
    // },
}));

export { useWizardNavigationStore };
