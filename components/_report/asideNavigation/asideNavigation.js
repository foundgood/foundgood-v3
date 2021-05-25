// React
import React from 'react';

// Packages
import cc from 'classcat';
import dayjs from 'dayjs';
import Scrollspy from 'react-scrollspy';

// Utilities
import { useMetadata, useContext } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';
import { asId } from 'utilities';

// Data
import { reportItems } from 'utilities/data/reportNavigationItems';

const AsideNavigationComponent = () => {
    // Context for wizard pages
    const { REPORT_ID } = useContext();

    // Hook: Metadata
    const { label } = useMetadata();

    // Store: Initiative data
    const { initiative } = useInitiativeDataStore();

    return (
        <>
            <header>
                <p className="mt-8 t-footnote">{initiative.Name}</p>
                <h2 className="mt-16 t-h5">
                    {`${initiative._reports[REPORT_ID]?.Report_Type__c} ${label(
                        'custom.FA_TitleReport'
                    )} ${dayjs(
                        initiative._reports[REPORT_ID]?.Due_Date__c
                    ).format('YYYY')}`}
                </h2>
                <h3 className="mt-16 t-sh6">
                    {
                        initiative._reports[REPORT_ID]?.Funder_Report__r
                            ?.Account__r.Name
                    }
                </h3>
            </header>
            {/* Parent items */}
            <ul className="mt-48 space-y-48">
                {reportItems().map(item => {
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
