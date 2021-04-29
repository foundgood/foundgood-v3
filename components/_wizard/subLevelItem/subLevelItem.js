// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Utilities

// Components

// Icons
import { FiCircle, FiCheckCircle, FiMinusCircle } from 'react-icons/fi';

const SubLevelItemComponent = ({ title, inProgress, completed }) => {
    const router = useRouter();

    // // TODO - Connect state with Store
    // const [isInProgress, setIsInProgress] = useState(false);
    // const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        console.log('Get new form data');
    }, []);

    const onHandleRoute = () => {
        const urlPart = getSlug(title);
        router.push(`/wizard/?section=${urlPart}`, undefined, {
            shallow: true,
        });
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
            {/* 
            TODO - Routing?
            <Link href='#jump-to-section'>
                <a>Title</a>
            </Link>
            */}

            <span className="flex t-caption">
                <i className="mr-16">
                    {/* ICONS:
                    default - FiCircle
                    progress - FiMinusCircle
                    complete - FiCheckCircle */}
                    {!completed && !inProgress && <FiCircle />}
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
