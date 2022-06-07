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
import ModalBase from 'components/_modals/baseModal';

const WizardModalComponent = ({
    children,
    form,
    isOpen,
    isSaving,
    onCancel,
    onSave,
    title,
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // FORMS
    // ///////////////////

    const { isDirty } = form
        ? useFormState({ control: form.control })
        : { isDirty: true };

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <ModalBase {...{ isOpen }}>
            {/* Modal content */}
            <div className="flex flex-col overflow-y-auto scrolling-touch max-h-[90vh] sm:max-h-[80vh] pb-32 p-2 overflow-x-hidden">
                {title && <h3 className="mb-32 text-teal-100 t-h3">{title}</h3>}
                {children}
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
                <Button variant="tertiary" theme="coral" action={onCancel}>
                    {label('ButtonCancel')}
                </Button>
                <Button
                    theme="coral"
                    action={onSave}
                    disabled={isSaving || !isDirty}>
                    {label('ButtonSave')}
                </Button>
            </div>
        </ModalBase>
    );
};

WizardModalComponent.propTypes = {
    form: t.object.isRequired,
    isOpen: t.bool,
    isSaving: t.bool,
    onCancel: t.func.isRequired,
    onSave: t.func.isRequired,
    title: t.string,
};

WizardModalComponent.defaultProps = {
    form: null,
    isOpen: false,
    isSaving: false,
    onCancel: null,
    onSave: null,
    title: '',
};

export default WizardModalComponent;
