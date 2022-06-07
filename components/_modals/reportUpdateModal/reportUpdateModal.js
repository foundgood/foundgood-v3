// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useFormState } from 'react-hook-form';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components
import Button from 'components/button';
import BaseModal from 'components/_modals/baseModal';
import { Reflection } from 'components/_inputs';

const ReportUpdateModalComponent = ({
    form,
    isOpen,
    isSaving,
    onCancel,
    onSave,
    reflection,
    title,
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // FORMS
    // ///////////////////

    const { isDirty } = useFormState({ control: form.control });

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <BaseModal {...{ isOpen }}>
            {/* Modal content */}
            <div className="flex flex-col overflow-y-auto scrolling-touch max-h-[90vh] sm:max-h-[80vh] pb-32 p-2 overflow-x-hidden">
                {title && <h3 className="mb-24 text-teal-100 t-h3">{title}</h3>}
                <div className="bg-teal-10 rounded-8">
                    <Reflection
                        {...{
                            controller: form.control,
                            name: 'reflectionDescription',
                            maxLength: 750,
                            label: label('ReportUpdateModalReflectionsLabel'),
                            defaultValue: reflection?.Description__c,
                        }}
                    />
                </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end mt-32 space-x-16">
                <p
                    className={cc([
                        'hidden t-footnote text-coral-60 md:flex transition-default mr-auto',
                        {
                            'opacity-0': !isSaving,
                            'opacity-100': isSaving,
                        },
                    ])}>
                    {label('MessageSaved')}
                </p>
                <Button
                    variant="tertiary"
                    theme="coral"
                    action={onCancel}
                    disabled={isSaving}>
                    {label('ButtonCancel')}
                </Button>
                <Button
                    theme="coral"
                    action={onSave}
                    disabled={isSaving || !isDirty}>
                    {label('ButtonSave')}
                </Button>
            </div>
        </BaseModal>
    );
};

ReportUpdateModalComponent.propTypes = {
    form: t.object.isRequired,
    isOpen: t.bool,
    isSaving: t.bool,
    onCancel: t.func.isRequired,
    onSave: t.func.isRequired,
    reflection: t.object,
    title: t.string,
};

ReportUpdateModalComponent.defaultProps = {
    form: null,
    isOpen: false,
    isSaving: false,
    onCancel: null,
    onSave: null,
    reflection: null,
    title: '',
};

export default ReportUpdateModalComponent;
