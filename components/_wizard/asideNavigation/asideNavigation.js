// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';

// Utilities

// Components
import TopLevelItem from 'components/_asideNavigation/topLevelItem';

const AsideNavigationComponent = () => {
    const data = [
        {
            title: 'Initiative information',
            items: [{ title: 'Overview', inProgress: true, completed: true }],
        },
        {
            title: 'Summary',
            items: [
                {
                    title: 'Overall performance',
                    inProgress: true,
                    completed: false,
                },
                {
                    title: 'Challenges and learnings',
                    inProgress: false,
                    completed: false,
                },
            ],
        },
        {
            title: 'Key changes',
            items: [
                { title: 'Funding', inProgress: false, completed: false },
                {
                    title: 'Project members',
                    inProgress: false,
                    completed: false,
                },
                { title: 'Collaborators', inProgress: false, completed: false },
            ],
        },
    ];

    return (
        <>
            <header>
                <p className="mt-8 t-footnote">
                    Coastal Hazard Wheel: Global coastal disaster prevention &
                    recovery project
                </p>
                <h2 className="mt-16 t-h5">[Foundation Name]</h2>
                <h3 className="mt-16 t-sh6">[Report type]: [Year]</h3>
            </header>

            <ul className="mt-48">
                {data.map((item, index) => (
                    <TopLevelItem
                        key={`nav-${index}`}
                        title={item.title}
                        items={item.items}
                    />
                ))}
            </ul>
        </>
    );
};

AsideNavigationComponent.propTypes = {};

AsideNavigationComponent.defaultProps = {};

export default AsideNavigationComponent;
