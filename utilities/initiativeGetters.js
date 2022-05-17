function initiativeGetters(getter, constants) {
    return {
        initiative: {
            // Returns object
            get() {
                return getter().initiative;
            },
        },
        activities: {
            // Returns object
            get(id) {
                return getter().initiative._activities[id] || {};
            },
            // Returns array
            getAll() {
                return Object.values(getter().initiative._activities);
            },
            // Returns array
            getTypeIntervention() {
                return Object.values(getter().initiative._activities).filter(
                    item =>
                        constants.ACTIVITIES.ACTIVITY_INTERVENTION ===
                        item.Activity_Type__c
                );
            },
            // Returns array
            getTypeDissemination() {
                return Object.values(getter().initiative._activities).filter(
                    item =>
                        constants.ACTIVITIES.ACTIVITY_DISSEMINATION ===
                        item.Activity_Type__c
                );
            },
        },
        activityGoals: {
            // Returns array
            getFromActivityId(activityId) {
                return Object.values(getter().initiative._activityGoals).filter(
                    item => item.Initiative_Activity__c === activityId
                );
            },
        },
        activitySuccessMetrics: {
            // Returns object
            get(id) {
                return getter().initiative._activitySuccessMetrics[id] || {};
            },
            // Returns array
            getFromActivityId(activityId) {
                return Object.values(
                    getter().initiative._activitySuccessMetrics
                ).filter(item => item.Initiative_Activity__c === activityId);
            },
            // Returns array
            getTypePredefinedFromActivityId(activityId) {
                return this.getFromActivityId(activityId).filter(
                    item =>
                        item.Type__c ===
                        constants.ACTIVITY_SUCCESS_METRICS.INDICATOR_PREDEFINED
                );
            },
            // Returns array
            getTypeCustomFromActivityId(activityId) {
                return this.getFromActivityId(activityId).filter(
                    item =>
                        item.Type__c ===
                        constants.ACTIVITY_SUCCESS_METRICS.INDICATOR_CUSTOM
                );
            },
        },
        collaborators: {
            // Returns object
            get(id) {
                return getter().initiative._collaborators[id] || {};
            },
            // Returns array
            getAll() {
                return Object.values(getter().initiative._collaborators);
            },
            // Returns object
            getAllAsDictionary() {
                return getter().initiative._collaborators;
            },
            // Returns object
            getTypeMain() {
                return (
                    Object.values(getter().initiative._collaborators).find(
                        item =>
                            item.Type__c ===
                            constants.COLLABORATORS.MAIN_COLLABORATOR
                    ) || {}
                );
            },
            // Returns array
            getTypeAdditional() {
                return Object.values(
                    getter().initiative._collaborators
                ).filter(item =>
                    constants.COLLABORATORS.ADDITIONAL_COLLABORATORS.includes(
                        item.Type__c
                    )
                );
            },
            // Returns array
            getTypeApplicantsAll() {
                return Object.values(
                    getter().initiative._collaborators
                ).filter(item =>
                    constants.COLLABORATORS.APPLICANTS_ALL.includes(
                        item.Type__c
                    )
                );
            },
            // Returns array
            getTypeApplicantsCreate() {
                return Object.values(
                    getter().initiative._collaborators
                ).filter(item =>
                    constants.COLLABORATORS.APPLICANTS_CREATE.includes(
                        item.Type__c
                    )
                );
            },
        },
        employeesFunded: {
            // Returns object
            get(id) {
                return getter().initiative._employeesFunded[id] || {};
            },
            // Returns array
            getAll() {
                return Object.values(getter().initiative._employeesFunded);
            },
        },
        funders: {
            // Returns object
            get(id) {
                return getter().initiative._funders[id] || {};
            },
            // Returns array
            getAll() {
                return Object.values(getter().initiative._funders);
            },
            // Returns object
            getAllAsDictionary() {
                return getter().initiative._funders;
            },
            // Returns object
            getFromAccountId(accountId) {
                return (
                    Object.values(getter().initiative._funders).find(
                        funder => funder.Account__c === accountId
                    ) || {}
                );
            },
        },
        goals: {
            // Returns object
            get(id) {
                return getter().initiative._goals[id] || {};
            },
            // Returns object
            getTypePredefined() {
                return (
                    Object.values(getter().initiative._goals).find(
                        item => item.Type__c === constants.GOALS.GOAL_PREDEFINED
                    ) || {}
                );
            },
            // Returns array
            getTypeCustom() {
                return Object.values(getter().initiative._goals).filter(item =>
                    constants.GOALS.GOAL_CUSTOM.includes(item.Type__c)
                );
            },
        },
        reportDetailEntries: {},
        reportDetailGoals: {},
        reportDetails: {
            // Returns object
            get(id) {
                return getter().initiative._reportDetails[id] || {};
            },
            // Returns array
            getFromReportId(reportId) {
                return Object.values(getter().initiative._reportDetails).filter(
                    item => item.Initiative_Report__c === reportId
                );
            },
            // Returns array
            getTypeInfluenceOnPolicy() {
                return Object.values(getter().initiative._reportDetails).filter(
                    item =>
                        item.Type__c ===
                        constants.REPORT_DETAILS.INFLUENCE_ON_POLICY
                );
            },
            // Returns array
            getTypeEvaluation() {
                return Object.values(getter().initiative._reportDetails).filter(
                    item => item.Type__c === constants.REPORT_DETAILS.EVALUATION
                );
            },
            // Returns array
            getTypeInfluenceOnPolicyFromReportId(reportId) {
                return this.getFromReportId(reportId).filter(
                    item =>
                        item.Type__c ===
                        constants.REPORT_DETAILS.INFLUENCE_ON_POLICY
                );
            },
            // Returns array
            getTypeEvaluationFromReportId(reportId) {
                return this.getFromReportId(reportId).filter(
                    item => item.Type__c === constants.REPORT_DETAILS.EVALUATION
                );
            },
            // Returns object
            getTypeEmployeesFundedFromReportId(reportId) {
                return (
                    this.getFromReportId(reportId).find(
                        item =>
                            item.Type__c ===
                            constants.REPORT_DETAILS.EMPLOYEES_FUNDED_OVERVIEW
                    ) || {}
                );
            },
        },
        reports: {
            // Returns object
            get(id) {
                return getter().initiative._reports[id] || {};
            },
            // Returns array
            getFromFunderId(funderId) {
                return Object.values(getter().initiative._reports).filter(
                    item => item.Funder_Report__c === funderId
                );
            },
        },
        updateContents: {
            // Returns object
            getFromUpdateId(initiativeUpdateId) {
                return (
                    Object.values(getter().initiative._updateContents).find(
                        item => item.Initiative_Update__c === initiativeUpdateId
                    ) || {}
                );
            },
        },
        updates: {
            // Returns object
            get(id) {
                return getter().initiative._updates[id] || {};
            },
            // Returns array
            getTypeLogbookUpdate() {
                return Object.values(getter().initiative._updates).filter(
                    item =>
                        item.Type__c === constants.REPORT_DETAILS.LOGBOOK_UPDATE
                );
            },
        },
    };
}

export default initiativeGetters;
