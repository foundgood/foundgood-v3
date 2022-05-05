// React
import React from 'react';

// Packages
import cc from 'classcat';
import { useRouter } from 'next/router';
import t from 'prop-types';

// Utilities
import { useWizardNavigationStore } from 'utilities/store';
import { useLabels, useContext } from 'utilities/hooks';

// Components

const SubLevelItemComponent = ({ item, showTopLevel }) => {
    const { baseUrl, title, url } = item;

    // Hook: Metadata
    const { label } = useLabels();

    // Hook: Context
    const { INITIATIVE_ID, REPORT_ID } = useContext();

    // Hook: Router
    const { asPath, push } = useRouter();

    // Store: Wizard navigation
    const { handleSubmit } = useWizardNavigationStore();

    // Checking current page or not
    const inProgress = asPath === baseUrl || asPath.indexOf(baseUrl) > -1;

    async function onHandleNavigate() {
        try {
            // Submit throws if there is any validation errors
            await handleSubmit();

            // Go to next in flow
            push(url(INITIATIVE_ID, REPORT_ID));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <li
            className={cc([
                'mt-24 md:cursor-pointers',
                { ' ml-32': showTopLevel },
            ])}>
            <button onClick={() => onHandleNavigate()} className="text-left">
                <span
                    className={cc([
                        'flex t-caption',
                        {
                            't-caption-bold text-teal-300 transition-default': inProgress,
                        },
                    ])}>
                    {label(title)}
                </span>
            </button>
        </li>
    );
};

SubLevelItemComponent.propTypes = {
    item: t.object,
    showTopLevel: t.bool,
};

SubLevelItemComponent.defaultProps = {};

export default SubLevelItemComponent;
