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

const defaultInitiative = {
    _collaborators: {},
    _funders: {},
    _employeesFunded: {},
};

const useInitiativeDataStore = create(
    persist((set, get) => ({
        CONSTANTS: {
            TYPES: {
                COLLABORATORS: ['Additional collaborator'],
                APPLICANTS_ALL: ['Co applicant', 'Main applicant'],
                APPLICANTS_CREATE: ['Co applicant'],
                MAIN_COLLABORATOR: 'Main applicant',
            },
        },

        initiative: {
            ...defaultInitiative,
        },

        // Update initiative model and connected models

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

        async updateEmployeeFunded(id) {
            const data = await sfQuery(
                queries.initiativeEmployeeFunded.get(id)
            );
            if (data) {
                set(state => ({
                    initiative: {
                        ...state.initiative,
                        _employeesFunded: {
                            ...state.initiative._employeesFunded,
                            [id]: {
                                ...state?.initiative?._employeesFunded[id],
                                ...data,
                            },
                        },
                    },
                }));
            }
        },

        async updateReport(id) {
            console.log('UPDATE REPORT TBD');
            // const data = await sfQuery(
            //     queries.initiativeReport.get(id)
            // );
            // if (data) {
            //     set(state => ({
            //         initiative: {
            //             ...state.initiative,
            //             _employeesFunded: {
            //                 ...state.initiative._employeesFunded,
            //                 [id]: {
            //                     ...state?.initiative?._employeesFunded[id],
            //                     ...data,
            //                 },
            //             },
            //         },
            //     }));
            // }
        },

        // Get initiative and all sub data based on initiative ID
        async populateInitiative(id) {
            // Get initiative
            const initiativeData = await sfQuery(queries.initiative.get(id));

            // Populate dependent data based on same id
            const collaboratorsData = await sfQuery(
                queries.initiativeCollaborator.getAll(id)
            );
            const fundersData = await sfQuery(
                queries.initiativeFunder.getAll(id)
            );
            const employeesFundedData = await sfQuery(
                queries.initiativeEmployeeFunded.getAll(id)
            );

            // Update state
            set(() => ({
                initiative: {
                    ...initiativeData,
                    _collaborators: collaboratorsData,
                    _funders: fundersData,
                    _employeesFunded: employeesFundedData,
                },
            }));
        },

        reset() {
            set(() => ({
                initiative: {
                    ...defaultInitiative,
                },
            }));
        },
    })),
    {
        name: 'initiativeData',
    }
);

export { useInitiativeDataStore };
