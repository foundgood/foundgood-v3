const limit = 100;

const queries = {
    getObjectById: {
        initiative(id) {
            return `SELECT+Id,+LastModifiedDate,+CreatedById,+Name,+Situation_Today__c,+Approach_Thinking__c,+Problem_Effect__c,+toLabel(Problem_Effect__c)+Translated_Problem_Effect__c,+Problem_Resolutions__c,+Problem_Causes__c,+Ultimate_Outcome__c,+Stage__c,+toLabel(Stage__c)+Translated_Stage__c,+Where_Is_Problem__c,+toLabel(Where_Is_Problem__c)+Translated_Where_Is_Problem__c,+Who_Effect__c,+Why_Problem_Solving__c,+Lead_Grantee__r.Name,+Initiator_Foundation__r.Name,+Access_Level__c,+toLabel(Access_Level__c)+Translated_Access_Level__c,+Hero_Image_URL__c,+Summary__c,+Application_Id__c,+Grant_Start_Date__c,+Grant_End_Date__c,+Category__c,+toLabel(Category__c)+Translated_Category__c,+Subcategory__c,+toLabel(Subcategory__c)+Translated_Subcategory__c,+Collaborators__c,+Partners__c,+UserRecordAccess.HasReadAccess,+UserRecordAccess.HasEditAccess,+UserRecordAccess.HasDeleteAccess+FROM+Initiative__c+WHERE+Id+=+'${id}'`;
        },
        initiativeUpdate(id) {
            return `SELECT+Id,+CreatedById,+LastModifiedDate,+Description__c,+Access_Level__c,+toLabel(Access_Level__c)+Translated_Access_Level__c,+Initiative__c,+Initiative_Activity__c,++UserRecordAccess.HasReadAccess,+UserRecordAccess.HasEditAccess,+UserRecordAccess.HasDeleteAccess,+Type__c,+toLabel(Type__c)+Translated_Type__c,+Initiative_Activity_Success_Metric__c,+Initiative_Activity_Success_Metric__r.SDG__c,+Initiative_Activity_Success_Metric__r.SDG_Target__c,+Initiative_Activity_Success_Metric__r.SDG_Indicator__c,+Success_Metric_Name__c,+Success_Metric_Current_Status__c,+Success_Metric_Target__c,+Success_Metric_Progress__c,+(SELECT+Id,+URL__c,+Type__c+FROM+Initiative_Update_Content__r)+FROM+Initiative_Update__c+WHERE+Id+=+'${id}'`;
        },
        initiativeActivity(id) {
            return `SELECT+Id,+CreatedById,+Things_To_Do__c,+Things_To_Do_Description__c,+Problem_Resolutions__c,+Measurement__c,+Access_Level__c,+toLabel(Access_Level__c)+Translated_Access_Level__c,+Initiative__c,+Activity_Position__c,+UserRecordAccess.HasReadAccess,+UserRecordAccess.HasEditAccess,+UserRecordAccess.HasDeleteAccess,+(SELECT+Id,+Name,+Target__c,+Current_Status__c,+Progress__c,+Current_Status_Last_Modified_Date__c,+KPI__c,+toLabel(KPI__c)+Translated_KPI__c,+KPI_Category__c,+toLabel(KPI_Category__c)+Translated_KPI_Category__c,+SDG__c,+toLabel(SDG__c)+Translated_SDG__c,+SDG_Target__c,+toLabel(SDG_Target__c)+Translated_SDG_Target__c,+SDG_Indicator__c,+toLabel(SDG_Indicator__c)+Translated_SDG_Indicator__c+FROM+Initiative_Activity_Success_Metrics__r)+FROM+Initiative_Activity__c+WHERE+Id+=+'${id}'`;
        },
        account(id) {
            return `SELECT+Id,+Name,+Location__c,+toLabel(Location__c)+Translated_Location__c,+Mission__c,+Account_Logo_URL__c,+Account_Profile_Image_URL__c+FROM+Account+WHERE+Id+=+'${id}'`;
        },
        initiativeReport(id) {
            return `SELECT+Id,+CreatedById,+LastModifiedDate,+Name,+Status__c,+toLabel(Status__c)+Translated_Status__c,+Due_Date__c,+Executive_Summary__c,+UserRecordAccess.HasReadAccess,+UserRecordAccess.HasEditAccess,+UserRecordAccess.HasDeleteAccess+FROM+Initiative_Report__c+WHERE+Id+=+'${id}'`;
        },
    },
    getObjectList: {
        account(offset = 0) {
            return `SELECT+Id,+Name,+Location__c,+toLabel(Location__c)+Translated_Location__c,+Mission__c,+Account_Logo_URL__c,+Account_Profile_Image_URL__c+FROM+Account+ORDER+BY+LastModifiedDate+DESC+LIMIT+${limit}+OFFSET+${offset}`;
        },
        initiativeUpdate(offset = 0) {
            return `SELECT+Id,+CreatedById,+LastModifiedDate,+Description__c,+Access_Level__c,+toLabel(Access_Level__c)+Translated_Access_Level__c,+Initiative__c,+Initiative_Activity__c,+UserRecordAccess.HasReadAccess,+UserRecordAccess.HasEditAccess,+UserRecordAccess.HasDeleteAccess,+Type__c,+toLabel(Type__c)+Translated_Type__c,+Initiative_Activity_Success_Metric__c,+Initiative_Activity_Success_Metric__r.SDG__c,+Initiative_Activity_Success_Metric__r.SDG_Target__c,+Initiative_Activity_Success_Metric__r.SDG_Indicator__c,+Success_Metric_Name__c,+Success_Metric_Current_Status__c,+Success_Metric_Target__c,+Success_Metric_Progress__c,+(SELECT+Id,+URL__c,+Type__c+FROM+Initiative_Update_Content__r)+FROM+Initiative_Update__c+ORDER+BY+LastModifiedDate+DESC+LIMIT+${limit}+OFFSET+${offset}`;
        },
    },
    getChildObjectListByParentId: {
        initiativeUpdate(id, offset = 0) {
            return `SELECT+Id,+CreatedById,+LastModifiedDate,+Description__c,+Access_Level__c,+toLabel(Access_Level__c)+Translated_Access_Level__c,+Initiative__c,+Initiative_Activity__c,+UserRecordAccess.HasReadAccess,+UserRecordAccess.HasEditAccess,+UserRecordAccess.HasDeleteAccess,+Type__c,+toLabel(Type__c)+Translated_Type__c,+Initiative_Activity_Success_Metric__c,+Initiative_Activity_Success_Metric__r.SDG__c,+Initiative_Activity_Success_Metric__r.SDG_Target__c,+Initiative_Activity_Success_Metric__r.SDG_Indicator__c,+Success_Metric_Name__c,+Success_Metric_Current_Status__c,+Success_Metric_Target__c,+Success_Metric_Progress__c,+(SELECT+Id,+URL__c,+Type__c+FROM+Initiative_Update_Content__r)+FROM+Initiative_Update__c+WHERE+Initiative__c+=+'${id}'+ORDER+BY+LastModifiedDate+DESC+LIMIT+${limit}+OFFSET+${offset}`;
        },
        initiativeActivity(id, offset = 0) {
            return `SELECT+Id,+CreatedById,+Things_To_Do__c,+Things_To_Do_Description__c,+Problem_Resolutions__c,+Measurement__c,+Access_Level__c,+toLabel(Access_Level__c)+Translated_Access_Level__c,+Initiative__c,+Activity_Position__c,+UserRecordAccess.HasReadAccess,+UserRecordAccess.HasEditAccess,+UserRecordAccess.HasDeleteAccess,+(SELECT+Id,+Name,+Target__c,+Current_Status__c,+Progress__c,+Current_Status_Last_Modified_Date__c,++KPI__c,+toLabel(KPI__c)+Translated_KPI__c,+KPI_Category__c,+toLabel(KPI_Category__c)+Translated_KPI_Category__c,+SDG__c,+toLabel(SDG__c)+Translated_SDG__c,+SDG_Target__c,+toLabel(SDG_Target__c)+Translated_SDG_Target__c,+SDG_Indicator__c,+toLabel(SDG_Indicator__c)+Translated_SDG_Indicator__c+FROM+Initiative_Activity_Success_Metrics__r)+FROM+Initiative_Activity__c+WHERE+Initiative__c+=+'${id}'+ORDER+BY+CreatedDate+DESC+LIMIT+${limit}+OFFSET+${offset}`;
        },
        initiativeTeamMember(id, offset = 0) {
            return `SELECT+Id,+CreatedById,+User__c,+Team_Member_Role__c,+toLabel(Team_Member_Role__c)+Translated_Team_Member_Role__c,+Account__c,+Account_Type__c,+Initiative__c+FROM+Initiative_Team_Member__c+WHERE+Initiative__c+=+'${id}'+ORDER+BY+LastModifiedDate+DESC+LIMIT+${limit}+OFFSET+${offset}`;
        },
        initiativeReport(id, offset = 0) {
            return `SELECT+Id,+CreatedById,+LastModifiedDate,+Name,+Status__c,+toLabel(Status__c)+Translated_Status__c,+Due_Date__c,+Executive_Summary__c,+UserRecordAccess.HasReadAccess,+UserRecordAccess.HasEditAccess,+UserRecordAccess.HasDeleteAccess+FROM+Initiative_Report__c+WHERE+Initiative__c+=+'${id}'+ORDER+BY+Due_Date__c+LIMIT+${limit}+OFFSET+${offset}`;
        },
        initiativeReportDetail(id, offset = 0) {
            return `SELECT+Id,+Initiative_Report__c,+CreatedById,+LastModifiedDate,+Type__c,+toLabel(Type__c)+Translated_Type__c,+Description__c,+Problem_Resolutions__c,+URL__c,+UserRecordAccess.HasReadAccess,+UserRecordAccess.HasEditAccess,+UserRecordAccess.HasDeleteAccess,+(SELECT+Id,+CreatedById,+LastModifiedDate,+Initiative_Activity__c,+Type__c,+toLabel(Type__c)+Translated_Type__c+FROM+Initiative_Report_Detail_Entries__r)+FROM+Initiative_Report_Detail__c+WHERE+Initiative_Report__c=+'{{initiativeReportId}}'+LIMIT+${limit}+OFFSET+${offset}`;
        },
    },
    getGrandChildObjectListByGrandParentId: {
        initiativeActivitySuccessMetric(id, offset = 0) {
            return `SELECT+Id,+CreatedById,+LastModifiedDate,+Name,+Target__c,+Current_Status__c,+Progress__c,+Current_Status_Last_Modified_Date__c,+KPI__c,+toLabel(KPI__c)+Translated_KPI__c,+KPI_Category__c,+toLabel(KPI_Category__c)+Translated_KPI_Category__c,+SDG__c,+toLabel(SDG__c)+Translated_SDG__c,+SDG_Target__c,+toLabel(SDG_Target__c)+Translated_SDG_Target__c,+SDG_Indicator__c,+toLabel(SDG_Indicator__c)+Translated_SDG_Indicator__c,+Initiative_Activity__r.Name,+Initiative_Activity__r.Problem_Resolutions__c,+Initiative_Activity__r.Initiative__r.Problem_Resolutions__c,+UserRecordAccess.HasReadAccess,+UserRecordAccess.HasEditAccess,+UserRecordAccess.HasDeleteAccess+FROM+Initiative_Activity_Success_Metric__c+WHERE+Initiative_Activity__r.Initiative__c+=+'${id}'+ORDER+BY+Initiative_Activity__r.Name,+Current_Status_Last_Modified_Date__c+DESC+LIMIT+${limit}+OFFSET+${offset}`;
        },
    },
};

export { queries };
