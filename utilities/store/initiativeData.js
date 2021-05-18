import create from 'zustand';
import { persist } from 'zustand/middleware';
import { query } from 'utilities/api/salesForce/fetchers';
import { queries } from 'utilities/api/salesForce/queries';
import { data } from 'autoprefixer';

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

function _returnAsKeys(data) {
    if (data) {
        const keyedData = [...(Array.isArray(data) ? data : [data])].reduce(
            (acc, item) => ({ ...acc, [item.Id]: item }),
            {}
        );
        return keyedData;
    }
    return null;
}

const defaultInitiative = {
    _collaborators: {},
    _funders: {},
    _employeesFunded: {},
    _reports: {},
    _goals: {},
    _activities: {},
    _activityGoals: {},
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

        // Getter for report based on ID
        getReport(id) {
            console.log(get().initiative);
            return id ? get().initiative?._reports[id] ?? {} : {};
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

        // Update single item
        async updateFunder(id) {
            const data = await sfQuery(queries.initiativeFunder.get(id));
            if (data) {
                set(state => ({
                    initiative: {
                        ...state.initiative,
                        _funders: {
                            ...state.initiative._funders,
                            [id]: data,
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
                            [id]: data,
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
                            [id]: data,
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
                            [id]: data,
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
                            [id]: data,
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
                            [id]: data,
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
                            [id]: data,
                        },
                    },
                }));
            }
        },

        // Bulk update multiple ids
        async updateActivityGoals(ids) {
            let data = await sfQuery(
                queries.initiativeActivityGoal.getMultiple(ids)
            );
            if (data) {
                data = Array.isArray(data) ? data : [data];
                set(state => ({
                    initiative: {
                        ...state.initiative,
                        _activityGoals: {
                            ...state.initiative._activityGoals,
                            ...data.reduce(
                                (acc, item) => ({ ...acc, [item.Id]: item }),
                                {}
                            ),
                        },
                    },
                }));
            }
        },

        async updateActivitySuccessMetrics(ids) {
            let data = await sfQuery(
                queries.initiativeActivitySuccessMetric.getMultiple(ids)
            );
            if (data) {
                data = Array.isArray(data) ? data : [data];
                set(state => ({
                    initiative: {
                        ...state.initiative,
                        _activitySuccessMetrics: {
                            ...state.initiative._activitySuccessMetrics,
                            ...data.reduce(
                                (acc, item) => ({ ...acc, [item.Id]: item }),
                                {}
                            ),
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
            const activityGoalsData = await sfQuery(
                queries.initiativeActivityGoal.getAll(id)
            );
            const activitySuccessMetricsData = await sfQuery(
                queries.initiativeActivitySuccessMetric.getAll(id)
            );
            // Update state
            set(() => ({
                initiative: {
                    ...initiativeData,
                    _collaborators: _returnAsKeys(collaboratorsData),
                    _funders: _returnAsKeys(fundersData),
                    _employeesFunded: _returnAsKeys(employeesFundedData),
                    _reports: _returnAsKeys(reportsData),
                    _goals: _returnAsKeys(goalsData),
                    _activities: _returnAsKeys(activitiesData),
                    _activitySuccessMetrics: _returnAsKeys(
                        activitySuccessMetricsData
                    ),
                    _activityGoals: _returnAsKeys(activityGoalsData),
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
