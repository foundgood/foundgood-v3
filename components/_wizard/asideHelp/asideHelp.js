// React
import React, { useEffect, useState } from 'react';

// Packages

// Utilities
import { useWizardNavigationStore } from 'utilities/store';
import { useMetadata } from 'utilities/hooks';

// Components

// Icons
import { FiHelpCircle } from 'react-icons/fi';

const AsideHelpComponent = ({ data }) => {
    // Hook: Metadata
    const { label } = useMetadata();

    // Hook: WizardLayoutStore
    const { currentItem } = useWizardNavigationStore();

    return (
        <div className="flex flex-col">
            <div className="flex items-center space-x-8 text-blue-300">
                <FiHelpCircle />
                <p className="pt-4">Help with this section</p>
            </div>
            <div className="flex flex-col mt-32 space-y-16">
                {label(currentItem?.item?.labels?.help?.why) && (
                    <div>
                        <p className="mb-16 t-h6">
                            {label('custom.FA_InitiativeWizardHeadingWhy')}
                        </p>
                        <p className="t-small">
                            {label(currentItem?.item?.labels?.help?.why)}
                        </p>
                    </div>
                )}
                {label(currentItem?.item?.labels?.help?.what) && (
                    <div>
                        <p className="mb-16 t-h6">
                            {label('custom.FA_InitiativeWizardHeadingWhat')}
                        </p>
                        <p className="t-small">
                            {label(currentItem?.item?.labels?.help?.what)}
                        </p>
                    </div>
                )}
                {label(currentItem?.item?.labels?.help?.guide) && (
                    <div>
                        <p className="mb-16 t-h6">
                            {label('custom.FA_InitiativeWizardHeadingGuide')}
                        </p>
                        <div className="p-16 text-blue-300 bg-white">
                            <p className="t-small">
                                {label(currentItem?.item?.labels?.help?.guide)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

AsideHelpComponent.propTypes = {};

AsideHelpComponent.defaultProps = {};

export default AsideHelpComponent;
