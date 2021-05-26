// React
import React, { useEffect } from 'react';

// Packages
import dayjs from 'dayjs';

// Utilities
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';
import { useMetadata, useContext } from 'utilities/hooks';

// Components
import { TopLevelItem } from 'components/_wizard/asideNavigation';

const AsideNavigationComponent = () => {
    // Context for wizard pages
    const { MODE, CONTEXTS, REPORT_ID } = useContext();

    // Hook: Metadata
    const { label } = useMetadata();

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
            buildReportWizardItems(
                initiative._reports[REPORT_ID]?.Report_Type__c
            );
        } else {
            buildInitiativeWizardItems(initiative.Configuration_Type__c);
        }
    }, [MODE, initiative._reports[REPORT_ID]]);

    return (
        <>
            <header>
                {MODE === CONTEXTS.REPORT ? (
                    <>
                        <p className="mt-8 t-footnote">{initiative.Name}</p>
                        <h2 className="mt-16 t-h5">
                            {
                                initiative._reports[REPORT_ID]?.Funder_Report__r
                                    .Account__r.Name
                            }
                        </h2>
                        <h3 className="mt-16 t-sh6">
                            {`${
                                initiative._reports[REPORT_ID]?.Report_Type__c
                            } ${label('custom.FA_TitleReport')} ${dayjs(
                                initiative._reports[REPORT_ID]?.Due_Date__c
                            ).format('YYYY')}`}
                        </h3>
                    </>
                ) : (
                    <h2 className="mt-8 t-h5">
                        {label('custom.FA_CreateNewInitiative')}
                    </h2>
                )}
            </header>

            <ul className="mt-48">
                {items?.map((item, index) => {
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
