// React
import React, { useEffect, useState } from 'react';

// Packages

// Utilities
import { useWizardNavigationStore } from 'utilities/store';
import { useLabels } from 'utilities/hooks';

// Components

// Icons
import { FiHelpCircle } from 'react-icons/fi';

const AsideHelpComponent = ({ data }) => {
    // Hook: Metadata
    const { label, text } = useLabels();

    // Hook: WizardLayoutStore
    const { currentItem } = useWizardNavigationStore();

    const [helpGuide, setHelpGuide] = useState([]);
    const [helpWhat, setHelpWhat] = useState([]);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        let helpGuide = text(currentItem?.item?.labels?.help?.guide)?.split(
            '\n'
        );
        helpGuide = helpGuide === undefined ? [] : helpGuide;
        setHelpGuide(helpGuide);

        let helpWhat = text(currentItem?.item?.labels?.help?.what)?.split('\n');
        helpWhat = helpWhat === undefined ? [] : helpWhat;
        setHelpWhat(helpWhat);
    }, [currentItem]);

    return (
        <div className="flex flex-col">
            <div className="flex items-center space-x-8 text-blue-300">
                <FiHelpCircle />
                <p className="pt-4">{label('TitleHelp')}</p>
            </div>
            <div className="flex flex-col mt-32 space-y-16">
                {text(currentItem?.item?.labels?.help?.why) && (
                    <div>
                        <p className="mb-16 t-h6">
                            {label('InitiativeWizardHeadingWhy')}
                        </p>
                        <p className="t-small">
                            {text(currentItem?.item?.labels?.help?.why)}
                        </p>
                    </div>
                )}
                {helpWhat.length > 0 && (
                    <div>
                        <p className="mb-16 t-h6">
                            {label('InitiativeWizardHeadingWhat')}
                        </p>
                        {/* Show bullet list */}
                        {helpWhat.length > 1 && (
                            <ul className="pl-16 list-disc list-outside">
                                {helpWhat.map((item, index) => (
                                    <li key={index} className="mt-8 t-small">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {/* Single paragraph */}
                        {helpWhat.length == 1 && (
                            <p className="t-small">{helpWhat[0]}</p>
                        )}
                    </div>
                )}
                {helpGuide.length > 0 && (
                    <div>
                        <p className="mb-16 t-h6">
                            {label('InitiativeWizardHeadingGuide')}
                        </p>
                        <div className="p-16 text-blue-300 bg-white">
                            {/* Show bullet list */}
                            {helpGuide.length > 1 && (
                                <ul className="pl-16 list-disc list-outside">
                                    {helpGuide.map((item, index) => (
                                        <li
                                            key={index}
                                            className="mt-8 t-small">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {/* Single paragraph */}
                            {helpGuide.length == 1 && (
                                <p className="t-small">{helpGuide[0]}</p>
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
