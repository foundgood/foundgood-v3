// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Utilities
import { useMetadata } from 'utilities/hooks';
import { useWizardNavigationStore } from 'utilities/store';

// Components
import Button from 'components/button';

const BottomNavigationComponent = () => {
    const router = useRouter();
    const [hideBack, setHideBack] = useState(false);

    // Hook: Metadata
    const { labelTodo } = useMetadata();
    const {
        onGotoNext,
        onGotoPrevious,
        onUrlChanged,
        hideBackButton,
    } = useWizardNavigationStore();

    useEffect(() => {
        // Router changed
        onUrlChanged(router.pathname);
    }, [router.pathname]);

    console.log('hide back: ');

    const onHandleContinue = () => {
        onGotoNext();
    };
    const onHandleBack = () => {
        onGotoPrevious();
    };

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
                            'opacity-100': true, // TODO Connect to store when stuff is updated
                        },
                    ])}>
                    {labelTodo('Your updates have been saved')}
                </p>
                <div className="flex space-x-12">
                    {!hideBackButton && (
                        <Button
                            theme="coral"
                            variant="secondary"
                            action={onHandleBack}>
                            {labelTodo('Back')}
                        </Button>
                    )}
                    <Button theme="coral" action={onHandleContinue}>
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
