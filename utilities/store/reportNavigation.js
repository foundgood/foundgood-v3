import create from 'zustand';

import { reportWizardDictionary } from 'utilities/data/reportNavigationItems';

const useReportNavigationStore = create((set, get) => ({
    // Rebuilds report wizard items
    buildReportNavigationItems(configurationType) {
        let items;
        const d = reportWizardDictionary;
        switch (configurationType) {
            case 'Status':
                items = [
                    {
                        ...d.summary,
                        items: [
                            // d.reportDetails,
                            d.overview,
                            d.reportSummary,
                            // d.riskChallenges, // Risk and challenges - TBD
                        ],
                    },
                    {
                        ...d.keyChanges,
                        items: [
                            d.funders, // Moved from Summary
                            d.applicants,
                            d.collaborators,
                        ],
                    },
                ];
                break;

            case 'Final':
                items = [
                    {
                        ...d.summary,
                        items: [
                            // d.reportDetails,
                            d.overview,
                            // d.goals, // Moved from Key changes
                            d.reportSummary,
                        ],
                    },
                    {
                        ...d.keyChanges,
                        items: [
                            d.activities,
                            d.funders, // Moved from Summary
                            // d.applicants,
                            d.collaborators,
                            d.employeesFunded,
                            // d.indicators,
                            // d.progressSoFar,
                        ],
                    },
                    {
                        ...d.keyResults,
                        items: [
                            d.sharingResults,
                            d.influenceOnPolicy,
                            d.evaluations,
                        ],
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
                            // d.reportDetails,
                            d.overview,
                            // d.goals, // Moved from Key changes
                            d.reportSummary,
                        ],
                    },
                    {
                        ...d.keyChanges,
                        items: [
                            d.activities,
                            d.funders, // Moved from Summary
                            // d.applicants,
                            d.collaborators,
                            d.employeesFunded,
                            // d.indicators,
                            // d.progressSoFar,
                        ],
                    },
                    {
                        ...d.keyResults,
                        items: [
                            d.sharingResults,
                            d.influenceOnPolicy,
                            d.evaluations,
                        ],
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
