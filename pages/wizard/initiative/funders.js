// React
import React, { useState } from 'react';

// Packages
import { useForm } from 'react-hook-form';
import t from 'prop-types';

// Utilities
import { useAuth, useMetadata } from 'utilities/hooks';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import Modal from 'components/modal';
import {
    InputWrapper,
    Select,
    SelectList,
    Text,
    DateRange,
} from 'components/_inputs';

const FundersComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet } = useMetadata();

    // Local state to handle modal
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // Hook: useForm setup
    const {
        handleSubmit: handleSubmitFunder,
        control: controlFunder,
    } = useForm();

    // Method: Adds founder to sf and updates founder list in view
    function submit(data) {
        console.log('submit', data);
        setModalIsOpen(false);
    }

    return (
        <>
            <TitlePreamble
                title={labelTodo('Who is funding the initiative?')}
                preamble={labelTodo(
                    'Preamble of what you need to do, should be clear and easy to understand'
                )}
            />
            <InputWrapper>
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => setModalIsOpen(true)}>
                    Add funder
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={labelTodo('Add new funder')}
                onCancel={() => setModalIsOpen(false)}
                onSave={handleSubmitFunder(submit)}>
                <InputWrapper>
                    <Select
                        name="funding_name_of_funder"
                        label={labelTodo('Name of funder')}
                        placeholder={labelTodo('Please select')}
                        options={[
                            { label: 'Test value 1', value: 'value1' },
                            { label: 'Test value 2', value: 'value2' },
                            { label: 'Test value 3', value: 'value3' },
                        ]}
                        controller={controlFunder}
                    />
                    <Select
                        name="funding_type_of_funder"
                        label={labelTodo('Type of funder')}
                        placeholder={labelTodo('Please select')}
                        options={[
                            { label: 'Test value 1', value: 'value1' },
                            { label: 'Test value 2', value: 'value2' },
                            { label: 'Test value 3', value: 'value3' },
                        ]}
                        controller={controlFunder}
                    />
                    <SelectList
                        name="funding_contribution"
                        showText
                        label={labelTodo('Contribution')}
                        listMaxLength={1}
                        options={valueSet('account.Location__c').map(item => ({
                            label: item.label,
                            value: item.fullName,
                        }))}
                        selectLabel={labelTodo('Currency')}
                        textLabel={labelTodo('Amount granted')}
                        controller={controlFunder}
                    />
                    <DateRange
                        name="funding_grant_date"
                        label={labelTodo('Grant period')}
                        controller={controlFunder}
                    />
                    <Text
                        name="funding_application_id"
                        label={labelTodo('Application ID number')}
                        placeholder={labelTodo('Enter ID')}
                        maxLength={30}
                        controller={controlFunder}
                    />
                    <Select
                        name="funding_grant_giving_area"
                        label={labelTodo('Grant giving area')}
                        placeholder={labelTodo('Please select')}
                        options={[
                            { label: 'Test value 1', value: 'value1' },
                            { label: 'Test value 2', value: 'value2' },
                            { label: 'Test value 3', value: 'value3' },
                        ]}
                        controller={controlFunder}
                    />
                </InputWrapper>
            </Modal>
        </>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

FundersComponent.propTypes = {
    pageProps: t.object,
};

FundersComponent.defaultProps = {
    pageProps: {},
};

FundersComponent.layout = 'wizard';

export default FundersComponent;
