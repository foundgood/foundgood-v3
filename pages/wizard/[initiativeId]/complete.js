// React
import React, { useEffect, useState } from 'react';

// Packages
import Image from 'next/image';

// Utilities
import { useAuth, useLabels } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';

const CompleteComponent = ({ pageProps }) => {
    // ///////////////////
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // ///////////////////
    // STORES
    // ///////////////////

    const { setCurrentSubmitHandler } = useWizardNavigationStore();
    const { initiative } = useInitiativeDataStore();

    // ///////////////////
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // ///////////////////
    // STATE
    // ///////////////////

    const [bodyTexts, setBodyTexts] = useState([]);

    // ///////////////////
    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(null);
        }, 100);
    }, [initiative]);

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
