import create from 'zustand';

import {
    CONTEXTS,
    initiativeStructures,
    createStructures,
    reportStructures,
} from 'utilities/configuration';

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

const useWizardNavigationStore = create((set, get) => ({
    // Handles url change in bottom navigation
    async onUrlOrContextChange(baseUrl) {
        // Set current item
        const currentItem = await get().setCurrentItem(baseUrl);

        // Set sections based on location
        currentItem.parentItem
            ? get().toggleSection(currentItem.parentItem, true)
            : get().toggleSection(currentItem.item, true);

        // Set next item url
        get().setNextItemUrl(currentItem);

        // Reset submitHandler
        get().setCurrentSubmitHandler(null);
    },

    // Handles submit from wizard pages
    async handleSubmit() {
        const currentSubmitHandler = get().currentSubmitHandler;
        return currentSubmitHandler ? currentSubmitHandler() : true;
    },

    // Rebuilds wizard items
    buildWizardItems(context, initiativeType = 'Default', reportType = null) {
        // Type is Type__c from initiative or report
        if (context) {
            // Dictionary for remapping legacy types
            const initativeStructureDictionary = {
                Default: 'Default',
                Reporting: 'Default',
                Innovation: 'Innovation',
                'Research infrastructure': 'Research infrastructure',
            };

            // Get real type from dictionary
            const initativeStructureType =
                initativeStructureDictionary[initiativeType];

            // Get context
            const wizards = {
                [CONTEXTS.CREATE]: createStructures,
                [CONTEXTS.INITIATIVE]: initiativeStructures,
                [CONTEXTS.REPORT]: reportStructures,
            };

            set(state => {
                state.items = wizards[context]?.[initativeStructureType] ?? [];
            });
        }
    },

    // Sets the current item and parent item if any
    async setCurrentItem(url) {
        const items = get().items;
        let item;
        let itemIndex;
        let parentItem = null;
        let parentItemIndex = null;

        // Search parent items
        item = items.find(parentItem => parentItem.baseUrl === url);
        itemIndex = items.findIndex(parentItem => parentItem.baseUrl === url);

        // If no top level check for nested
        if (!item) {
            // Check for nested
            parentItem = items.find(parentItem =>
                parentItem.items?.some(childItem => childItem.baseUrl === url)
            );
            parentItemIndex = items.findIndex(parentItem =>
                parentItem.items?.some(childItem => childItem.baseUrl === url)
            );

            // Look through children
            item = parentItem?.items?.find(
                childItem => childItem.baseUrl === url
            );
            itemIndex = parentItem?.items?.findIndex(
                childItem => childItem.baseUrl === url
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
        set(() => ({ openSection: section?.title }));
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

    items: [],
    openSection: null,
    currentItem: null,
    currentSubmitHandler: null,
    nextItemUrl: null,

    reset() {
        set(() => ({
            items: [],
            openSection: null,
            currentItem: null,
            currentSubmitHandler: null,
            nextItemUrl: null,
        }));
    },
}));

export { useWizardNavigationStore };
