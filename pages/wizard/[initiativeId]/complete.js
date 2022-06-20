// React
import React, { useEffect, useState } from 'react';

// Packages
import Image from 'next/image';

// Utilities
import { useLabels, useContext } from 'utilities/hooks';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';

const CompleteComponent = ({ pageProps }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS } = useContext();
    const { label, text } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [bodyTexts, setBodyTexts] = useState([]);

    // ///////////////////
    // DATA
    // ///////////////////

    const contextBasedLabels = {
        [CONTEXTS.INITIATIVE]: {
            title: 'InitiativeWizardCompleteHeading',
            preamble: 'InitiativeWizardCompleteSubHeading',
            body: 'InitiativeWizardCompleteText',
        },
        [CONTEXTS.CREATE]: {
            title: 'CreateInitiativeWizardCompleteHeading',
            preamble: 'CreateInitiativeWizardCompleteSubHeading',
            body: 'CreateInitiativeCompleteText',
        },
        [CONTEXTS.REPORT]: {
            title: 'ReportWizardCompleteHeading',
            preamble: 'ReportWizardCompleteSubHeading',
            body: 'ReportWizardCompleteText',
        },
    };

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        let bodyTexts;
        const txt = text(contextBasedLabels[MODE]?.body, true);
        if (txt) {
            bodyTexts = txt.split('\n');
            bodyTexts = bodyTexts === undefined ? [] : bodyTexts;
        }
        setBodyTexts(bodyTexts);
    }, []);

    return (
        <WithPermission context>
            <TitlePreamble
                title={label(contextBasedLabels[MODE]?.title)}
                preamble={label(contextBasedLabels[MODE]?.preamble)}
            />
            <div className="flex justify-center">
                <Image src="/images/new-report.png" width="600" height="366" />
            </div>
            {/* Show bullet list? */}
            {bodyTexts?.length > 1 && (
                <ul className="pl-16 list-disc list-outside">
                    {bodyTexts.map((item, index) => (
                        <li key={index} className="mt-8 t-body">
                            {item}
                        </li>
                    ))}
                </ul>
            )}
            {/* Single paragraph */}
            {bodyTexts?.length == 1 && <p className="t-body">{bodyTexts[0]}</p>}
        </WithPermission>
    );
};

CompleteComponent.propTypes = {};

CompleteComponent.defaultProps = {};

CompleteComponent.layout = 'wizardBlank';

export default WithAuth(CompleteComponent);
