// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import { useRouter } from 'next/router';

// Utilities
import { useLabels, useContext } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import Button from 'components/button';

const BottomNavigationComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();
    const {
        nextItemUrl,
        handleSubmit,
        currentItem,
    } = useWizardNavigationStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const router = useRouter();
    const { INITIATIVE_ID, REPORT_ID, MODE, CONTEXTS } = useContext();
    const { label } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [loading, setLoading] = useState(false);

    // ///////////////////
    // METHODS
    // ///////////////////

    async function onHandleContinue() {
        setLoading(true);
        try {
            // Submit throws if there is any validation errors
            await handleSubmit();

            // Go to next in flow
            router.push(
                nextItemUrl(
                    INITIATIVE_ID === 'new'
                        ? utilities.initiative.get().Id
                        : INITIATIVE_ID,
                    REPORT_ID
                )
            );

            // Stop loading indicator
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    function onHandleExit() {
        // Check for new
        if (INITIATIVE_ID === 'new') {
            router.push('/');
        } else {
            router.push(
                MODE === CONTEXTS.REPORT
                    ? `/${INITIATIVE_ID}/reports/${REPORT_ID}`
                    : `/${INITIATIVE_ID}/overview`
            );
        }
    }

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="w-full py-4 lg:py-12 transition-slow max-w-[600px] page-mx bg-white flex items-center">
            <div className="flex items-center justify-between w-full">
                <Button
                    className={cc([
                        'transition-default',
                        {
                            'opacity-100 pointer-events-auto': !currentItem
                                ?.item?.hideExit,
                            'opacity-0 pointer-events-none':
                                currentItem?.item?.hideExit,
                        },
                    ])}
                    theme="coral"
                    variant="secondary"
                    action={onHandleExit}>
                    {label('ButtonExit')}
                </Button>
                <p
                    className={cc([
                        'hidden t-footnote text-coral-60 md:flex transition-default',
                        {
                            'opacity-0': !loading,
                            'opacity-100': loading,
                        },
                    ])}>
                    {label('MessageSaved')}
                </p>
                <div className="flex space-x-12">
                    <Button
                        className={cc([
                            'transition-default',
                            {
                                'opacity-100 pointer-events-auto': !currentItem
                                    ?.item?.hideBack,
                                'opacity-0 pointer-events-none':
                                    currentItem?.item?.hideBack,
                            },
                        ])}
                        theme="coral"
                        variant="secondary"
                        disabled={loading}
                        action={router.back}>
                        {label('ButtonBack')}
                    </Button>

                    <Button
                        theme="coral"
                        action={onHandleContinue}
                        disabled={loading}>
                        {label('ButtonContinue')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

BottomNavigationComponent.propTypes = {};

BottomNavigationComponent.defaultProps = {};

export default BottomNavigationComponent;
