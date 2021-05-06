import create from 'zustand';
import { persist } from 'zustand/middleware';
import { query } from 'utilities/api/salesForce/fetchers';
import { queries } from 'utilities/api/salesForce/queries';

// Wrapper for sales force query
async function sfQuery(q) {
    try {
        const { records, totalSize } = await query(q);
        if (totalSize === 1) {
            return records[0];
        } else if (totalSize > 1) {
            return records;
        } else return null;
    } catch (error) {
        console.warn(error);
    }
}

const useInitiativeDataStore = create(
    persist((set, get) => ({
        configurationType: ['Reporting'],
        setConfigurationType(configurationType) {
            set(() => ({ configurationType }));
        },
        initiative: {
            _collaborators: {},
            _funders: {},
        },

        async updateInitiative(id) {
            const data = await sfQuery(queries.initiative.get(id));
            if (data) {
                set(state => ({
                    initiative: { ...state.initiative, ...data },
                }));
            }
        },

        async updateFunder(id) {
            const data = await sfQuery(queries.initiativeFunder.get(id));
            if (data) {
                set(state => ({
                    initiative: {
                        ...state.initiative,
                        _funders: {
                            ...state.initiative._funders,
                            [id]: {
                                ...state?.initiative?._funders[id],
                                ...data,
                            },
                        },
                    },
                }));
            }
        },

        async updateCollaborator(id) {
            const data = await sfQuery(queries.initiativeCollaborator.get(id));
            if (data) {
                set(state => ({
                    initiative: {
                        ...state.initiative,
                        _collaborators: {
                            ...state.initiative._collaborators,
                            [id]: {
                                ...state?.initiative?._collaborators[id],
                                ...data,
                            },
                        },
                    },
                }));
            }
        },

        reset() {
            set(() => ({
                initiative: {
                    _collaborators: {},
                    _funders: {},
                },
            }));
        },
    })),
    {
        name: 'initiativeData',
    }
);

export { useInitiativeDataStore };
