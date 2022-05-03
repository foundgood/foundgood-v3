// React
import React, { useEffect, useState } from 'react';

// Packages
import Image from 'next/image';

// Utilities
import { useAuth, useLabels, useWizardSubmit } from 'utilities/hooks';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';

const CompleteComponent = ({ pageProps }) => {
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, text } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [bodyTexts, setBodyTexts] = useState([]);

    // ///////////////////
    // SUBMIT
    // ///////////////////

    useWizardSubmit();

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        let bodyTexts;
        bodyTexts = text('InitiativeWizardCompleteText')?.split('\n');
        bodyTexts = bodyTexts === undefined ? [] : bodyTexts;
        setBodyTexts(bodyTexts);
    }, []);

    return (
        <>
            <TitlePreamble
                title={label('ReportWizardCompleteHeading')}
                preamble={label('ReportWizardCompleteSubHeading')}
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
        </>
    );
};

CompleteComponent.propTypes = {};

CompleteComponent.defaultProps = {};

CompleteComponent.layout = 'wizardBlank';

export default CompleteComponent;
