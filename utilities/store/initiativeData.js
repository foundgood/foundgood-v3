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
    _reports: {},
    _goals: {},
    _activities: {},
    _activitySuccessMetrics: {},
};

const constants = {
    TYPES: {
        COLLABORATORS: ['Additional collaborator'],
        APPLICANTS_ALL: ['Co applicant', 'Main applicant'],
        APPLICANTS_CREATE: ['Co applicant'],
        MAIN_COLLABORATOR: 'Main applicant',
        GOAL_CUSTOM: 'Custom',
        GOAL_PREDEFINED: 'Foundation',
        INDICATOR_CUSTOM: 'Custom',
        INDICATOR_PREDEFINED: 'People',
        ACTIVITY_INTERVENTION: 'Intervention',
        ACTIVITY_DISSEMINATION: 'Dissemination',
        ACTIVITY_JOURNAL: 'Journal publication',
    },
};

const useInitiativeDataStore = create(
    persist((set, get) => ({
        CONSTANTS: { ...constants },

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
            const data = await sfQuery(queries.initiativeReport.get(id));
            if (data) {
                set(state => ({
                    initiative: {
                        ...state.initiative,
                        _reports: {
                            ...state.initiative._reports,
                            [id]: {
                                ...state?.initiative?._reports[id],
                                ...data,
                            },
                        },
                    },
                }));
            }
        },

        async updateGoal(id) {
            const data = await sfQuery(queries.initiativeGoal.get(id));
            if (data) {
                set(state => ({
                    initiative: {
                        ...state.initiative,
                        _goals: {
                            ...state.initiative._goals,
                            [id]: {
                                ...state?.initiative?._goals[id],
                                ...data,
                            },
                        },
                    },
                }));
            }
        },

        async updateActivity(id) {
            const data = await sfQuery(queries.initiativeActivity.get(id));
            if (data) {
                set(state => ({
                    initiative: {
                        ...state.initiative,
                        _activities: {
                            ...state.initiative._activities,
                            [id]: {
                                ...state?.initiative?._activities[id],
                                ...data,
                            },
                        },
                    },
                }));
            }
        },

        async updateActivitySuccessMetric(id) {
            const data = await sfQuery(
                queries.initiativeActivitySuccessMetric.get(id)
            );
            if (data) {
                set(state => ({
                    initiative: {
                        ...state.initiative,
                        _activitySuccessMetrics: {
                            ...state.initiative._activitySuccessMetrics,
                            [id]: {
                                ...state?.initiative?._activitySuccessMetrics[
                                    id
                                ],
                                ...data,
                            },
                        },
                    },
                }));
            }
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
            const reportsData = await sfQuery(
                queries.initiativeReport.getAll(id)
            );
            const goalsData = await sfQuery(queries.initiativeGoal.getAll(id));
            const activitiesData = await sfQuery(
                queries.initiativeActivity.getAll(id)
            );
            const activitySuccessMetricsData = await sfQuery(
                queries.initiativeActivitySuccessMetric.getAll(id)
            );

            // Update state
            set(() => ({
                initiative: {
                    ...initiativeData,
                    _collaborators: collaboratorsData,
                    _funders: fundersData,
                    _employeesFunded: employeesFundedData,
                    _reports: reportsData,
                    _goals: goalsData,
                    _activities: activitiesData,
                    _activitySuccessMetrics: activitySuccessMetricsData,
                },
            }));
        },

        reset() {
            set(() => ({
                CONSTANTS: {
                    ...constants,
                },
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
