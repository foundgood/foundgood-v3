// React
import React, { useEffect } from 'react';

// Packages
import dayjs from 'dayjs';
import Scrollspy from 'react-scrollspy';

// Utilities
import { useLabels, useContext } from 'utilities/hooks';
import {
    useInitiativeDataStore,
    useReportNavigationStore,
} from 'utilities/store';
import { asId } from 'utilities';

const AsideNavigationComponent = () => {
    // Context for wizard pages
    const { REPORT_ID } = useContext();

    // Hook: Metadata
    const { getValueLabel, label } = useLabels();

    // Store: Initiative data
    const { initiative } = useInitiativeDataStore();

    // Store: Report navigation
    const { buildReportItems, items } = useReportNavigationStore();

    // Effect: Update wizard navigation items
    useEffect(() => {
        if (REPORT_ID && initiative._reports[REPORT_ID]) {
            buildReportItems(initiative._reports[REPORT_ID]?.Report_Type__c);
        }
    }, [REPORT_ID, initiative]);

    return (
        <>
            <header>
                {initiative._reports[REPORT_ID] && (
                    <>
                        <p className="mt-8 t-footnote">{initiative.Name}</p>
                        <h2 className="mt-16 t-h5">
                            {`${getValueLabel(
                                'Initiative_Report__c.Report_Type__c',
                                initiative._reports[REPORT_ID]?.Report_Type__c
                            )} ${label('TitleReport')} ${dayjs(
                                initiative._reports[REPORT_ID]?.Due_Date__c
                            ).format('YYYY')}`}
                        </h2>
                        <h3 className="mt-16 t-sh6">
                            {
                                initiative._reports[REPORT_ID]?.Funder_Report__r
                                    ?.Account__r?.Name
                            }
                        </h3>
                    </>
                )}
            </header>
            {/* Parent items */}
            <ul className="pb-24 mt-48 space-y-48">
                {items?.map(item => {
                    if (item.visible) {
                        return (
                            <li key={item.title}>
                                <span className="flex t-caption-bold">
                                    {label(item.title)}
                                </span>
                                {/* Sub-level items */}
                                <ul className="block">
                                    <Scrollspy
                                        componentTag={'nav'}
                                        className="flex flex-col"
                                        items={item.items.map(childItem =>
                                            asId(label(childItem.title))
                                        )}
                                        offset={-200}
                                        currentClassName="!t-caption-bold text-teal-300">
                                        {item.items.map(childItem => (
                                            <a
                                                key={childItem.title}
                                                className="mt-24 md:cursor-pointers t-caption transition-default"
                                                href={`#${asId(
                                                    label(childItem.title)
                                                )}`}>
                                                {label(childItem.title)}
                                            </a>
                                        ))}
                                    </Scrollspy>
                                </ul>
                            </li>
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
