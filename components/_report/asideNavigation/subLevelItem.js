// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import { useRouter } from 'next/router';

// Utilities
import { useReportNavigationStore } from 'utilities/store';

// Components

// Icons
import { FiCircle, FiCheckCircle, FiMinusCircle } from 'react-icons/fi';

const SubLevelItemComponent = ({ index, title, inProgress, completed }) => {
    // const router = useRouter();
    // const { onSetInProgess, onSetCompleted } = useReportNavigationStore();

    const onHandleRoute = () => {
        // const urlPart = getSlug(title);
        // router.push(`/report?section=${urlPart}`, undefined, { shallow: true });
        // // onSetCompleted(parentIndex, index, false);
        // onSetInProgess(index, true);
    };

    // const getSlug = slug => {
    //     // https://gist.github.com/codeguy/6684588
    //     return slug
    //         .toString()
    //         .normalize('NFD')
    //         .replace(/[\u0300-\u036f]/g, '')
    //         .toLowerCase()
    //         .trim()
    //         .replace(/\s+/g, '-')
    //         .replace(/[^\w-]+/g, '')
    //         .replace(/--+/g, '-');
    // };

    return (
        <li onClick={onHandleRoute} className="mt-24 md:cursor-pointer">
            <span className="'flex t-caption'">
                {/* <i className="mr-16"> */}
                {/* ICONS:
                    default - FiCircle
                    inProgress - FiMinusCircle
                    completed - FiCheckCircle */}
                {/* {!inProgress && <FiCircle />}
                    {!completed && inProgress && <FiMinusCircle />}
                    {completed && inProgress && <FiCheckCircle />}
                </i> */}
                {title}
            </span>
        </li>
    );
};

SubLevelItemComponent.propTypes = {};

SubLevelItemComponent.defaultProps = {};

export default SubLevelItemComponent;
