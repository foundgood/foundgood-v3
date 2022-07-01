// Packages
import create from 'zustand';
import _get from 'lodash.get';
import _set from 'lodash.set';
import _unset from 'lodash.unset';

// Utilities
import initiativeGetters from 'utilities/initiativeGetters';
import { authStore } from 'utilities/store';
import ew from 'utilities/api/elseware';

function _updateAuth() {
    const { getState } = authStore;
    getState().updateUserTimeout();
}

const defaultInitiative = {
    _activities: {},
    _activityEmployees: {},
    _activityGoals: {},
    _activityRegulations: {},
    _activitySuccessMetrics: {},
    _collaborators: {},
    _employeesFunded: {},
    _funders: {},
    _goals: {},
    _reportDetailEntries: {},
    _reportDetailGoals: {},
    _reportDetails: {},
    _reports: {},
    _resultActivities: {},
    _resultGoals: {},
    _results: {},
    _tags: {},
    _teamMembers: {},
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

        INTERVENTION: 'Intervention',
        DISSEMINATION: 'Dissemination',
        TEAM_EDUCATION: 'Team education',
        EVALUATION: 'Evaluation',
        ENGAGEMENT: 'Engagement',
        PHYSICAL: 'Physical',
    },
    ACTIVITY_GOALS: {},
    ACTIVITY_SUCCESS_METRICS: {
        INDICATOR_CUSTOM: 'Custom',
        INDICATOR_PREDEFINED: 'People',
        INDICATOR_GENDER_OTHER: 'Other',

        CUSTOM: 'Custom',
        PEOPLE: 'People',
        FINANCIAL: 'Financial',
    },
    COLLABORATORS: {
        MAIN_COLLABORATOR: 'Main applicant',
        CO_APPLICANT: 'Co applicant',
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
        ACHIEVEMENT: 'Achievement',
        LEARNING: 'Learning',
        CHALLENGE: 'Challenge',
        OUTCOME: 'Outcome',
        DOCUMENT: 'Document',
        FUNDER_OVERVIEW: 'Funder Overview',
        COLLABORATOR_OVERVIEW: 'Collaborator Overview',
        EMPLOYEES_FUNDED_OVERVIEW: 'Employees Funded Overview',
        ACTIVITY_OVERVIEW: 'Activity Overview',
        EVALUATION: 'Evaluation',
        INFLUENCE_ON_POLICY: 'Influence On Policy',
        UPDATE_OVERVIEW: 'Update Overview',
        RESULTS: 'Results',
        GOAL: 'Goal',

        LOGBOOK_UPDATE: 'Update', // Update overview?
    },
    REPORTS: {
        REPORT_NOT_STARTED: 'Not started',
        REPORT_IN_PROGRESS: 'In progress',
        REPORT_IN_REVIEW: 'In review',
        REPORT_PUBLISHED: 'Published',
    },
    RESULTS: {
        CUSTOM_OUTPUT: 'Custom Output',
        CUSTOM_OUTCOME: 'Custom Outcome',
        RESEARCH: 'Research',
        KNOWLEDGE: 'Knowledge',
        INFLUENCE_ON_POLICY: 'Influence On Policy',
        INNOVATION: 'Innovation',
    },
    TAGS: {
        COLLECTION: 'Collection',
        GOAL: 'Goal',
        FUNDER: 'Funder',
        ACTIVITY: 'Activity',
        DISSEMINATION_ACTIVITY: 'Dissemination Activity',
        GENERAL_ACTIVITY: 'General Activity',
        PHYSICAL_ACTIVITY: 'Physical Activity',
        TEAM_EDUCATION_ACTIVITY: 'Team Education Activity',
        ENGAGEMENT_ACTIVITY: 'Engagement Activity',
        EMPLOYEE_FUNDED: 'Employee Funded',
        EVALUATION: 'Evaluation',
        SUCCESS_METRIC: 'Success Metric',
        SUCCESS_METRIC_PEOPLE: 'Success Metric People',
        SUCCESS_METRIC_CUSTOM: 'Success Metric Custom',
        SUCCESS_METRIC_FINANCIAL: 'Success Metric Financial',
    },
    UPDATE_CONTENTS: {},
    UPDATES: {
        LOGBOOK_TYPE_METRICS: 'Success Metric Update',
        LOGBOOK_TYPE_UPDATE: 'Update',
    },
    IDS: {
        NNF_ACCOUNT: process.env.NEXT_PUBLIC_NNF_ACCOUNT,
    },
    CUSTOM: {
        NO_REFLECTIONS: '__NO__REFLECTIONS__',
    },
};

const useInitiativeDataStore = create((set, get) => ({
    CONSTANTS: { ...constants },

    initiative: { ...defaultInitiative },

    utilities: {
        ...initiativeGetters(get, constants),

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
            const funders = Object.values(get().initiative._funders ?? [])
                .filter(
                    funder => funder.Type__c === constants.FUNDERS.LEAD_FUNDER
                )
                .filter(
                    funder => funder.Account__c === constants.IDS.NNF_ACCOUNT
                );
            return funders?.length > 0;
        },
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
            initiative: defaultInitiative,
        }));
    },
}));

export { useInitiativeDataStore };
