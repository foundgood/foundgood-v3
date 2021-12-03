// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import { useRouter } from 'next/router';

// Utilities
import { useMetadata } from 'utilities/hooks';
import { useWizardNavigationStore } from 'utilities/store';

// Components
import Button from 'components/button';

const UpdateBottomNavigationComponent = () => {
    const router = useRouter();

    // Local state for showing status
    const [loading, setLoading] = useState(false);

    // Hook: Metadata
    const { label } = useMetadata();

    // Store: Wizard navigation
    const { handleSubmit } = useWizardNavigationStore();

    async function onHandleSave() {
        setLoading(true);
        try {
            // Submit throws if there is any validation errors
            await handleSubmit();

            // Stop loading indicator
            setTimeout(() => {
                setLoading(false);
            }, 700);
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <div className="w-full py-4 lg:py-12 transition-slow max-w-[600px] page-mx bg-white flex items-center">
            <div className="flex items-center justify-between w-full">
                <Button theme="coral" variant="secondary" action={router.back}>
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
                        theme="coral"
                        action={onHandleSave}
                        disabled={loading}>
                        {label('custom.FA_ButtonSave')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

UpdateBottomNavigationComponent.propTypes = {};

UpdateBottomNavigationComponent.defaultProps = {};

export default UpdateBottomNavigationComponent;
