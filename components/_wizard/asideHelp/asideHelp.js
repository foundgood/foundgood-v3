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

    const [helpGuideTexts, setHelpGuideTexts] = useState([]);
    const [helpWhatTexts, setHelpWhatTexts] = useState([]);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        let helpGuideTexts = label(currentItem?.item?.labels?.help?.guide);
        helpGuideTexts = helpGuideTexts?.split('\n');
        if (helpWhatTexts) {
            setHelpGuideTexts(helpGuideTexts);
        }

        let helpWhatTexts = label(currentItem?.item?.labels?.help?.what);
        helpWhatTexts = helpWhatTexts?.split('\n');
        if (helpWhatTexts) {
            setHelpWhatTexts(helpWhatTexts);
        }
    }, [currentItem]);

    return (
        <div className="flex flex-col">
            <div className="flex items-center space-x-8 text-blue-300">
                <FiHelpCircle />
                <p className="pt-4">{label('custom.FA_TitleHelp')}</p>
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
                        {/* Show bullet list? */}
                        {helpWhatTexts.length > 1 && (
                            <ul className="pl-16 list-disc list-outside">
                                {helpWhatTexts.map(item => (
                                    <li className="mt-8 t-small">{item}</li>
                                ))}
                            </ul>
                        )}
                        {/* Single paragraph */}
                        {helpWhatTexts.lenght < 2 && (
                            <p className="t-small">{helpWhatTexts[0]}</p>
                        )}
                    </div>
                )}
                {label(currentItem?.item?.labels?.help?.guide) && (
                    <div>
                        <p className="mb-16 t-h6">
                            {label('custom.FA_InitiativeWizardHeadingGuide')}
                        </p>
                        <div className="p-16 text-blue-300 bg-white">
                            {/* Show bullet list? */}
                            {helpGuideTexts.length > 1 && (
                                <ul className="pl-16 list-disc list-outside">
                                    {helpGuideTexts.map((item, index) => (
                                        <li
                                            key={index}
                                            className="mt-8 t-small">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {/* Single paragraph */}
                            {helpGuideTexts.lenght < 2 && (
                                <p className="t-small">{helpGuideTexts[0]}</p>
                            )}
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
