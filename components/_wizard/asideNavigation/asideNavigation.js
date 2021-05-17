// React
import React, { useEffect } from 'react';

// Packages

// Utilities
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';
import { useMetadata, useContextMode } from 'utilities/hooks';

// Components
import { TopLevelItem } from 'components/_wizard/asideNavigation';

const AsideNavigationComponent = () => {
    // Context for wizard pages
    const { MODE, CONTEXTS, UPDATE } = useContextMode();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Store: wizardNavigation
    const {
        buildInitiativeWizardItems,
        buildReportWizardItems,
        items,
    } = useWizardNavigationStore();

    // Store: Initiative data
    const { initiative } = useInitiativeDataStore();

    // Effect: Update wizard navigation items
    useEffect(() => {
        if (MODE === CONTEXTS.REPORT) {
            buildReportWizardItems();
        } else {
            buildInitiativeWizardItems(initiative.Configuration_Type__c);
        }
    }, []);

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
                            <TopLevelItem key={`nav-${index}`} item={item} />
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
