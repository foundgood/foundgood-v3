// React
import React, { useState } from 'react';

// Packages
import { useRouter } from 'next/router';
import cc from 'classcat';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useWizardNavigationStore } from 'utilities/store';

// Components
import Button from 'components/button';

const UpdateBottomNavigationComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { handleSubmit } = useWizardNavigationStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const router = useRouter();
    const { label } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [loading, setLoading] = useState(false);

    // ///////////////////
    // METHODS
    // ///////////////////

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

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="w-full py-4 lg:py-12 transition-slow max-w-[600px] page-mx bg-white flex items-center">
            <div className="flex items-center justify-between w-full">
                <Button theme="coral" variant="secondary" action={router.back}>
                    {label('ButtonExit')}
                </Button>
                <p
                    className={cc([
                        'hidden t-footnote text-coral-60 md:flex transition-default opacity-0',
                        {
                            'opacity-100': loading,
                        },
                    ])}>
                    {label('MessageSaved')}
                </p>
                <div className="flex space-x-12">
                    <Button
                        theme="coral"
                        action={onHandleSave}
                        disabled={loading}>
                        {label('ButtonSave')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

UpdateBottomNavigationComponent.propTypes = {};

UpdateBottomNavigationComponent.defaultProps = {};

export default UpdateBottomNavigationComponent;
