// React
import React, { useEffect } from 'react';

// Packages
import Image from 'next/image';

// Utilities
import {
    useAuth,
    useMetadata,
    useSalesForce,
    useContext,
} from 'utilities/hooks';
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
    const { label, log } = useMetadata();

    // Hook: Salesforce setup
    const { sfCreate } = useSalesForce();

    // Store: Wizard navigation
    const {
        setCurrentSubmitHandler,
        reset: resetWizardNavigationStore,
        buildReportWizardItems,
        buildInitiativeWizardItems,
    } = useWizardNavigationStore();

    // Store: Initiative data / Wizard navigation
    const {
        updateInitiative,
        initiative,
        setInitiativeId,
        reset: resetInitiativeStore,
    } = useInitiativeDataStore();

    // Method: Submit page content
    async function submit() {
        // Initiative
        if (MODE === CONTEXTS.INITIATIVE) {
            const initiativeId = await sfCreate({
                object: 'Initiative__c',
                data: {
                    Name: '___',
                    Configuration_Type__c: 'Reporting',
                },
            });

            setInitiativeId(initiativeId);

            await updateInitiative(initiativeId);
        }
    }

    // Add submit handler to wizard navigation store
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

    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(submit);
        }, 100);
    }, []);

    return MODE === CONTEXTS.REPORT ? (
        <>
            <TitlePreamble
                title={label('custom.FA_ReportWizardWelcomeHeading')}
                preamble={label('custom.FA_ReportWizardWelcomeSubHeading')}
            />
            <div className="flex justify-center">
                <Image src="/images/new-report.png" width="600" height="471" />
            </div>
            <p className="t-body">
                {label('custom.FA_ReportWizardWelcomeMain')}
            </p>
        </>
    ) : (
        <>
            <TitlePreamble
                title={label('custom.FA_InitiativeWizardWelcomeHeading')}
                preamble={label('custom.FA_InitiativeWizardWelcomeSubHeading')}
            />
            <div className="flex justify-center my-64">
                <Image
                    src="/images/new-initiative.png"
                    width="700"
                    height="374"
                />
            </div>
            <p className="t-body">
                {label('custom.FA_InitiativeWizardWelcomeMain')}
            </p>
        </>
    );
};

IntroductionComponent.propTypes = {};

IntroductionComponent.defaultProps = {};

IntroductionComponent.layout = 'wizardBlank';

export default IntroductionComponent;
