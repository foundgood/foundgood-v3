// React
import React, { useEffect, useState } from 'react';

// Packages
import Image from 'next/image';

// Utilities
import { useAuth, useLabels, useElseware, useContext } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';

const IntroductionComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS } = useContext();

    // Hook: Metadata
    const { label, text } = useLabels();

    // Hook: elseware setup
    const { ewCreate } = useElseware();

    const [bodyTexts, setBodyTexts] = useState([]);

    // Store: Wizard navigation
    const {
        setCurrentSubmitHandler,
        reset: resetWizardNavigationStore,
        buildReportWizardItems,
        buildInitiativeWizardItems,
    } = useWizardNavigationStore();

    // Store: Initiative data / Wizard navigation
    const {
        initiative,
        utilities,
        reset: resetInitiativeStore,
    } = useInitiativeDataStore();

    // Method: Submit page content
    async function submit() {
        // Create initiative
        if (MODE === CONTEXTS.INITIATIVE) {
            const { data: initiativeData } = await ewCreate(
                'initiative/initiative',
                {
                    Name: '___',
                    Configuration_Type__c: 'Reporting',
                }
            );

            // Update store
            utilities.updateInitiative(initiativeData);
        }
    }

    useEffect(() => {
        // Reset navigation store in localstorage
        resetWizardNavigationStore();

        // Aside is not present here, so build stuff
        if (MODE === CONTEXTS.REPORT) {
            // Report wizard mode
            buildReportWizardItems();
        } else {
            // New initiative - reset store
            resetInitiativeStore();
            buildInitiativeWizardItems(initiative.Configuration_Type__c);
        }
    }, [MODE]);

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(submit);
        }, 100);
    }, [initiative]);

    useEffect(() => {
        let bodyTexts;
        if (MODE === CONTEXTS.REPORT) {
            bodyTexts = text('ReportWizardWelcomeMain')?.split('\n');
        } else {
            bodyTexts = text('InitiativeWizardWelcomeMain')?.split('\n');
        }
        bodyTexts = bodyTexts === undefined ? [] : bodyTexts;
        setBodyTexts(bodyTexts);
    }, []);

    return MODE === CONTEXTS.REPORT ? (
        <>
            <TitlePreamble
                title={label('ReportWizardWelcomeHeading')}
                preamble={label('ReportWizardWelcomeSubHeading')}
            />
            <div className="flex justify-center">
                <Image src="/images/new-report.png" width="600" height="471" />
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
    ) : (
        <>
            <TitlePreamble
                title={label('InitiativeWizardWelcomeHeading')}
                preamble={label('InitiativeWizardWelcomeSubHeading')}
            />
            <div className="flex justify-center my-64">
                <Image
                    src="/images/new-initiative.png"
                    width="700"
                    height="374"
                />
            </div>

            {/* Show bullet list? */}
            {bodyTexts?.length > 1 && (
                <ul className="pl-16 list-disc list-outside">
                    {bodyTexts?.map((item, index) => (
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

IntroductionComponent.propTypes = {};

IntroductionComponent.defaultProps = {};

IntroductionComponent.layout = 'wizardBlank';

export default IntroductionComponent;
