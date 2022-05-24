// React
import React, { useEffect, useState } from 'react';

// Packages
import Image from 'next/image';
import { useForm } from 'react-hook-form';

// Utilities
import {
    useContext,
    useElseware,
    useLabels,
    useWizardSubmit,
    useUser,
} from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';

const IntroductionComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { reset: resetWizardNavigationStore } = useWizardNavigationStore();
    const {
        reset: resetInitiativeStore,
        utilities,
        CONSTANTS,
    } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS } = useContext();
    const { label, text } = useLabels();
    const { ewCreate } = useElseware();
    const { getUserAccountId, getUserAccountType } = useUser();

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
        [CONTEXTS.CREATE]: [
            mainForm,
            async () => {
                // Create Initiative
                const { data: initiativeData } = await ewCreate(
                    'initiative/initiative',
                    {
                        Name: '___',
                        Configuration_Type__c: 'Reporting',
                    }
                );

                // Update store
                utilities.updateInitiative(initiativeData);

                // Add Funder or Collaborator
                // TODO: DONT DO IF SUPERUSER
                if (getUserAccountType() === CONSTANTS.ACCOUNT.FOUNDATION) {
                    // Create funder
                    const { data: funderData } = await ewCreate(
                        'initiative-funder/initiative-funder',
                        {
                            Account__c: getUserAccountId(),
                            Initiative__c: initiativeData.Id,
                        }
                    );

                    // Update store
                    utilities.updateInitiativeData('_funders', funderData);
                }

                if (getUserAccountType() === CONSTANTS.ACCOUNT.GRANTEE) {
                    // Create collaborator
                    const { data: collaboratorData } = await ewCreate(
                        'initiative-collaborator/initiative-collaborator',
                        {
                            Account__c: getUserAccountId(),
                            Initiative__c: initiativeData.Id,
                        }
                    );

                    // Update store
                    utilities.updateInitiativeData(
                        '_collaborators',
                        collaboratorData
                    );
                }
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
        if (MODE === CONTEXTS.CREATE) {
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

IntroductionComponent.permissions = 'context';

export default WithAuth(WithPermission(IntroductionComponent));
