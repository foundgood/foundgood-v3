import create from 'zustand';

import { reportStructures } from 'utilities/configuration';

const useReportNavigationStore = create((set, get) => ({
    // Rebuilds report items
    buildReportItems(type) {
        // Type is Report_Type__c from report
        if (type) {
            set(state => {
                state.items = reportStructures[type] ?? [];
            });
        }
    },

    items: [],

    reset() {
        set(() => ({
            items: [],
        }));
    },
}));

export { useReportNavigationStore };
