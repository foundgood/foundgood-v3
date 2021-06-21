import create from 'zustand';
import { persist } from 'zustand/middleware';

import { initiativeWizardDictionary } from 'utilities/data/initiativeNavigationItems';

import { reportWizardDictionary } from 'utilities/data/reportNavigationItems';

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

        // Add to completed
        get().addToCompleted(baseUrl);
    },

    // Handles submit from wizard pages
    async handleSubmit() {
        const currentSubmitHandler = get().currentSubmitHandler;
        return currentSubmitHandler ? currentSubmitHandler() : true;
    },

    // Rebuilds initiative wizard items
    buildInitiativeWizardItems(configurationType = []) {
        // What types
        const planning = configurationType.includes('Planning');
        const detailing = configurationType.includes('Explain');

        // Dictionary
        const d = initiativeWizardDictionary;

        // Items
        const items = [
            d.introduction,
            // TODO Add in when we have more reporting options
            // d.informationCapture,
            {
                ...d.context,
                items: [
                    d.overview,
                    d.funders,
                    d.applicants,
                    d.collaborators,
                    d.employeesFunded,
                ],
            },
            // If detailing is on
            ...(detailing
                ? [
                      {
                          ...d.background,
                          items: [
                              d.problemsToBeSolved,
                              d.causesOfTheProblem,
                              d.organisationalFocus,
                              d.ourVision,
                              d.reasonsForThisSolve,
                          ],
                      },
                  ]
                : []),
            {
                ...d.activitiesParent,
                items: [
                    d.goals,
                    d.activities,
                    d.indicators,
                    // d.progressSoFar, // Not in at the moment
                    // If planning is on
                    ...(planning ? [d.targets] : []),
                ],
            },
            {
                ...d.developments,
                items: [d.sharingResults],
            },
            // {...d.logbook, items: [d.logbook]},
            { ...d.reports, items: [d.reportSchedule] },
            d.done,
        ];

        set(state => {
            state.items = items;
        });
    },

    // Rebuilds report wizard items
    buildReportWizardItems(configurationType) {
        // Items
        let items;

        // Dictionary
        const d = reportWizardDictionary;
        switch (configurationType) {
            case 'Final':
                items = [
                    d.introduction,
                    {
                        ...d.summary,
                        items: [
                            d.reportDetails,
                            d.funders,
                            d.overview,
                            d.reportSummary,
                        ],
                    },
                    {
                        ...d.keyChanges,
                        items: [
                            d.applicants,
                            d.collaborators,
                            d.employeesFunded,
                            d.activities,
                            d.indicators,
                            d.progressSoFar,
                            d.sharingResults,
                        ],
                    },
                    {
                        ...d.keyResults,
                        items: [d.influenceOnPolicy, d.evaluations],
                    },
                    { ...d.reflections, items: [d.endOfGrantReflections] },
                    d.done,
                ];
                break;

            case 'Status':
                items = [
                    d.introduction,
                    {
                        ...d.summary,
                        items: [
                            d.reportDetails,
                            d.funders,
                            d.overview,
                            d.reportSummary,
                            d.risksAndChallenges,
                        ],
                    },
                    {
                        ...d.keyChanges,
                        items: [d.applicants, d.collaborators],
                    },
                    d.done,
                ];
                break;

            default:
                // Annual
                items = [
                    d.introduction,
                    {
                        ...d.summary,
                        items: [
                            d.reportDetails,
                            d.funders,
                            d.overview,
                            d.reportSummary,
                        ],
                    },
                    {
                        ...d.keyChanges,
                        items: [
                            d.applicants,
                            d.collaborators,
                            d.employeesFunded,
                            d.goals,
                            d.activities,
                            d.indicators,
                            d.progressSoFar,
                            d.sharingResults,
                        ],
                    },
                    {
                        ...d.keyResults,
                        items: [d.influenceOnPolicy, d.evaluations],
                    },
                    d.done,
                ];
                break;
        }
        set(state => {
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
}));

export { useWizardNavigationStore };
