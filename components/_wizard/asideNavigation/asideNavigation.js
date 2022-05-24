// React
import React from 'react';

// Packages
import dayjs from 'dayjs';

// Utilities
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';
import { useLabels, useContext } from 'utilities/hooks';

// Components
import { TopLevelItem } from 'components/_wizard/asideNavigation';

const AsideNavigationComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();
    const { items } = useWizardNavigationStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { label } = useLabels();

    // ///////////////////
    // DATA
    // ///////////////////

    const initiative = utilities.initiative.get();

    const contextBasedLabels = {
        [CONTEXTS.CREATE]: 'CreateInitiativeWizardAsideTitle',
        [CONTEXTS.INITIATIVE]: 'InitiativeWizardAsideTitle',
    };

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <header>
                {MODE === CONTEXTS.REPORT ? (
                    <>
                        <p className="mt-8 t-footnote">{initiative.Name}</p>
                        <h2 className="mt-16 t-h5">
                            {
                                initiative._reports[REPORT_ID]?.Funder_Report__r
                                    .Account__r?.Name
                            }
                        </h2>
                        <h3 className="mt-16 t-sh6">
                            {`${
                                initiative._reports[REPORT_ID]?.Report_Type__c
                            } ${label('TitleReport')} ${dayjs(
                                initiative._reports[REPORT_ID]?.Due_Date__c
                            ).format('YYYY')}`}
                        </h3>
                    </>
                ) : (
                    <h2 className="mt-8 t-h5">
                        {label(contextBasedLabels[MODE])}
                    </h2>
                )}
            </header>

            <ul className="mt-48">
                {items?.map((item, index) => {
                    if (item.visible) {
                        return (
                            <TopLevelItem
                                key={`nav-${index}`}
                                item={item}
                                showTopLevel={!item.showChildrenOnly}
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
