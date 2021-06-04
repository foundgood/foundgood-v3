import create from 'zustand';
import { persist } from 'zustand/middleware';
import { query } from 'utilities/api/salesForce/fetchers';
import { queries } from 'utilities/api/salesForce/queries';
import { authStore } from 'utilities/store';

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
    return {};
}

function _updateAuth() {
    const { getState } = authStore;
    getState().updateUserTimeout();
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
    _reportDetails: {},
    _initiativeUpdates: {},
    _logbook: {},
};

const constants = {
    TYPES: {
        COLLABORATORS: ['Additional collaborator'],
        APPLICANTS_ALL: ['Co applicant', 'Main applicant'],
        APPLICANTS_CREATE: ['Co applicant'],
        MAIN_COLLABORATOR: 'Main applicant',
        LEAD_FUNDER: 'Lead funder',
        GOAL_CUSTOM: 'Custom',
        GOAL_PREDEFINED: 'Foundation',
        INDICATOR_CUSTOM: 'Custom',
        INDICATOR_PREDEFINED: 'People',
        INDICATOR_GENDER_OTHER: 'Other',
        GENDER_OTHER: 'Other',
        GENDER_MALE: 'Male',
        GENDER_FEMALE: 'Female',
        ACTIVITY_INTERVENTION: 'Intervention',
        ACTIVITY_DISSEMINATION: 'Dissemination',
        ACTIVITY_JOURNAL: 'Journal publication',
        INFLUENCE_ON_POLICY: 'Influence On Policy',
        EVALUATION: 'Evaluation',
        REPORT_NOT_STARTED: 'Not started',
        REPORT_IN_PROGRESS: 'In progress',
        REPORT_IN_REVIEW: 'In review',
        REPORT_PUBLISHED: 'Published',
        // REPORT DETAIL OVERVIEW TYPES
        EMPLOYEES_FUNDED_OVERVIEW: 'Employees Funded Overview',
        FUNDER_OVERVIEW: 'Funder Overview',
        COLLABORATOR_OVERVIEW: 'Collaborator Overview',
        ACTIVITY_OVERVIEW: 'Activity Overview',
        OUTCOME_OVERVIEW: 'Outcome',
        LOGBOOK_TYPE_METRICS: 'Success Metric Update',
        LOGBOOK_TYPE_UPDATE: 'Update',
    },
    IDS: {
        NNF_ACCOUNT: '0011x000002rJb4AAE',
    },
    CUSTOM: {
        INDICATOR_KPI_AGED: [
            { value: 'Children (ages 0-2)', min: 0, max: 2 },
            { value: 'Children (ages 3-5)', min: 3, max: 4 },
            { value: 'Children (ages 6-15)', min: 6, max: 15 },
            { value: 'Young people (ages 16-24)', min: 16, max: 24 },
            { value: 'Adults (ages 24 and over)', min: 24, max: 150 },
        ],
    },
};

const useInitiativeDataStore = create((set, get) => ({
    CONSTANTS: { ...constants },

    initiative: {
        ...defaultInitiative,
    },

    // Helper for knowing if NNF is lead funder
    isNovoLeadFunder() {
        const funders = Object.values(get().initiative?._funders ?? [])
            .filter(funder => funder.Type__c === constants.TYPES.LEAD_FUNDER)
            .filter(funder => funder.Account__c === constants.IDS.NNF_ACCOUNT);
        return funders?.length > 0;
    },

    // Setter for initiative Id
    setInitiativeId(id) {
        set(state => ({
            initiative: {
                ...state.initiative,
                Id: id,
            },
        }));
    },

    getInitiativeId() {
        return get().initiative.Id;
    },

    // Getter for report based on ID
    getReport(id) {
        return id ? get().initiative?._reports[id] ?? {} : {};
    },

    // Getter for report details based on report ID
    getReportDetails(id) {
        return id
            ? Object.values(get().initiative?._reportDetails).filter(
                  item => item.Initiative_Report__c === id
              ) ?? []
            : [];
    },

    // Update initiative model and connected models
    async updateInitiative(id) {
        const data = await sfQuery(queries.initiative.get(id));
        if (data) {
            set(state => ({
                initiative: { ...state.initiative, ...data },
            }));
        }

        // Update auth
        _updateAuth();
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

        // Update auth
        _updateAuth();
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

        // Update auth
        _updateAuth();
    },

    async updateEmployeeFunded(id) {
        const data = await sfQuery(queries.initiativeEmployeeFunded.get(id));
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

        // Update auth
        _updateAuth();
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

        // Update auth
        _updateAuth();
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

        // Update auth
        _updateAuth();
    },

    async updateOutcomes(id) {},

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

        // Update auth
        _updateAuth();
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

        // Update auth
        _updateAuth();
    },

    // Bulk update multiple ids
    async updateActivityGoals(ids) {
        const data = await sfQuery(
            queries.initiativeActivityGoal.getMultiple(ids)
        );

        if (data) {
            set(state => ({
                initiative: {
                    ...state.initiative,
                    _activityGoals: {
                        ...state.initiative._activityGoals,
                        ..._returnAsKeys(data),
                    },
                },
            }));
        }

        // Update auth
        _updateAuth();
    },

    // Activity Goals: Remove items based on ids
    async removeActivityGoals(ids) {
        set(state => {
            const activityGoals = Object.values(
                state.initiative._activityGoals
            ).filter(item => {
                return ids.includes(item.Id) ? false : true;
            });
            return {
                initiative: {
                    ...state.initiative,
                    _activityGoals: { activityGoals },
                },
            };
        });

        // Update auth
        _updateAuth();
    },

    async updateActivitySuccessMetrics(ids) {
        const data = await sfQuery(
            queries.initiativeActivitySuccessMetric.getMultiple(ids)
        );
        if (data) {
            set(state => ({
                initiative: {
                    ...state.initiative,
                    _activitySuccessMetrics: {
                        ...state.initiative._activitySuccessMetrics,
                        ..._returnAsKeys(data),
                    },
                },
            }));
        }

        // Update auth
        _updateAuth();
    },

    async updateReportDetails(ids) {
        const data = await sfQuery(
            queries.initiativeReportDetail.getMultiple(ids)
        );

        if (data) {
            set(state => ({
                initiative: {
                    ...state.initiative,
                    _reportDetails: {
                        ...state.initiative._reportDetails,
                        ..._returnAsKeys(data),
                    },
                },
            }));
        }

        // Update auth
        _updateAuth();
    },

    // Custom data updaters
    async populateReportDetails(reportId) {
        if (reportId && reportId !== '[reportId]') {
            const reportDetailsData = await sfQuery(
                queries.initiativeReportDetail.getAllReport(reportId)
            );

            // Update state
            set(state => ({
                initiative: {
                    ...state.initiative,
                    _reportDetails: {
                        ...state.initiative._reportDetails,
                        ..._returnAsKeys(reportDetailsData),
                    },
                },
            }));

            // Update auth
            _updateAuth();
        }
    },

    // Populate report data
    async populateReport(id) {
        if (id && id !== '[reportId]' && !get().initiative._reports[id]) {
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

            // Update auth
            _updateAuth();
        }
    },

    // Get initiative and all sub data based on initiative ID
    async populateInitiative(id) {
        if (id && id !== '[initiativeId]' && get().initiative.Id !== id) {
            // Reset
            get().reset();

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
            const logbookData = await sfQuery(queries.logbook.getAll(id));

            // Update state
            set(state => ({
                initiative: {
                    ...state.initiative,
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
                    _logbook: _returnAsKeys(logbookData),
                },
            }));

            // Update auth
            _updateAuth();
        }
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
}));

export { useInitiativeDataStore };
