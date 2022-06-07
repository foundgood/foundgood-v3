// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components
import Button from 'components/button';
import ModalBase from 'components/_modals/baseModal';

const ConfirmModalComponent = ({
    children,
    isOpen,
    isSaving,
    onCancel,
    onSave,
    saveText,
    title,
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

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
                <Button
                    variant="tertiary"
                    theme="coral"
                    action={onCancel}
                    disabled={isSaving}>
                    {label('ButtonCancel')}
                </Button>
                <Button theme="coral" action={onSave} disabled={isSaving}>
                    {saveText || label('ButtonSave')}
                </Button>
            </div>
        </ModalBase>
    );
};

ConfirmModalComponent.propTypes = {
    isOpen: t.bool,
    isSaving: t.bool,
    onCancel: t.func.isRequired,
    onSave: t.func.isRequired,
    saveText: t.string,
    title: t.string,
};

ConfirmModalComponent.defaultProps = {
    isOpen: false,
    isSaving: false,
    onCancel: null,
    onSave: null,
    saveText: '',
    title: '',
};

export default ConfirmModalComponent;
