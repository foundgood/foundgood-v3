// React
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Packages
import t from 'prop-types';
import { Transition } from '@headlessui/react';

// Utilities

// Components

const BaseModalComponent = ({ isOpen, children }) => {
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
                    {children}
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

BaseModalComponent.propTypes = {
    isOpen: t.bool,
};

BaseModalComponent.defaultProps = {
    isOpen: false,
};

export default BaseModalComponent;
