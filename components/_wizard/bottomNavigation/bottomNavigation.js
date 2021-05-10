// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import { useRouter } from 'next/router';

// Utilities
import { useMetadata } from 'utilities/hooks';
import { useWizardNavigationStore } from 'utilities/store';

// Components
import Button from 'components/button';

const BottomNavigationComponent = () => {
    const router = useRouter();

    // Local state for showing status
    const [loading, setLoading] = useState(false);

    // Hook: Metadata
    const { labelTodo } = useMetadata();
    const {
        nextItemUrl,
        onUrlChange,
        handleSubmit,
        currentItem,
    } = useWizardNavigationStore();

    // Effect: Handle path change
    useEffect(() => {
        onUrlChange(router.pathname);
    }, [router.pathname]);

    async function onHandleContinue() {
        setLoading(true);
        try {
            // Submit throws if there is any validation errors
            await handleSubmit();

            // Go to next in flow
            router.push(nextItemUrl);

            // Stop loading indicator
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <div className="w-full py-4 lg:py-12 transition-slow max-w-[600px] page-mx bg-white flex items-center">
            <div className="flex items-center justify-between w-full">
                <Button theme="coral" variant="secondary" action="/">
                    {labelTodo('Exit')}
                </Button>
                <p
                    className={cc([
                        'hidden t-footnote text-coral-60 md:flex transition-default opacity-0',
                        {
                            'opacity-100': loading,
                        },
                    ])}>
                    {labelTodo('Saving updates...')}
                </p>
                <div className="flex space-x-12">
                    <Button
                        className={cc([
                            'transition-default',
                            {
                                'opacity-100 pointer-events-auto': !currentItem
                                    ?.item.hideBack,
                                'opacity-0 pointer-events-none':
                                    currentItem?.item.hideBack,
                            },
                        ])}
                        theme="coral"
                        variant="secondary"
                        action={router.back}>
                        {labelTodo('Back')}
                    </Button>

                    <Button
                        theme="coral"
                        action={onHandleContinue}
                        className={cc([
                            'transition-default',
                            {
                                'opacity-100 pointer-events-auto': nextItemUrl,
                                'opacity-0 pointer-events-none': !nextItemUrl,
                            },
                        ])}>
                        {labelTodo('Continue')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

BottomNavigationComponent.propTypes = {};

BottomNavigationComponent.defaultProps = {};

export default BottomNavigationComponent;
