// React
import React, { useEffect, useState } from 'react';

// Packages
import Image from 'next/image';
import { useForm } from 'react-hook-form';

// Utilities
import {
    useAuth,
    useContext,
    useElseware,
    useLabels,
    useWizardSubmit,
} from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';

const IntroductionComponent = ({ pageProps }) => {
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // STORES
    // ///////////////////

    const { reset: resetWizardNavigationStore } = useWizardNavigationStore();
    const { reset: resetInitiativeStore, utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS } = useContext();
    const { label, text } = useLabels();
    const { ewCreate } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    const [bodyTexts, setBodyTexts] = useState([]);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();

    // ///////////////////
    // SUBMIT
    // ///////////////////

    useWizardSubmit({
        [CONTEXTS.CREATE_INITIATIVE]: [
            mainForm,
            async () => {
                const { data: initiativeData } = await ewCreate(
                    'initiative/initiative',
                    {
                        Name: '___',
                        Configuration_Type__c: 'Reporting',
                    }
                );

                // Update store
                utilities.updateInitiative(initiativeData);
            },
        ],
    });

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        // Reset navigation store in localstorage
        resetWizardNavigationStore();

        // Reset if initiative
        if (MODE === CONTEXTS.CREATE_INITIATIVE) {
            resetInitiativeStore();
        }
    }, [MODE]);

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

    // ///////////////////
    // RENDER
    // ///////////////////

    return MODE === CONTEXTS.REPORT ? (
        <>
            <TitlePreamble
                title={label('ReportWizardWelcomeHeading')}
                preamble={label('ReportWizardWelcomeSubHeading')}
                usePreload={false}
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
                usePreload={false}
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
