// React
import React from 'react';

// Packages
<<<<<<< HEAD
import { useForm, useFormState } from 'react-hook-form';
=======
import { useForm } from 'react-hook-form';
>>>>>>> b830305 (Add overview)
import t from 'prop-types';

// Utilities
import { useAuth, useMetadata } from 'utilities/hooks';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
<<<<<<< HEAD
=======
import {
    InputWrapper,
    Select,
    Text,
    LongText,
    SelectList,
} from 'components/_inputs';
>>>>>>> b830305 (Add overview)

const OverviewComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
<<<<<<< HEAD
    const { labelTodo } = useMetadata();
=======
    const { labelTodo, log, valueSet } = useMetadata();

    log();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();
>>>>>>> b830305 (Add overview)

    return (
        <>
            <TitlePreamble
                title={labelTodo('Overview')}
<<<<<<< HEAD
                preamble={labelTodo('')}
            />
=======
                preamble={labelTodo(
                    'Preamble of what you need to do, should be clear and easy to understand'
                )}
            />
            <InputWrapper>
                <Select
                    name="overview_responsible_organisation"
                    label={labelTodo('Responsible organisation')}
                    placeholder={labelTodo('Grantee name')}
                    options={[
                        { label: 'Test value 1', value: 'value1' },
                        { label: 'Test value 2', value: 'value2' },
                        { label: 'Test value 3', value: 'value3' },
                    ]}
                    controller={control}
                />
                <Text
                    name="overview_initiative_name"
                    label={labelTodo('What is the name of your initiative?')}
                    placeholder={labelTodo('Title of initiative')}
                    maxLength={30}
                    controller={control}
                />
                <LongText
                    name="overview_initiative_about"
                    label={labelTodo('What are your initiative about')}
                    placeholder={labelTodo(
                        "Brief description of initiative that details why it's important"
                    )}
                    maxLength={400}
                    controller={control}
                />
                <SelectList
                    name="overview_initiative_location"
                    showText
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
>>>>>>> b830305 (Add overview)
        </>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

OverviewComponent.propTypes = {
    pageProps: t.object,
};

OverviewComponent.defaultProps = {
    pageProps: {},
};

OverviewComponent.layout = 'wizard';

export default OverviewComponent;
