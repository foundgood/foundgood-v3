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

    const onHandleRoute = () => {
        const urlPart = getSlug(title);
        router.push(`wizard?section=${urlPart}`, undefined, { shallow: true });

        onSetCompleted(parentIndex, index, false);
        onSetInProgess(parentIndex, index, true);
    };

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
        <li onClick={onHandleRoute} className="mt-24 md:cursor-pointer">
            <span
                className={cc([
                    'flex t-caption',
                    {
                        't-caption-bold text-teal-300':
                            !completed && inProgress,
                    },
                ])}>
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
