// React
import React from 'react';

// Packages
import cc from 'classcat';
import { useRouter } from 'next/router';
import Link from 'next/link';
import t from 'prop-types';

// Utilities
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';
import { useLabels, useContext } from 'utilities/hooks';

// Components

// Icons
import { FiCircle, FiCheckCircle, FiMinusCircle } from 'react-icons/fi';

const SubLevelItemComponent = ({ item }) => {
    const { baseUrl, title, url, titleNNF } = item;

    // Hook: Metadata
    const { label } = useLabels();

    // Hook: Context
    const { INITIATIVE_ID, REPORT_ID } = useContext();

    // Hook: Router
    const { asPath, push } = useRouter();

    // Store: Initiative data
    const { utilities } = useInitiativeDataStore();

    // Store: Wizard navigation
    const { completedItems, handleSubmit } = useWizardNavigationStore();

    // Checking current page or not
    const inProgress = asPath === baseUrl || asPath.indexOf(baseUrl) > -1;

    // Checking completed or not
    const completed = completedItems.includes(baseUrl);

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
        <li className="mt-24 ml-32 md:cursor-pointers">
            <button onClick={() => onHandleNavigate()} className="text-left">
                <span
                    className={cc([
                        'flex t-caption',
                        {
                            't-caption-bold text-teal-300 transition-default': inProgress,
                        },
                    ])}>
                    {/* <i className="mr-16">
                        {inProgress ? (
                            <FiMinusCircle />
                        ) : completed ? (
                            <FiCheckCircle />
                        ) : (
                            <FiCircle />
                        )}
                    </i> */}
                    {/* Title "Goals" needs to be replaced for NNF */}
                    {utilities.isNovoLeadFunder() && titleNNF
                        ? label(titleNNF)
                        : label(title)}
                </span>
            </button>
        </li>
    );
};

SubLevelItemComponent.propTypes = {
    item: t.object,
};

SubLevelItemComponent.defaultProps = {};

export default SubLevelItemComponent;
