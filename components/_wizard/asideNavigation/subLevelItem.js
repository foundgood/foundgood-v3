// React
import React from 'react';

// Packages
import cc from 'classcat';
import { useRouter } from 'next/router';
import Link from 'next/link';
import t from 'prop-types';

// Utilities
import { useWizardNavigationStore } from 'utilities/store';
import { createQuerystring } from 'utilities';

// Components

// Icons
import { FiCircle, FiCheckCircle, FiMinusCircle } from 'react-icons/fi';

const SubLevelItemComponent = ({ item }) => {
    const { url, title } = item;

    // Hook: Router
    const { asPath, push, query } = useRouter();

    // Store: Wizard navigation
    const { completedItems, handleSubmit } = useWizardNavigationStore();

    // Checking current page or not
    const inProgress = asPath === url || asPath.indexOf(url) > -1;

    // Checking completed or not
    const completed = completedItems.includes(url);

    async function onHandleNavigate() {
        try {
            // Submit throws if there is any validation errors
            await handleSubmit();

            // Go to next in flow
            push(url + createQuerystring(query));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <li className="mt-24 ml-32 md:cursor-pointers">
            <button onClick={() => onHandleNavigate()}>
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
                    {title}
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
