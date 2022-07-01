// React
import React from 'react';

// Packages

// Utilities
import { useElseware, useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import ReportUpdatesInPage from 'components/_wizard/reportUpdatesInPage';
import Collection from 'components/_wizard/collection';
import { ReportUpdate } from 'components/_wizard/_cards';
import Regulation from 'components/_wizard/_cards/_cardContents/regulation';

const RegulationsComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object, pickList, getValueLabel } = useLabels();
    const {
        ewUpdate,
        ewCreate,
        ewDelete,
        ewDeleteItemsWrapper,
    } = useElseware();

    // ///////////////////
    // METHODS
    // ///////////////////

    function getItemData(formData) {
        const {
            Type__c,
            Id__c,
            DateRange,
            Issuing_Body__c,
            Importance__c,
        } = formData;

        // Data for sf
        return {
            Type__c,
            Id__c,
            Date_Applied__c: DateRange.from,
            Date_Received__c: DateRange.to,
            Issuing_Body__c,
            Importance__c,
        };
    }

    async function addItem(formData) {
        const { data: itemData } = await ewCreate(
            'initiative-activity-regulation/initiative-activity-regulation',
            {
                ...getItemData(formData),
                Initiative__c: utilities.initiative.get().Id,
            }
        );

        // Update main data
        utilities.updateInitiativeData('_regulations', itemData);
    }

    async function editItem(formData, id) {
        const { data: itemData } = await ewUpdate(
            'initiative-activity-regulation/initiative-activity-regulation',
            id,
            getItemData(formData)
        );

        // Update main data
        utilities.updateInitiativeData('_regulations', itemData);
    }

    async function deleteItem(id) {
        // Delete relations
        await ewDeleteItemsWrapper(
            utilities.activityEmployees.getFromEmployeeId(id),
            'initiative-activity-employee/initiative-activity-employee',
            '_activityEmployees'
        );

        // Delete
        await ewDelete(
            'initiative-activity-regulation/initiative-activity-regulation',
            id
        );

        // Clean out item
        utilities.removeInitiativeData('_regulations', id);
    }

    function setItemFieldValues(form, id) {
        const {
            Type__c,
            Id__c,
            Date_Applied__c,
            Date_Received__c,
            Issuing_Body__c,
            Importance__c,
        } = utilities.regulations.get(id);

        form.setValue('Type__c', Type__c);
        form.setValue('Id__c', Id__c);
        form.setValue('DateRange', {
            from: Date_Applied__c,
            to: Date_Received__c,
        });
        form.setValue('Issuing_Body__c', Issuing_Body__c);
        form.setValue('Importance__c', Importance__c);
    }

    // ///////////////////
    // DATA
    // ///////////////////

    // Get regulations
    const regulations = utilities.regulations.getAll();

    // ///////////////////
    // FIELDS
    // ///////////////////

    function itemFields() {
        return [
            {
                type: 'Select',
                name: 'Type__c',
                label: object.label(
                    'Initiative_Activity_Regulation__c.Type__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity_Regulation__c.Type__c'
                ),
                options: pickList('Initiative_Activity_Regulation__c.Type__c'),
                required: true,
            },
            {
                type: 'Text',
                name: 'Id__c',
                label: object.label('Initiative_Activity_Regulation__c.Id__c'),
                subLabel: object.helpText(
                    'Initiative_Activity_Regulation__c.Id__c'
                ),
                required: true,
                maxLength: 80,
            },
            {
                type: 'DateRange',
                name: 'DateRange',
                fromLabel: object.label(
                    'Initiative_Activity_Regulation__c.Date_Applied__c__from'
                ),
                toLabel: object.label(
                    'Initiative_Activity_Regulation__c.Date_Received__c__to'
                ),
                label: `${object.label(
                    'Initiative_Activity_Regulation__c.Date_Applied__c'
                )} / ${object.label(
                    'Initiative_Activity_Regulation__c.Date_Received__c'
                )}`,
            },
            {
                type: 'Text',
                name: 'Issuing_Body__c',
                label: object.label(
                    'Initiative_Activity_Regulation__c.Issuing_Body__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity_Regulation__c.Issuing_Body__c'
                ),
                maxLength: 200,
                required: true,
            },
            {
                type: 'Select',
                name: 'Importance__c',
                label: object.label(
                    'Initiative_Activity_Regulation__c.Importance__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity_Regulation__c.Importance__c'
                ),
                options: pickList(
                    'Initiative_Activity_Regulation__c.Importance__c'
                ),
                required: true,
            },
        ];
    }

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <WithPermission context>
            <TitlePreamble />
            <ReportUpdatesInPage
                {...{
                    items: regulations,
                    itemRelationKey: 'Initiative_Activity_Regulation__c',
                }}
            />
            <Collection
                {...{
                    collection: {
                        items: regulations,
                        fields: itemFields,
                        addLabel: label('ButtonAddRegulation'),
                        emptyLabel: label(
                            'EmptyStateWizardPageActivityRegulation'
                        ),
                    },
                    methods: {
                        add: {
                            title: label(
                                'WizardModalHeadingActivityRegulation'
                            ),
                            action: addItem,
                        },
                        edit: {
                            title: label(
                                'WizardModalHeadingActivityRegulation'
                            ),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label(
                                'WizardModalHeadingActivityRegulationDelete'
                            ),
                            text: label(
                                'WizardModalTextActivityRegulationDelete'
                            ),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Id__c;
                        },
                        type(item) {
                            return getValueLabel(
                                'Initiative_Activity_Regulation__c.Type__c',
                                item?.Type__c
                            );
                        },
                        components(item) {
                            return {
                                cardContent: <Regulation {...{ item }} />,
                                reportUpdate: (
                                    <ReportUpdate
                                        {...{
                                            title: label(
                                                'ReportUpdateModalActivityRegulationHeading'
                                            ),
                                            status: {
                                                item,
                                                relationKey:
                                                    'Initiative_Activity_Regulation__c',
                                                type:
                                                    CONSTANTS.REPORT_DETAILS
                                                        .REGULATION,
                                            },
                                            reflection: {
                                                item,
                                                relationKey:
                                                    'Initiative_Activity_Regulation__c',
                                                type:
                                                    CONSTANTS.REPORT_DETAILS
                                                        .REGULATION,
                                            },
                                        }}
                                    />
                                ),
                            };
                        },
                    },
                }}
            />
        </WithPermission>
    );
};

RegulationsComponent.propTypes = {};

RegulationsComponent.defaultProps = {};

RegulationsComponent.layout = 'wizard';

export default WithAuth(RegulationsComponent);
