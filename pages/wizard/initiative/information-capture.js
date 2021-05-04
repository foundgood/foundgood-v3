// React
import React from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import t from 'prop-types';

// Utilities
import { useAuth, useMetadata } from 'utilities/hooks';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper, SelectionCards } from 'components/_inputs';
import Button from 'components/button';

const InformationCaptureComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Hook: useForm setup
    const { register, handleSubmit, control } = useForm();

    return (
        <>
            <TitlePreamble
                title={labelTodo('Capture the information you want')}
                preamble={labelTodo('Choose the way you want to use foundgood')}
            />
            <InputWrapper>
                <SelectionCards
                    controller={control}
                    name="select_way"
                    options={[
                        {
                            label: 'Reporting',
                            value: 'reporting',
                            details:
                                'Use Foundgood to capture all the neccessary required information to help you structure reports to your grant givers.',
                            required: true,
                        },
                        {
                            label: 'Planning',
                            value: 'planning',
                            details:
                                'Use Foundgood to capture all the neccessary required information to help you structure reports to your grant givers.',
                        },
                        {
                            label: 'Detailing',
                            value: 'detailing',
                            details:
                                'Use Foundgood to capture all the neccessary required information to help you structure reports to your grant givers.',
                        },
                    ]}
                />
            </InputWrapper>
        </>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

InformationCaptureComponent.propTypes = {
    pageProps: t.object,
};

InformationCaptureComponent.defaultProps = {
    pageProps: {},
};

InformationCaptureComponent.layout = 'wizardBlank';

export default InformationCaptureComponent;
