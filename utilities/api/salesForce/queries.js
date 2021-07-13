const queries = {
    account: {
        allGrantees() {
            return `SELECT Id, Name FROM Account WHERE RecordType.Name = 'Grantee'`;
        },
        allFoundations() {
            return `SELECT Id, Name FROM Account WHERE RecordType.Name = 'Foundation'`;
        },
        allOrganisations() {
            return `SELECT Id, Name FROM Account WHERE RecordType.Name = 'Organization'`;
        },
    },
    user: {
        getUser(id) {
            return `SELECT Id, Name, User_Account_Type__c, AccountId FROM User WHERE Id = '${id}'`;
        },
    },
    initiative: {
        _query: `SELECT Id, Configuration_Type__c, LastModifiedDate, CreatedById, Name, Situation_Today__c, Approach_Thinking__c, Problem_Effect__c, toLabel(Problem_Effect__c) Translated_Problem_Effect__c, Problem_Resolutions__c, Problem_Causes__c, Ultimate_Outcome__c, Stage__c, toLabel(Stage__c) Translated_Stage__c, Where_Is_Problem__c, toLabel(Where_Is_Problem__c) Translated_Where_Is_Problem__c, Who_Effect__c, Why_Problem_Solving__c, Lead_Grantee__r.Name, Initiator_Foundation__r.Name, Access_Level__c, toLabel(Access_Level__c) Translated_Access_Level__c, Hero_Image_URL__c, Summary__c, Application_Id__c, Grant_Start_Date__c, Grant_End_Date__c, Category__c, toLabel(Category__c) Translated_Category__c, Subcategory__c, toLabel(Subcategory__c) Translated_Subcategory__c, Collaborators__c, Partners__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess FROM Initiative__c`,
        get(id) {
            return `${this._query} WHERE Id = '${id}'`;
        },
        getMultiple(ids) {
            return `${this._query} WHERE Id IN ('${ids.join("','")}')`;
        },
    },
    initiativeFunder: {
        _query: `SELECT Id, Name, CurrencyIsoCode, CreatedById, CreatedDate, LastModifiedDate, LastModifiedById, Initiative__c, Account__c, Account__r.Name, Account__r.Id, Application_ID__c, Grant_Start_Date__c, Grant_End_Date__c, Approval_Date__c, Amount__c, Type__c,  toLabel(Type__c) Translated_Type__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess FROM Initiative_Funder__c`,
        get(id) {
            return `${this._query} WHERE Id = '${id}'`;
        },
        getAll(initiativeId) {
            return `${this._query} WHERE Initiative__c = '${initiativeId}'`;
        },
        getAllMultiple(initiativeIds) {
            return `${
                this._query
            } WHERE Initiative__c IN ('${initiativeIds.join("','")}')`;
        },
    },
    initiativeCollaborator: {
        _query: `SELECT Id, Name, CreatedById, CreatedDate, LastModifiedDate, LastModifiedById, Initiative__c, Account__c, Account__r.Name, Description__c, Start_Date__c, End_Date__c, Type__c, toLabel(Type__c) Translated_Type__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess FROM Initiative_Collaborator__c`,
        get(id) {
            return `${this._query} WHERE Id = '${id}'`;
        },
        getAll(initiativeId) {
            return `${this._query} WHERE Initiative__c = '${initiativeId}'`;
        },
        getAllMultiple(initiativeIds) {
            return `${
                this._query
            } WHERE Initiative__c IN ('${initiativeIds.join("','")}')`;
        },
    },
    initiativeEmployeeFunded: {
        _query: `SELECT Id, Name, CreatedById, CreatedDate, LastModifiedDate, LastModifiedById, Initiative__c, Gender__c, toLabel(Gender__c) Translated_Gender__c, Gender_Other__c, Role_Type__c, toLabel(Role_Type__c) Translated_Role_Type__c, Job_Title__c, Percent_Involvement__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess FROM Initiative_Employee_Funded__c`,
        get(id) {
            return `${this._query} WHERE Id = '${id}'`;
        },
        getAll(initiativeId) {
            return `${this._query} WHERE Initiative__c = '${initiativeId}'`;
        },
        getAllMultiple(initiativeIds) {
            return `${
                this._query
            } WHERE Initiative__c IN ('${initiativeIds.join("','")}')`;
        },
    },
    initiativeReport: {
        _query: `SELECT Id, Summary_Of_Initiative_Risks__c, Exported_Report_URL__c, Initiative__c, CreatedById, LastModifiedDate, Name, Report_Viewer_Version__c, Project_Purpose__c, Progress_Towards_Grant_Area_Themes__c, Important_Results__c, Post_Project_Activities__c, Summary_Of_Activities__c, Summary_Of_Challenges_And_Learnings__c, Executive_Summary__c, Funder_Report__c, Funder_Report__r.Account__r.Name, Funder_Report__r.Account__r.Id, Funder_Report__r.Application_ID__c, Report_Type__c, Report_Period_Start_Date__c, Report_Period_End_Date__c, Status__c, toLabel(Status__c) Translated_Status__c, Due_Date__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess FROM Initiative_Report__c`,
        get(id) {
            return `${this._query} WHERE Id = '${id}'`;
        },
        getMultiple(ids) {
            return `${this._query} WHERE Id IN ('${ids.join("','")}')`;
        },
        getAll(initiativeId) {
            return `${this._query} WHERE Initiative__c = '${initiativeId}'`;
        },
    },

    initiativeGoal: {
        _query: `SELECT Id, Name, CreatedById, CreatedDate, LastModifiedDate, LastModifiedById, Initiative__c, KPI_Category__c, toLabel(KPI_Category__c) Translated_KPI_Category__c, Funder_Objective__c, toLabel(Funder_Objective__c) Translated_Funder_Objective__c, Type__c, toLabel(Type__c) Translated_Type__c, Goal__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess FROM Initiative_Goal__c`,
        get(id) {
            return `${this._query} WHERE Id = '${id}'`;
        },
        getAll(initiativeId) {
            return `${this._query} WHERE Initiative__c = '${initiativeId}'`;
        },
        getAllMultiple(initiativeIds) {
            return `${
                this._query
            } WHERE Initiative__c IN ('${initiativeIds.join("','")}')`;
        },
    },
    initiativeActivity: {
        _query: `SELECT Id, Activity_Tag__c, Additional_Location_Information__c, Initiative_Location__c, Publication_DOI__c, Publication_Author__c, Publication_Publisher__c, Publication_Title__c, Publication_Year__c, Publication_Type__c, Dissemination_Method__c, Audience_Tag__c, CreatedById, Things_To_Do__c, Activity_Type__c, Things_To_Do_Description__c, Problem_Resolutions__c, Measurement__c, Access_Level__c, toLabel(Access_Level__c) Translated_Access_Level__c, Initiative__c, Activity_Position__c, KPI_Category__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess, (SELECT Id, Name, Target__c, Current_Status__c, Progress__c, Current_Status_Last_Modified_Date__c, KPI__c, toLabel(KPI__c) Translated_KPI__c, KPI_Category__c, toLabel(KPI_Category__c) Translated_KPI_Category__c, SDG__c, toLabel(SDG__c) Translated_SDG__c, SDG_Target__c, toLabel(SDG_Target__c) Translated_SDG_Target__c, SDG_Indicator__c, toLabel(SDG_Indicator__c) Translated_SDG_Indicator__c FROM Initiative_Activity_Success_Metrics__r) FROM Initiative_Activity__c`,
        get(id) {
            return `${this._query} WHERE Id = '${id}'`;
        },
        getAll(initiativeId) {
            return `${this._query} WHERE Initiative__c = '${initiativeId}'`;
        },
        getAllMultiple(initiativeIds) {
            return `${
                this._query
            } WHERE Initiative__c IN ('${initiativeIds.join("','")}')`;
        },
    },
    initiativeActivityGoal: {
        _query: `SELECT Id, Name, Initiative_Goal__r.Goal__c, CreatedById, CreatedDate, LastModifiedDate, LastModifiedById, Initiative_Activity__c, Initiative_Goal__c, Position__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess FROM Initiative_Activity_Goal__c`,
        get(id) {
            return `${this._query} WHERE Id = '${id}' ORDER BY Initiative_Activity__r.Name`;
        },
        getMultiple(ids) {
            return `${this._query} WHERE Id IN ('${ids.join(
                "','"
            )}') ORDER BY Initiative_Activity__r.Name`;
        },
        getAll(initiativeId) {
            return `${this._query} WHERE Initiative_Activity__r.Initiative__c = '${initiativeId}' ORDER BY Initiative_Activity__r.Name`;
        },
        getAllMultiple(initiativeIds) {
            return `${
                this._query
            } WHERE Initiative_Activity__r.Initiative__c IN ('${initiativeIds.join(
                "','"
            )}')`;
        },
    },
    initiativeActivitySuccessMetric: {
        _query: `SELECT Id, Gender__c, Gender_Other__c, Highest_Age__c, Lowest_Age__c, CreatedById, Initiative_Activity__c, LastModifiedDate, Name, Type__c, Target__c, Current_Status__c, Progress__c, Current_Status_Last_Modified_Date__c, KPI__c, toLabel(KPI__c) Translated_KPI__c, KPI_Category__c, toLabel(KPI_Category__c) Translated_KPI_Category__c, SDG__c, toLabel(SDG__c) Translated_SDG__c, SDG_Target__c, toLabel(SDG_Target__c) Translated_SDG_Target__c, SDG_Indicator__c, toLabel(SDG_Indicator__c) Translated_SDG_Indicator__c, Initiative_Activity__r.Name, Initiative_Activity__r.Problem_Resolutions__c, Initiative_Activity__r.Initiative__r.Problem_Resolutions__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess FROM Initiative_Activity_Success_Metric__c`,
        get(id) {
            return `${this._query} WHERE Id = '${id}' ORDER BY Initiative_Activity__r.Name`;
        },
        getMultiple(ids) {
            return `${this._query} WHERE Id IN ('${ids.join(
                "','"
            )}') ORDER BY Initiative_Activity__r.Name`;
        },
        getAll(initiativeId) {
            return `${this._query} WHERE Initiative_Activity__r.Initiative__c = '${initiativeId}' ORDER BY Initiative_Activity__r.Name, Current_Status_Last_Modified_Date__c`;
        },
        getAllMultiple(initiativeIds) {
            return `${
                this._query
            } WHERE Initiative_Activity__r.Initiative__c IN ('${initiativeIds.join(
                "','"
            )}')`;
        },
    },
    initiativeReportDetail: {
        _query: `SELECT Id, Initiative_Report__c, Initiative_Report__r.Initiative__c, CreatedById, LastModifiedDate, Type__c, toLabel(Type__c) Translated_Type__c, Description__c, Problem_Resolutions__c, URL__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess, (SELECT Id, CreatedById, LastModifiedDate, Initiative_Activity__c, Type__c, toLabel(Type__c) Translated_Type__c, Initiative_Update__c FROM Initiative_Report_Detail_Entries__r), Type_Of_Influence__c, Who_Is_Evaluating__c, toLabel(Who_Is_Evaluating__c) Translated_Who_Is_Evaluating__c, Initiative_Employee_Funded__c, Initiative_Funder__c, Initiative_Collaborator__c, Initiative_Activity__c FROM Initiative_Report_Detail__c`,
        get(id) {
            return `${this._query} WHERE Id = '${id}'`;
        },
        getMultiple(ids) {
            return `${this._query} WHERE Id IN ('${ids.join(
                "','"
            )}') ORDER BY Initiative_Activity__r.Name`;
        },
        getAll(initiativeId) {
            return `${this._query} WHERE Initiative_Activity__r.Initiative__c = '${initiativeId}' ORDER BY Initiative_Activity__r.Name`;
        },
        getAllReport(reportId) {
            return `${this._query} WHERE Initiative_Report__c = '${reportId}' ORDER BY Initiative_Activity__r.Name`;
        },
        getAllReportMultiple(reportIds) {
            return `${
                this._query
            } WHERE Initiative_Report__c IN ('${reportIds.join(
                "','"
            )}') ORDER BY Initiative_Activity__r.Name`;
        },
    },
    initiativeUpdate: {
        _query: `SELECT Id, Name, CreatedById, CreatedDate, LastModifiedDate, CurrencyIsoCode, (SELECT Id, URL__c, Type__c FROM Initiative_Update_Content__r), Description__c, Type__c, Access_Level__c, Initiative_Activity__c, Initiative_Activity__r.Things_To_Do__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess FROM Initiative_Update__c`,
        get(id) {
            return `${this._query} WHERE Id = '${id}'`;
        },
        getAll(initiativeId) {
            // return `${this._query} WHERE Initiative__c = '${initiativeId}' ORDER BY Current_Status_Last_Modified_Date__c`;
            return `${this._query} WHERE Initiative__c = '${initiativeId}' ORDER BY LastModifiedDate DESC`;
        },
    },
    reports: {
        _query: `SELECT Id, Initiative__c, Initiative__r.Category__c, Initiative__r.Application_Id__c, Initiative__r.Name, Initiative__r.Lead_Grantee__r.Name, Funder_Report__r.Account__r.Id, Funder_Report__r.Account__r.Name, Funder_Report__r.Application_ID__c, CreatedById, LastModifiedDate, Name, Status__c, toLabel(Status__c) Translated_Status__c, Due_Date__c, Executive_Summary__c, UserRecordAccess.HasReadAccess, UserRecordAccess.HasEditAccess, UserRecordAccess.HasDeleteAccess, Funder_Report__c, Report_Type__c, toLabel(Report_Type__c) Translated_Report_Type__c, Report_Period_End_Date__c ,Report_Period_Start_Date__c, Report_Viewer_Version__c FROM Initiative_Report__c`,
        getAll() {
            return `${this._query} ORDER BY Initiative__c, Due_Date__c`;
        },
    },
    // S
};

export { queries };
