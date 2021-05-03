// React
import React, { useEffect, useState } from 'react';

// Packages

// Utilities
import { useWizardNavigationStore } from 'utilities/store';
import { useMetadata } from 'utilities/hooks';

// Components
import TopLevelItem from 'components/_wizard/topLevelItem';

const AsideNavigationComponent = () => {
    // Store: wizardNavigation
    const { navItems } = useWizardNavigationStore();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    return (
        <>
            <header>
                <p className="mt-8 t-footnote">
                    {labelTodo(
                        'Coastal Hazard Wheel: Global coastal disaster prevention & recovery project'
                    )}
                </p>
                <h2 className="mt-16 t-h5">{labelTodo('Foundation Name')}</h2>
                <h3 className="mt-16 t-sh6">
                    {labelTodo('Annual Report: 2021')}
                </h3>
            </header>

            <ul className="mt-48">
                {navItems.map((item, index) => (
                    <TopLevelItem
                        key={`nav-${index}`}
                        index={index}
                        title={item.title}
                        collapsed={item.collapsed}
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
