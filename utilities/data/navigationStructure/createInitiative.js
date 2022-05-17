const d = {
    introduction: {
        title: 'Introduction',
        baseUrl: 'introduction',
        visible: false,
        hideBack: true,
    },
    context: {
        title: '',
        visible: true,
        showChildrenOnly: true,
        items: [],
    },
    nameAndCategory: {
        baseUrl: 'name-and-category',
        url(initiativeId) {
            return `/create/${initiativeId}/name-and-category`;
        },
        title: 'InitiativeViewNameAndCategoryHeading',
        labels: {
            form: {
                title: 'InitiativeWizardNameAndCategoryHeading',
                preamble: 'InitiativeWizardNameAndCategorySubheading',
            },
            help: {
                why: 'InitiativeWizardNameAndCategoryHelpWhy',
                what: 'InitiativeWizardNameAndCategoryHelpWhat',
                guide: 'InitiativeWizardNameAndCategoryHelpGuide',
            },
        },
    },
    organisationsInvolved: {
        baseUrl: 'organisations-involved',
        url(initiativeId) {
            return `/create/${initiativeId}/organisations-involved`;
        },
        title: 'InitiativeViewOrganisationsInvolvedHeading',
        labels: {
            form: {
                title: 'InitiativeWizardOrganisationsInvolvedHeading',
                preamble: 'InitiativeWizardOrganisationsInvolvedSubheading',
            },
            help: {
                why: 'InitiativeWizardOrganisationsInvolvedHelpWhy',
                what: 'InitiativeWizardOrganisationsInvolvedHelpWhat',
                guide: 'InitiativeWizardOrganisationsInvolvedHelpGuide',
            },
        },
    },
    shareWithContacts: {
        baseUrl: 'share-with-contacts',
        url(initiativeId) {
            return `/create/${initiativeId}/share-with-contacts`;
        },
        title: 'InitiativeViewShareWithContactsHeading',
        labels: {
            form: {
                title: 'InitiativeWizardShareWithContactsHeading',
                preamble: 'InitiativeWizardShareWithContactsSubheading',
            },
            help: {
                why: 'InitiativeWizardShareWithContactsHelpWhy',
                what: 'InitiativeWizardShareWithContactsHelpWhat',
                guide: 'InitiativeWizardShareWithContactsHelpGuide',
            },
        },
    },
    complete: {
        title: 'Complete',
        visible: false,
        hideBack: true,
        hideExit: true,
        baseUrl: 'complete',
        url(initiativeId) {
            return `/create/${initiativeId}/complete`;
        },
    },
    done: {
        title: 'Done',
        visible: false,
        baseUrl: '',
        url(initiativeId) {
            return `/${initiativeId}/overview`;
        },
    },
};

const createInitiativeStructures = {
    default: [
        d.introduction,
        {
            ...d.context,
            items: [
                d.nameAndCategory,
                d.organisationsInvolved,
                d.shareWithContacts,
            ],
        },
        d.complete,
        d.done,
    ],
};

export default createInitiativeStructures;
