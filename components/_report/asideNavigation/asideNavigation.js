// React
import React, { useEffect, useState } from 'react';

// Packages

// Utilities
import { useReportNavigationStore } from 'utilities/store';

import { useMetadata } from 'utilities/hooks';

// Components
import { SubLevelItem } from 'components/_report/asideNavigation';

const AsideNavigationComponent = () => {
    // Store: reportNavigation
    const { navItems } = useReportNavigationStore();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    return (
        <>
            <header>
                <p className="mt-8 t-footnote">
                    {labelTodo(
                        'Report: Global coastal disaster prevention & recovery project'
                    )}
                </p>
                <h2 className="mt-16 t-h5">{labelTodo('Foundation Name')}</h2>
                <h3 className="mt-16 t-sh6">
                    {labelTodo('Annual Report: 2021')}
                </h3>
            </header>

            <ul className="mt-48">
                {navItems.map((item, index) => (
                    <SubLevelItem
                        key={`nav-${index}`}
                        // parentIndex={index}
                        index={index}
                        title={item.title}
                        inProgress={item.inProgress}
                        completed={item.completed}
                    />
                    // <TopLevelItem
                    //     key={`nav-${index}`}
                    //     index={index}
                    //     title={item.title}
                    //     collapsed={item.collapsed}
                    //     items={item.items}
                    // />
                ))}
            </ul>
        </>
    );
};

AsideNavigationComponent.propTypes = {};

AsideNavigationComponent.defaultProps = {};

export default AsideNavigationComponent;
