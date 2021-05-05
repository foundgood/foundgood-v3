// React
import React, { useEffect } from 'react';

// Packages

// Utilities
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';
import { useMetadata } from 'utilities/hooks';

// Components
import { TopLevelItem } from 'components/_wizard/asideNavigation';

const AsideNavigationComponent = () => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Store: wizardNavigation
    const { buildWizardItems, items } = useWizardNavigationStore();

    // Store: Initiative data
    const { initiative } = useInitiativeDataStore();

    useEffect(() => {
        buildWizardItems(initiative?.configurationType);
    }, [initiative?.configurationType]);

    return (
        <>
            <header>
                <p className="mt-8 t-footnote">
                    {labelTodo(
                        'Wizard: Global coastal disaster prevention & recovery project'
                    )}
                </p>
                <h2 className="mt-16 t-h5">{labelTodo('Foundation Name')}</h2>
                <h3 className="mt-16 t-sh6">
                    {labelTodo('Annual Report: 2021')}
                </h3>
            </header>

            <ul className="mt-48">
                {items.map((item, index) => {
                    if (item.visible) {
                        return (
                            <TopLevelItem
                                key={`nav-${index}`}
                                index={index}
                                title={item.title}
                                collapsed={item.collapsed}
                                items={item.items}
                            />
                        );
                    }
                })}
            </ul>
        </>
    );
};

AsideNavigationComponent.propTypes = {};

AsideNavigationComponent.defaultProps = {};

export default AsideNavigationComponent;
