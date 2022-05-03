import create from 'zustand';
import _get from 'lodash.get';
import _set from 'lodash.set';
import _unset from 'lodash.unset';
import { query } from 'utilities/api/salesForce/fetchers';
import { queries } from 'utilities/api/salesForce/queries';
import { authStore } from 'utilities/store';
import ew from 'utilities/api/elseware';

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
    _activities: {},
    _activityGoals: {},
    _activitySuccessMetrics: {},
    _collaborators: {},
    _employeesFunded: {},
    _funders: {},
    _goals: {},
    _reportDetailEntries: {},
    _reportDetailGoals: {},
    _reportDetails: {},
    _reports: {},
    _updateContents: {},
    _updates: {},
};

const constants = {
    ACCOUNT: {
        FOUNDATION: 'Foundation',
        GRANTEE: 'Grantee',
    },
    ACTIVITIES: {
        ACTIVITY_INTERVENTION: 'Intervention',
        ACTIVITY_DISSEMINATION: 'Dissemination',
        ACTIVITY_JOURNAL: 'Journal publication',
    },
    ACTIVITY_GOALS: {},
    ACTIVITY_SUCCESS_METRICS: {
        INDICATOR_CUSTOM: 'Custom',
        INDICATOR_PREDEFINED: 'People',
        INDICATOR_GENDER_OTHER: 'Other',
    },
    COLLABORATORS: {
        MAIN_COLLABORATOR: 'Main applicant',
        ADDITIONAL_COLLABORATORS: ['Additional collaborator'],
        APPLICANTS_ALL: ['Co applicant', 'Main applicant'],
        APPLICANTS_CREATE: ['Co applicant'],
    },
    EMPLOYEES_FUNDED: {
        GENDER_OTHER: 'Other',
        GENDER_MALE: 'Male',
        GENDER_FEMALE: 'Female',
    },
    FUNDERS: {
        LEAD_FUNDER: 'Lead funder',
    },
    GOALS: {
        GOAL_CUSTOM: 'Custom',
        GOAL_PREDEFINED: 'Foundation',
    },
    REPORT_DETAIL_ENTRIES: {},
    REPORT_DETAIL_GOALS: {},
    REPORT_DETAILS: {
        INFLUENCE_ON_POLICY: 'Influence On Policy',
        EVALUATION: 'Evaluation',
        EMPLOYEES_FUNDED_OVERVIEW: 'Employees Funded Overview',
        FUNDER_OVERVIEW: 'Funder Overview',
        COLLABORATOR_OVERVIEW: 'Collaborator Overview',
        ACTIVITY_OVERVIEW: 'Activity Overview',
        OUTCOME_OVERVIEW: 'Outcome',
        LOGBOOK_UPDATE: 'Update',
    },
    REPORTS: {
        REPORT_NOT_STARTED: 'Not started',
        REPORT_IN_PROGRESS: 'In progress',
        REPORT_IN_REVIEW: 'In review',
        REPORT_PUBLISHED: 'Published',
    },
    UPDATE_CONTENTS: {},
    UPDATES: {
        LOGBOOK_TYPE_METRICS: 'Success Metric Update',
        LOGBOOK_TYPE_UPDATE: 'Update',
    },
    TYPES: {
        ACCOUNT_TYPE_FOUNDATION: 'Foundation',
        ACCOUNT_TYPE_GRANTEE: 'Grantee',
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
        LOGBOOK_TYPE_METRICS: 'Success Metric Update',
        LOGBOOK_TYPE_UPDATE: 'Update',
        // REPORT DETAIL OVERVIEW TYPES
        EMPLOYEES_FUNDED_OVERVIEW: 'Employees Funded Overview',
        FUNDER_OVERVIEW: 'Funder Overview',
        COLLABORATOR_OVERVIEW: 'Collaborator Overview',
        ACTIVITY_OVERVIEW: 'Activity Overview',
        OUTCOME_OVERVIEW: 'Outcome',
        LOGBOOK_UPDATE: 'Update',
    },
    IDS: {
        NNF_ACCOUNT: process.env.NEXT_PUBLIC_NNF_ACCOUNT,
    },
    CUSTOM: {
        NO_REFLECTIONS: '__NO__REFLECTIONS__',
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

    utilities: {
        activities: {
            // Returns activity as object based on id
            get(id) {
                return get().initiative._activities[id] || {};
            },
            // Returns activities as array
            getAll() {
                return Object.values(get().initiative._activities);
            },
            // Returns activities with specific type as array
            getTypeIntervention() {
                return Object.values(get().initiative._activities).filter(
                    item =>
                        constants.ACTIVITIES.ACTIVITY_INTERVENTION ===
                        item.Activity_Type__c
                );
            },
            // Returns activities with specific type as array
            getTypeDissemination() {
                return Object.values(get().initiative._activities).filter(
                    item =>
                        constants.ACTIVITIES.ACTIVITY_DISSEMINATION ===
                        item.Activity_Type__c
                );
            },
        },
        activityGoals: {},
        activitySuccessMetrics: {
            // Returns activitySuccessMetric as object based on id
            get(id) {
                return get().initiative._activitySuccessMetrics[id] || {};
            },
            // Returns array of objects of activitySuccessMetrics based on Initiative_Activity__c id
            getFromActivityId(activityId) {
                return Object.values(
                    get().initiative?._activitySuccessMetrics
                ).filter(item => item.Initiative_Activity__c === activityId);
            },
            getTypePredefinedFromActivityId(activityId) {
                return this.getFromActivityId(activityId).filter(
                    item =>
                        item.Type__c ===
                        constants.ACTIVITY_SUCCESS_METRICS.INDICATOR_PREDEFINED
                );
            },
            getTypeCustomFromActivityId(activityId) {
                return this.getFromActivityId(activityId).filter(
                    item =>
                        item.Type__c ===
                        constants.ACTIVITY_SUCCESS_METRICS.INDICATOR_CUSTOM
                );
            },
        },
        collaborators: {
            // Returns collaborator as object based on id
            get(id) {
                return get().initiative._collaborators[id] || {};
            },
            // Returns collaborater with specific type as object
            getTypeMain() {
                return (
                    Object.values(get().initiative._collaborators).find(
                        item =>
                            item.Type__c ===
                            constants.COLLABORATORS.MAIN_COLLABORATOR
                    ) || {}
                );
            },
            // Returns collaboraters with specific type as array
            getTypeAdditional() {
                return Object.values(
                    get().initiative._collaborators
                ).filter(item =>
                    constants.COLLABORATORS.ADDITIONAL_COLLABORATORS.includes(
                        item.Type__c
                    )
                );
            },
            // Returns collaboraters with specific type as array
            getTypeApplicantsAll() {
                return Object.values(
                    get().initiative._collaborators
                ).filter(item =>
                    constants.COLLABORATORS.APPLICANTS_ALL.includes(
                        item.Type__c
                    )
                );
            },
        },
        employeesFunded: {
            // Returns employeeFunded as object based on id
            get(id) {
                return get().initiative._employeesFunded[id] || {};
            },
            // Returns employeesFunded as array
            getAll() {
                return Object.values(get().initiative._employeesFunded);
            },
        },
        funders: {
            // Returns funder as object based on id
            get(id) {
                return get().initiative._funders[id] || {};
            },
            // Returns funders as array
            getAll() {
                return Object.values(get().initiative._funders);
            },
        },
        goals: {
            // Returns goal as object based on id
            get(id) {
                return get().initiative._goals[id] || {};
            },
            // Returns goal with specific type as object
            getTypePredefined() {
                return (
                    Object.values(get().initiative?._goals).find(
                        item => item.Type__c === constants.GOALS.GOAL_PREDEFINED
                    ) || {}
                );
            },
            // Returns collaboraters with specific type as array
            getTypeCustom() {
                return Object.values(get().initiative._goals).filter(item =>
                    constants.GOALS.GOAL_CUSTOM.includes(item.Type__c)
                );
            },
        },
        reportDetailEntries: {},
        reportDetailGoals: {},
        reportDetails: {
            // Returns array of objects of reportDetails based on Initiative_Report__c id
            getFromReportId(reportId) {
                return Object.values(get().initiative?._reportDetails).filter(
                    item => item.Initiative_Report__c === reportId
                );
            },
        },
        reports: {
            // Returns report as object based on id
            get(id) {
                return get().initiative._reports[id] || {};
            },
            // Returns array of objects of reports based on Initiative_Funder__c id
            getFromFunderId(funderId) {
                return Object.values(get().initiative?._reports).filter(
                    item => item.Funder_Report__c === funderId
                );
            },
        },
        updateContents: {
            // Returns updateContent as object based on Initiative_Update__c id
            getFromUpdateId(initiativeUpdateId) {
                return (
                    Object.values(get().initiative?._updateContents).find(
                        item => item.Initiative_Update__c === initiativeUpdateId
                    ) || {}
                );
            },
        },
        updates: {
            // Returns update as object based on id
            get(id) {
                return get().initiative._updates[id] || {};
            },
            // Returns updates with specific type as array
            getTypeLogbookUpdate() {
                return Object.values(get().initiative._updates).filter(
                    item =>
                        item.Type__c === constants.REPORT_DETAILS.LOGBOOK_UPDATE
                );
            },
        },
        // Returns id of initiative - to make sure it's the latest
        getInitiativeId() {
            return get().initiative.Id;
        },
        // Update initiative with new data
        updateInitiative(data) {
            set(state => ({
                initiative: { ...state.initiative, ...data },
            }));
        },
        // Updates nested initiative objects with new data
        updateInitiativeData(path, data) {
            let initiative = get().initiative;
            _set(initiative, `${path}[${data.Id}]`, data);
            set(() => ({
                initiative,
            }));
        },
        // Updates data relations
        updateInitiativeDataRelations(path, data) {
            let initiative = get().initiative;
            _set(initiative, path, { ..._get(initiative, path), ...data });
            set(() => ({
                initiative,
            }));
        },
        // Removes initiative data
        removeInitiativeData(path, id) {
            let initiative = get().initiative;
            _unset(initiative, `${path}[${id}]`);
            set(() => ({
                initiative,
            }));
        },
        // Removes data relations
        removeInitiativeDataRelations(path, fnRelation) {
            let initiative = get().initiative;
            Object.values(_get(initiative, path))
                .filter(fnRelation)
                .forEach(item => _unset(initiative, `${path}[${item.Id}]`));
            set(() => ({
                initiative,
            }));
        },
        // Helper for knowing if NNF is lead funder
        isNovoLeadFunder() {
            const funders = Object.values(get().initiative?._funders ?? [])
                .filter(
                    funder => funder.Type__c === constants.TYPES.LEAD_FUNDER
                )
                .filter(
                    funder => funder.Account__c === constants.IDS.NNF_ACCOUNT
                );
            return funders?.length > 0;
        },
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
                        // ...state.initiative._reportDetails,
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

            const { data } = await ew.get({
                path: 'initiative/initiative',
                params: { id, expand: true },
            });

            // Update state
            set(state => ({
                initiative: {
                    ...state.initiative,
                    ...data,
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
