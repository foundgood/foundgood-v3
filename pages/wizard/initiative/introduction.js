// React
import React, { useEffect } from 'react';

// Packages
import Image from 'next/image';

// Utilities
import { useAuth, useMetadata, useSalesForce } from 'utilities/hooks';
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

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Hook: Salesforce setup
    const { sfCreate } = useSalesForce();

    // Store: Wizard navigation
    const {
        setCurrentSubmitHandler,
        reset: resetWizardNavigationStore,
    } = useWizardNavigationStore();

    // Store: Initiative data / Wizard navigation
    const {
        updateInitiative,
        reset: resetInitiativeStore,
    } = useInitiativeDataStore();

    // Method: Submit page content
    async function submit() {
        const initiativeId = await sfCreate({
            object: 'Initiative__c',
            data: {
                Name: '___',
                Configuration_Type__c: 'Reporting',
            },
        });

        await updateInitiative(initiativeId);
    }

    // Add submit handler to wizard navigation store
    useEffect(() => {
        // Reset stores in localstorage
        resetWizardNavigationStore();
        resetInitiativeStore();

        setTimeout(() => {
            setCurrentSubmitHandler(submit);
        }, 10);
    }, []);

    return (
        <>
            <TitlePreamble
                title={labelTodo('Welcome to your new initiative')}
                preamble={labelTodo(
                    'A new way to structure your project and report on your impact'
                )}
            />
            <div className="flex justify-center my-64">
                <Image
                    src="/images/new-initiative.png"
                    width="700"
                    height="374"
                />
            </div>
            <p className="t-body">
                Maxwell's equations – the foundation of classical
                electromagnetism – describe light as a wave that moves with a
                characteristic velocity. The modern view is that light needs no
                medium of transmission, but Maxwell and his contemporaries were
                convinced that light waves were propagated in a medium,
                analogous to sound propagating in air, and ripples propagating
                on the surface of a pond
            </p>
        </>
    );
};

IntroductionComponent.propTypes = {};

IntroductionComponent.defaultProps = {};

IntroductionComponent.layout = 'wizardBlank';

export default IntroductionComponent;
