import create from 'zustand';

import { reportWizardDictionary } from 'utilities/data/reportNavigationItems';

const useReportNavigationStore = create((set, get) => ({
    // Rebuilds report wizard items
    buildReportNavigationItems(configurationType) {
        let items;
        const d = reportWizardDictionary;
        switch (configurationType) {
            case 'Final':
                items = [
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
                    { ...d.reflections, items: [d.endOfGrantReflections] },
                ];
                break;

            default:
                // Annual
                items = [
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
                ];
                break;
        }
        set(state => {
            state.items = items;
        });
    },

    items: [],

    reset() {
        set(() => ({
            items: [],
        }));
    },
}));

export { useReportNavigationStore };
