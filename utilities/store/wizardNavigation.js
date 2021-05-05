import Router from 'next/router';
import create from 'zustand';
import produce from 'immer';
import {
    reportingItems,
    detailingItems,
    planningItems,
} from 'utilities/data/wizardNavigationItems';

const useWizardNavigationStore = create((set, get) => ({
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
            // Go to next step, without "setCollpase" or "setProgress" etc
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
                const length = state.items.length - num;

                // Reached the end
                if (nextId > length) {
                    return;
                }

                // If nav have subSections
                if (state.items[nextId].items) {
                    const subId =
                        nextSubId < 0
                            ? state.items[nextId].items.length - 1
                            : 0;
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
                // No subSections
                else {
                    const url = state.items[nextId].url;
                    Router.push(url);
                }
            }

            // Go to next/previous sub-section
            if (nextSubId <= subLength && nextSubId > -1) {
                state.currentSubSectionId = nextSubId;
                state.onSetInProgess(currId, nextSubId, true); // Current in progress
                // state.onSetCompleted(currId, currSubId, true); // Previous completed

                // Update to new URL
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

    // Adds submit handler for a given item
    addSubmitHandler: handler => {
        set(state => {
            const currId = state.currentSectionId;
            const currSubId = state.currentSubSectionId;

            // Does the current item have any children
            const hasChildren = state.items[currId]?.items?.length > 0;

            // Add handler to child
            if (hasChildren && state.items[currId]) {
                state.items[currId].items[currSubId].submitHandler = handler;
            }
            // Add handler to parent
            else if (state.items[currId]) {
                state.items[currId].submitHandler = handler;
            }
        });
    },

    async onSubmit() {
        const currId = get().currentSectionId;
        const currSubId = get().currentSubSectionId;
        const items = get().items;

        // Does the current item have any children
        const hasChildren = items[currId]?.items?.length > 0;

        // Submit for child
        if (hasChildren) {
            return (
                items[currId].items[currSubId].submitHandler &&
                items[currId].items[currSubId].submitHandler()
            );
        }
        // Submit for parent
        else {
            return items[currId].submitHandler && items[currId].submitHandler();
        }
    },

    shouldHideBack() {
        const currId = get().currentSectionId;
        const currSubId = get().currentSubSectionId;
        const items = get().items;

        // Does the current item have any children
        const hasChildren = items[currId]?.items?.length > 0;

        // Hide back?
        return hasChildren
            ? items[currId]?.items[currSubId].hideBack
            : items[currId]?.hideBack;
    },

    buildWizardItems(configurationType = []) {
        set(state => {
            // What types
            const planning = configurationType.includes('Planning');
            const detailing = configurationType.includes('Explain');

            // Baseline for items = reporting items
            let items = reportingItems();

            // Add planning if needed
            if (planning) {
                items[4] = {
                    ...items[4],
                    items: [
                        planningItems()[0],
                        ...items[4].items,
                        planningItems()[1],
                    ],
                };
            }

            // Add detailing if selected
            if (detailing) {
                items = [
                    ...items.slice(0, 3),
                    ...detailingItems(),
                    ...items.slice(3, items.length),
                ];
            }

            state.items = items;
        });
    },

    // Keep track of current form section
    currentSectionId: 0,
    currentSubSectionId: 0,

    items: reportingItems(),
}));

export { useWizardNavigationStore };
