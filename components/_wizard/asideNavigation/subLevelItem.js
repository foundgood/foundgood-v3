// React
import React from 'react';

// Packages
import cc from 'classcat';
import { useRouter } from 'next/router';
import Link from 'next/link';
import t from 'prop-types';

// Utilities
import { useWizardNavigationStore } from 'utilities/store';

// Components

// Icons
import { FiCircle, FiCheckCircle, FiMinusCircle } from 'react-icons/fi';

const SubLevelItemComponent = ({ item }) => {
    const { url, title } = item;

    // Hook: Router
    const { asPath } = useRouter();

    // Store: Wizard navigation
    const { completedItems } = useWizardNavigationStore();

    // Checking current page or not
    const inProgress = asPath === url || asPath.indexOf(url) > -1;

    // Checking completed or not
    const completed = completedItems.includes(url);

    return (
        <Link href={url}>
            <li className="mt-24 md:cursor-pointer">
                <span
                    className={cc([
                        'flex t-caption',
                        {
                            't-caption-bold text-teal-300 transition-default': inProgress,
                        },
                    ])}>
                    <i className="mr-16">
                        {inProgress ? (
                            <FiMinusCircle />
                        ) : completed ? (
                            <FiCheckCircle />
                        ) : (
                            <FiCircle />
                        )}
                    </i>
                    {title}
                </span>
            </li>
        </Link>
    );
};

SubLevelItemComponent.propTypes = {
    item: t.object,
};

SubLevelItemComponent.defaultProps = {};

export default SubLevelItemComponent;
