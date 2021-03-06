// React
import React, { useEffect, useState } from 'react';

// Packages

// Utilities
import { useWizardNavigationStore } from 'utilities/store';
import { useLabels } from 'utilities/hooks';

// Components

// Icons
import { FiHelpCircle } from 'react-icons/fi';

const AsideHelpComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { currentItem } = useWizardNavigationStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, text } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [helpGuide, setHelpGuide] = useState([]);
    const [helpWhat, setHelpWhat] = useState([]);

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Set value based on modal elements based on updateId
    useEffect(() => {
        // Check for string
        const guide = currentItem?.item?.labels?.help?.guide;
        const what = currentItem?.item?.labels?.help?.what;
        let helpGuide = [guide];
        let helpWhat = [what];
        if (typeof guide === 'string' && typeof what === 'string') {
            helpGuide = text(guide, true)?.split('\n');
            helpWhat = text(what, true)?.split('\n');
            helpWhat = helpWhat === undefined ? [] : helpWhat;
            helpGuide = helpGuide === undefined ? [] : helpGuide;
        }

        setHelpGuide(helpGuide);
        setHelpWhat(helpWhat);
    }, [currentItem]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col">
            <div className="flex items-center space-x-8 text-blue-300">
                <FiHelpCircle />
                <p className="pt-4">{label('TitleHelp')}</p>
            </div>
            <div className="flex flex-col mt-32 space-y-16">
                {text(currentItem?.item?.labels?.help?.why, true) && (
                    <div>
                        <p className="mb-16 t-h6">
                            {label('InitiativeWizardHeadingWhy')}
                        </p>
                        <p className="t-small">
                            {text(currentItem?.item?.labels?.help?.why, true)}
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
