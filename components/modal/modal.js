// React
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { Transition } from '@headlessui/react';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';

const ModalComponent = ({ isOpen, children, onCancel, onSave, title }) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Local state and effect for handling delay in content animation
    const [showContent, setShowContent] = useState(false);
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setShowContent(true);
            }, 200);
        } else {
            setShowContent(false);
        }
    }, [isOpen]);
    return createPortal(
        <Transition
            show={isOpen}
            enter="transition-medium"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-medium"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 flex justify-center bg-opacity-25 bg-blue-120 z-modal">
            <Transition
                show={showContent}
                enter="transition-medium transform"
                enterFrom="opacity-0 translate-y-10"
                enterTo="opacity-100 translate-y-0"
                leave="transition-medium"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="absolute inset-0 flex items-end justify-center sm:items-center">
                <div className="flex flex-col w-full max-w-[664px] p-18 lg:p-[30px] bg-white rounded-t-16 sm:rounded-16 sm:mx-16">
                    {/* Modal content */}
                    <div className="flex flex-col overflow-y-auto scrolling-touch max-h-[90vh] sm:max-h-[80vh] pb-32 p-2">
                        {title && (
                            <h3 className="mb-32 text-teal-100 t-h3">
                                {title}
                            </h3>
                        )}
                        {children}
                    </div>

                    {/* Modal actions */}

                    <div className="flex justify-end mt-32 space-x-16">
                        <Button
                            variant="tertiary"
                            theme="coral"
                            action={onCancel}>
                            {labelTodo('Cancel')}
                        </Button>
                        <Button theme="coral" action={onSave}>
                            {labelTodo('Save')}
                        </Button>
                    </div>
                </div>
            </Transition>
            <style global jsx>{`
                html {
                    overflow-y: hidden;
                }
            `}</style>
        </Transition>,
        document.getElementById('modal')
    );
};

ModalComponent.propTypes = {
    isOpen: t.bool,
    title: t.string,
    close: t.func,
    save: t.func,
};

ModalComponent.defaultProps = {
    isOpen: false,
};

export default ModalComponent;
