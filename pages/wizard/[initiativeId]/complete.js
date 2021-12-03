// React
import React, { useEffect, useState } from 'react';

// Packages
import Image from 'next/image';

// Utilities
import { useAuth, useMetadata, useContext } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';

const CompleteComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS } = useContext();

    // Hook: Metadata
    const { label } = useMetadata();

    const [bodyTexts, setBodyTexts] = useState([]);

    // Store: Wizard navigation
    const { setCurrentSubmitHandler } = useWizardNavigationStore();

    // Store: Initiative data / Wizard navigation
    const { initiative } = useInitiativeDataStore();

    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(null);
        }, 100);
    }, [initiative]);

    useEffect(() => {
        let bodyTexts;
        bodyTexts = label('custom.FA_InitiativeWizardCompleteText')?.split(
            '\n'
        );
        bodyTexts = bodyTexts === undefined ? [] : bodyTexts;
        setBodyTexts(bodyTexts);
    }, []);

    return (
        <>
            <TitlePreamble
                title={label('custom.FA_ReportWizardCompleteHeading')}
                preamble={label('custom.FA_ReportWizardCompleteSubHeading')}
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
