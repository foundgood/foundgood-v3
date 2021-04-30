// React
import React, { useEffect, useState } from 'react';

// Packages

// Utilities
import { useWizardNavigationStore } from 'utilities/store';

// Components
import TopLevelItem from 'components/_wizard/topLevelItem';

const AsideNavigationComponent = () => {
    // Store: wizardNavigation
    const { navItems } = useWizardNavigationStore();

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
