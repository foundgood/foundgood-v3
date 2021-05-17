import create from 'zustand';
import { persist } from 'zustand/middleware';

import {
    initiativeItems,
    initiativeDetailingItems,
    initiativePlanningItems,
} from 'utilities/data/initiativeNavigationItems';

import { reportItems } from 'utilities/data/reportNavigationItems';

// Helper for getting next url
function _goToNextSection(sectionIndex, items) {
    // Next section
    const nextSection = items[sectionIndex + 1];

    // Return url from next section or the first child in items
    return nextSection ?? null
        ? nextSection.url
            ? nextSection.url
            : nextSection.items[0].url
        : null;
}

const useWizardNavigationStore = create(
    persist((set, get) => ({
        // Handles url change in bottom navigation
        async onUrlOrContextChange(url) {
            // Reset submitHandler
            get().setCurrentSubmitHandler(null);

            // Set current item
            const currentItem = await get().setCurrentItem(url);

            // Set sections based on location
            currentItem.parentItem
                ? get().toggleSection(currentItem.parentItem, true)
                : get().toggleSection(currentItem.item, true);

            // Set next item url
            get().setNextItemUrl(currentItem);

            // Add to completed
            get().addToCompleted(url);
        },

        // Handles submit from wizard pages
        async handleSubmit() {
            const currentSubmitHandler = get().currentSubmitHandler;
            return currentSubmitHandler ? currentSubmitHandler() : true;
        },

        // Rebuilds initiative wizard items
        buildInitiativeWizardItems(configurationType = []) {
            set(state => {
                // What types
                const planning = configurationType.includes('Planning');
                const detailing = configurationType.includes('Explain');

                // Baseline for items = reporting items
                let items = initiativeItems();

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

        // Rebuilds report wizard items
        buildReportWizardItems(configurationType = []) {
            set(state => {
                // What types
                const planning = configurationType.includes('Planning');
                const detailing = configurationType.includes('Explain');

                // Baseline for items = reporting items
                let items = reportItems();

                // // Add planning if needed
                // if (planning) {
                //     items[4] = {
                //         ...items[4],
                //         items: [
                //             planningItems()[0],
                //             ...items[4].items,
                //             planningItems()[1],
                //         ],
                //     };
                // }

                // // Add detailing if selected
                // if (detailing) {
                //     items = [
                //         ...items.slice(0, 3),
                //         ...detailingItems(),
                //         ...items.slice(3, items.length),
                //     ];
                // }

                state.items = items;
            });
        },

        // Sets the current item and parent item if any
        async setCurrentItem(url) {
            const items = get().items;
            let item;
            let itemIndex;
            let parentItem = null;
            let parentItemIndex = null;

            // Search parent items
            item = items.find(parentItem => parentItem.url === url);
            itemIndex = items.findIndex(parentItem => parentItem.url === url);

            // If no top level check for nested
            if (!item) {
                // Check for nested
                parentItem = items.find(parentItem =>
                    parentItem.items?.some(childItem => childItem.url === url)
                );
                parentItemIndex = items.findIndex(parentItem =>
                    parentItem.items?.some(childItem => childItem.url === url)
                );

                // Look through children
                item = parentItem.items?.find(
                    childItem => childItem.url === url
                );
                itemIndex = parentItem.items?.findIndex(
                    childItem => childItem.url === url
                );
            }

            const currentItem = {
                item,
                itemIndex,
                parentItem,
                parentItemIndex,
            };

            // Update state
            set(() => ({
                currentItem,
            }));

            // Return
            return currentItem;
        },

        // Toggles section in navigation
        toggleSection(section) {
            set(() => ({ openSection: section.title }));
        },

        // Sets the url of the next item
        setNextItemUrl(currentItem) {
            const { itemIndex, parentItem, parentItemIndex } = currentItem;
            const items = get().items;

            // Wait for iiiit
            let nextItemUrl;

            // Child next url
            if (parentItem) {
                // Is the current item the last item?
                nextItemUrl =
                    itemIndex + 1 === parentItem.items?.length ?? 0
                        ? _goToNextSection(parentItemIndex, items)
                        : parentItem.items[itemIndex + 1].url;
            }

            // Parent/section level
            else {
                nextItemUrl = _goToNextSection(itemIndex, items);
            }

            // Update state
            set(() => ({
                nextItemUrl,
            }));
        },

        // Set the submit handler for the current view
        setCurrentSubmitHandler(currentSubmitHandler) {
            set(() => ({
                currentSubmitHandler,
            }));
        },

        // Adds navigation item to completed
        addToCompleted(url) {
            set(state => {
                if (state.completedItems.includes(url)) {
                    return;
                } else {
                    state.completedItems = [...state.completedItems, url];
                }
            });
        },

        items: [],
        completedItems: [],
        openSection: null,
        currentItem: null,
        currentSubmitHandler: null,
        nextItemUrl: null,

        reset() {
            set(() => ({
                items: [],
                completedItems: [],
                openSection: null,
                currentItem: null,
                currentSubmitHandler: null,
                nextItemUrl: null,
            }));
        },
    })),
    {
        name: 'wizardNavigation',
    }
);

export { useWizardNavigationStore };
