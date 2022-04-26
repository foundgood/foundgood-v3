// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import { useRouter } from 'next/router';

// Utilities
import { useMetadata, useContext } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import Button from 'components/button';

const BottomNavigationComponent = () => {
    const router = useRouter();

    // Local state for showing status
    const [loading, setLoading] = useState(false);

    // Hook: Context
    const { INITIATIVE_ID, REPORT_ID, MODE, CONTEXTS } = useContext();

    // Hook: Metadata
    const { label } = useMetadata();

    // Store: Initiaitive Data
    const { utilities } = useInitiativeDataStore();

    // Store: Wizard navigation
    const {
        nextItemUrl,
        onUrlOrContextChange,
        handleSubmit,
        currentItem,
    } = useWizardNavigationStore();

    // Effect: Handle path change
    useEffect(() => {
        setTimeout(() => {
            const splitRoute = router.pathname.split('/');
            onUrlOrContextChange(splitRoute[splitRoute.length - 1]);
        }, 50);
    }, [router.asPath]);

    async function onHandleContinue() {
        setLoading(true);
        try {
            // Submit throws if there is any validation errors
            await handleSubmit();

            // Go to next in flow
            router.push(
                nextItemUrl(
                    INITIATIVE_ID === 'new'
                        ? utilities.getInitiativeId()
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
                    action={
                        MODE === CONTEXTS.REPORT
                            ? `/${INITIATIVE_ID}/reports/${REPORT_ID}`
                            : `/${INITIATIVE_ID}/overview`
                    }>
                    {label('custom.FA_ButtonExit')}
                </Button>
                <p
                    className={cc([
                        'hidden t-footnote text-coral-60 md:flex transition-default opacity-0',
                        {
                            'opacity-100': loading,
                        },
                    ])}>
                    {label('custom.FA_MessageSaved')}
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
                        {label('custom.FA_ButtonBack')}
                    </Button>

                    <Button
                        theme="coral"
                        action={onHandleContinue}
                        disabled={loading}>
                        {label('custom.FA_ButtonContinue')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

BottomNavigationComponent.propTypes = {};

BottomNavigationComponent.defaultProps = {};

export default BottomNavigationComponent;
