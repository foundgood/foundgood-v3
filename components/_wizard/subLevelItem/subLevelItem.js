// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Utilities
import { useWizardNavigationStore } from 'utilities/store';

// Components

// Icons
import { FiCircle, FiCheckCircle, FiMinusCircle } from 'react-icons/fi';

const SubLevelItemComponent = ({
    parentIndex,
    index,
    title,
    inProgress,
    completed,
}) => {
    const router = useRouter();
    const { onSetInProgess, onSetCompleted } = useWizardNavigationStore();
    const [loop, setLoop] = useState(0);

    // useEffect(() => {
    //     console.log('Get new form data');
    // }, []);

    const onHandleRoute = () => {
        const i = loop > 1 ? 0 : loop + 1;
        setLoop(i);

        if (i == 0) {
            onSetInProgess(parentIndex, index, false);
            onSetCompleted(parentIndex, index, false);
        } else if (i == 1) {
            onSetInProgess(parentIndex, index, true);
        } else if (i == 2) {
            onSetCompleted(parentIndex, index, true);
        }
    };

    // useEffect(() => {
    //     console.log('Get new form data');
    // }, [router.query.counter]);

    const getSlug = slug => {
        // https://gist.github.com/codeguy/6684588
        return slug
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    };

    return (
        <li
            onClick={onHandleRoute}
            className={cc([
                'mt-24 md:cursor-pointer',
                // { 'bg-teal-20': inProgress },
                // { 'bg-teal-40': completed },
            ])}>
            <span className="flex t-caption">
                <i className="mr-16">
                    {/* ICONS:
                    default - FiCircle
                    inProgress - FiMinusCircle
                    completed - FiCheckCircle */}
                    {!inProgress && <FiCircle />}
                    {!completed && inProgress && <FiMinusCircle />}
                    {completed && inProgress && <FiCheckCircle />}
                </i>
                {title}
            </span>
        </li>
    );
};

SubLevelItemComponent.propTypes = {};

SubLevelItemComponent.defaultProps = {};

export default SubLevelItemComponent;
