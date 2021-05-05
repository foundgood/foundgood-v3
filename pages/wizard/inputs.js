// React
import React, { useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import t from 'prop-types';

// Utilities
import { useAuth } from 'utilities/hooks';

// Components
import {
    Text,
    TextList,
    Select,
    SelectList,
    LongText,
    DateRange,
    SelectionCards,
    InputWrapper,
} from 'components/_inputs';
import Modal from 'components/modal';
import Button from 'components/button';

const InputsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Modal
    const [isOpen, setIsOpen] = useState(true);

    // Hook: useForm setup
    const { register, handleSubmit, control } = useForm();

    // Hook: useForm state
    const { errors } = useFormState({ control });

    return (
        <form>
            <InputWrapper>
                <Text
                    name="initiative_name"
                    label="What is the name of your initiative?"
                    subLabel="Additional text that explains the question if needed"
                    placeholder="Initiative name"
                    maxLength={20}
                    controller={control}
                />
                <Select
                    name="initiative_name_select"
                    label="What is the select of your initiative?"
                    subLabel="Additional text that explains the question if needed"
                    placeholder="Initiative name"
                    options={[
                        { label: 'Test value 1', value: 'value1' },
                        { label: 'Test value 2', value: 'value2' },
                        { label: 'Test value 3', value: 'value3' },
                    ]}
                    controller={control}
                />
                <LongText
                    name="initiative_name_long"
                    label="What is the longest explanation of your initiative?"
                    subLabel="Additional text that explains the question if needed"
                    placeholder="Initiative name"
                    maxLength={400}
                    controller={control}
                />
                <DateRange
                    name="initiative_name_date"
                    label="When does it start and end?"
                    subLabel="Additional text that explains the question if needed"
                    controller={control}
                />
                <TextList
                    label="What is the name of your initiative?"
                    subLabel="You can add multiple if you need to"
                    placeholder="Initiative name"
                    name={'initiative_name_list'}
                    defaultValue={[
                        { value: 'Nummer 1', id: 1 },
                        { value: 'Nummer 2', id: 2 },
                    ]}
                    maxLength={10}
                    listMaxLength={5}
                    controller={control}
                />
                <SelectList
                    label="What is the name of your initiative?"
                    subLabel="You can add multiple if you need to"
                    placeholder="Initiative name"
                    name={'initiative_name_select_list'}
                    maxLength={10}
                    listMaxLength={3}
                    showText
                    options={[
                        { label: 'Test value 1', value: 'value1' },
                        { label: 'Test value 2', value: 'value2' },
                        { label: 'Test value 3', value: 'value3' },
                    ]}
                    selectLabel="My select label"
                    textLabel="My text label"
                    controller={control}
                />
                <SelectionCards
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
                    controller={control}
                />
            </InputWrapper>
            <Button
                className="self-start mt-64"
                action={handleSubmit(data => {
                    console.log(errors, data);
                })}>
                Submit
            </Button>
            <Modal
                isOpen={isOpen}
                title="Add new funder"
                close={() => setIsOpen(false)}
                save={() => console.log('do stuff')}>
                <InputWrapper>
                    <Text
                        label="What is the name of your initiative?"
                        subLabel="Additional text that explains the question if needed"
                        placeholder="Initiative name"
                        maxLength={20}
                        {...register('initiative_name', { maxLength: 20 })}
                    />
                    <Select
                        label="What is the select of your initiative?"
                        subLabel="Additional text that explains the question if needed"
                        placeholder="Initiative name"
                        options={[
                            { label: 'Test value 1', value: 'value1' },
                            { label: 'Test value 2', value: 'value2' },
                            { label: 'Test value 3', value: 'value3' },
                        ]}
                        {...register('initiative_name_select')}
                    />
                    <LongText
                        label="What is the longest explanation of your initiative?"
                        subLabel="Additional text that explains the question if needed"
                        placeholder="Initiative name"
                        maxLength={400}
                        {...register('initiative_name_long', {
                            maxLength: 400,
                        })}
                    />
                </InputWrapper>
            </Modal>
        </form>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

InputsComponent.propTypes = {
    pageProps: t.object,
};

InputsComponent.defaultProps = {
    pageProps: {},
};

InputsComponent.layout = 'wizard';

export default InputsComponent;
