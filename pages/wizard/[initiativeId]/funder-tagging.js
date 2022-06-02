// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm } from 'react-hook-form';

// Utilities
import {
    useElseware,
    useLabels,
    useWizardSubmit,
    useContext,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper, FormFields } from 'components/_inputs';

// Icons
import { FiImage } from 'react-icons/fi';

const FunderTaggingComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { CONTEXTS } = useContext();
    const { label } = useLabels();
    const { ewUpdate } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();

    // ///////////////////
    // SUBMIT
    // ///////////////////

    useWizardSubmit({
        [CONTEXTS.CREATE]: [
            mainForm,
            formData => {
                try {
                    console.log(formData);
                    const { Account__c, Type__c } = formData;

                    // Data for sf
                    const data = {
                        Account__c,
                        Type__c,
                    };

                    // TODO // FIND OUT WHERE/HOW TO POST // Update initiative
                    // const { data: initiativeData } = await ewUpdate(
                    //     'initiative/initiative',
                    //     utilities.initiative.get().Id,
                    //     data
                    // );

                    // // Update initiative
                    // utilities.updateInitiative(initiativeData);

                    // Clear content in form
                    mainForm.reset();
                } catch (error) {
                    console.warn(error);
                }
            },
        ],
    });

    // ///////////////////
    // METHODS
    // ///////////////////

    // ///////////////////
    // DATA
    // ///////////////////

    // Get all funders
    const funders = utilities.funders.getAll();

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <WithPermission context>
            <TitlePreamble />
            <InputWrapper>
                <div className="flex flex-col p-24 space-y-16 bg-teal-10 rounded-8">
                    <h5 className="t-h5">
                        {label('FunderTaggingFundingPartnersHeading')}
                    </h5>
                    {funders.map(funder => (
                        <FunderTags
                            key={funder.Id}
                            {...{ funder, form: mainForm }}
                        />
                    ))}
                </div>
            </InputWrapper>
        </WithPermission>
    );
};

const FunderTags = ({ funder, form }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();
    const { ewGet } = useElseware();

    // ///////////////////
    // DATA
    // ///////////////////

    // Get data for form
    const { data: funderTags } = ewGet('tags/funder-tags', {
        id: funder.Account__c,
    });

    // ///////////////////
    // FIELDS
    // ///////////////////

    const fields = [
        {
            type: 'SelectList',
            name: `${funder.Account__c}-tags`,
            label: label('FunderTaggingListHeading'),
            // Type options
            options: Object.values(funderTags?.data ?? {}).map(list => ({
                label: list.Name,
                value: list.Name,
            })),
            listMaxLength: 5,
        },
    ];

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col p-16 space-y-16 bg-white border-4 border-teal-20 rounded-8">
            <div className="flex items-center space-x-16">
                <div className="flex items-center justify-center flex-shrink-0 w-64 h-64 text-teal-100 border-2 rounded-4 border-teal-20">
                    <FiImage size="36" className="stroke-current" />
                </div>
                <div className="t-sh4 whitespace-nowrap">
                    {funder?.Account__r?.Name}
                </div>
            </div>
            <FormFields
                {...{
                    fields,
                    form,
                }}
            />
        </div>
    );
};

FunderTaggingComponent.propTypes = {};

FunderTaggingComponent.defaultProps = {};

FunderTaggingComponent.layout = 'wizard';

export default WithAuth(FunderTaggingComponent);
