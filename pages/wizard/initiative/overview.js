// React
import React, { useEffect } from 'react';

// Packages
import { useForm } from 'react-hook-form';

// Utilities
import { useAuth, useMetadata, useSalesForce } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import {
    InputWrapper,
    Select,
    Text,
    LongText,
    SelectList,
} from 'components/_inputs';

const OverviewComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Wizard navigation
    const { addSubmitHandler } = useWizardNavigationStore();

    // Store: Initiative data
    const { initiative, updateInitiative } = useInitiativeDataStore();

    // Get data for form
    const { data: accountGrantees } = sfQuery(
        queries.getObjectList.accountGrantees()
    );

    // Method: Submit page content
    async function submit(data) {
        const {
            responsibleOrganisation,
            initiativeName,
            initiativeAbout,
            initiativeLocation,
        } = data;

        await sfUpdate({
            object: 'Initiative__c',
            id: initiative.id,
            data: {
                Name: initiativeName,
                Summary__c: initiativeAbout,
                Where_Is_Problem__c: initiativeLocation
                    .map(item => item.selectValue)
                    .join(';'),
            },
        });

        const initiativeCollaborator = await sfCreate({
            object: 'Initiative_Collaborator__c',
            data: {
                Initiative__c: initiative.id,
                Account__c: responsibleOrganisation,
            },
        });

        updateInitiative({
            initiativeName,
            initiativeAbout,
            initiativeLocation: initiativeLocation.map(
                item => item.selectValue
            ),
            responsibleOrganisation,
            initiativeCollaborator,
        });
    }

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            addSubmitHandler(handleSubmit(submit));
        }, 10);
    }, []);

    return (
        <>
            <TitlePreamble
                title={labelTodo('Overview')}
                preamble={labelTodo(
                    'Preamble of what you need to do, should be clear and easy to understand'
                )}
            />
            <InputWrapper>
                <Select
                    name="responsibleOrganisation"
                    defaultValue={initiative?.responsibleOrganisation}
                    label={labelTodo('Responsible organisation')}
                    placeholder={labelTodo('Grantee name')}
                    options={
                        accountGrantees?.records?.map(item => ({
                            label: item.Name,
                            value: item.Id,
                        })) ?? []
                    }
                    controller={control}
                />
                <Text
                    name="initiativeName"
                    defaultValue={initiative?.initiativeName}
                    label={labelTodo('What is the name of your initiative?')}
                    placeholder={labelTodo('Title of initiative')}
                    maxLength={80}
                    controller={control}
                />
                <LongText
                    name="initiativeAbout"
                    defaultValue={initiative?.initiativeAbout}
                    label={labelTodo('What are your initiative about')}
                    placeholder={labelTodo(
                        "Brief description of initiative that details why it's important"
                    )}
                    maxLength={400}
                    controller={control}
                />
                <SelectList
                    name="initiativeLocation"
                    defaultValue={initiative?.initiativeLocation?.map(
                        value => ({
                            selectValue: value,
                        })
                    )}
                    label={labelTodo('Where is it located?')}
                    listMaxLength={3}
                    options={valueSet('account.Location__c').map(item => ({
                        label: item.label,
                        value: item.fullName,
                    }))}
                    selectLabel={labelTodo('Country')}
                    textLabel={labelTodo('Region')}
                    controller={control}
                />
            </InputWrapper>
        </>
    );
};

OverviewComponent.propTypes = {};

OverviewComponent.defaultProps = {};

OverviewComponent.layout = 'wizard';

export default OverviewComponent;
