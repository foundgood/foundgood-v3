// React
import React from 'react';

// Utilities
import { useLabels } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Packages
import t from 'prop-types';
import cc from 'classcat';

const TitlePreambleComponent = ({ title = null, preamble = null }) => {
    // Stores
    const { currentItem } = useWizardNavigationStore();
    const { utilities } = useInitiativeDataStore();

    // Hooks
    const { label } = useLabels();

    // Preload
    const preload = !utilities.initiative.get().Id;

    return (
        <>
            <div
                className={cc([
                    'flex flex-col mb-32 transition-slow bg-clip-text transition-slow bg-gradient-to-r from-teal-80 to-teal-10',
                    {
                        'opacity-80 text-transparent title-preamble-preload-animate': preload,
                        'opacity-100 text-teal-100': !preload,
                    },
                ])}>
                <h2 className="t-h2">
                    {title
                        ? title
                        : label(currentItem?.item?.labels?.form?.title)}
                </h2>
                {preamble && (
                    <p className="mt-16 t-preamble">
                        {title
                            ? title
                            : label(currentItem?.item?.labels?.form?.preamble)}
                    </p>
                )}
            </div>
        </>
    );
};

TitlePreambleComponent.propTypes = {
    preload: t.bool,
};

TitlePreambleComponent.defaultProps = {
    preload: false,
};

export default TitlePreambleComponent;
