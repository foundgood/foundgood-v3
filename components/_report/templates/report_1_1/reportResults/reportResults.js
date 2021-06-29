// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';
import { asId } from 'utilities';

// Components
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import UpdateButton from 'components/updateButton';
import ReportSharingCard from 'components/_initiative/reportSharingCard';
import TextCard from 'components/_initiative/textCard';
import DividerLine from 'components/_initiative/dividerLine';

const ReportResultsComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label } = useMetadata();

    const [results, setResults] = useState([]);

    useEffect(() => {
        // Make sure we have Report Details
        if (Object.values(initiative._reportDetails).length > 0) {
            // Get reports ALL Activities
            // Activies are split between:
            // Activities == "Intervention"
            // Sharing of results == "Dissimination"
            const results = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == constants.TYPES.ACTIVITY_OVERVIEW
                        ? true
                        : false;
                })
                .map(item => {
                    // Get Activity based on key
                    let activity = {
                        ...initiative._activities[item.Initiative_Activity__c],
                    };

                    // Report reflection
                    const reflection =
                        item.Description__c === constants.CUSTOM.NO_REFLECTIONS
                            ? null
                            : item.Description__c;

                    // Add to Activity
                    if (reflection) {
                        activity = {
                            ...activity,
                            reportReflection: reflection,
                        };
                    }

                    return activity;
                })
                .filter(item => {
                    // "Dissemination" or "Intervention"
                    return item.Activity_Type__c ==
                        constants.TYPES.ACTIVITY_DISSEMINATION
                        ? true
                        : false;
                })
                .map(item => {
                    let items = [];

                    // If activity has publications
                    if (item.Publication_Type__c) {
                        items = [
                            {
                                label: label(
                                    'custom.FA_InitiativeViewSharingPublicationType'
                                ),
                                text: item.Publication_Type__c,
                            },
                            {
                                label: label(
                                    'custom.FA_InitiativeViewSharingPublicationYear'
                                ),
                                text: item.Publication_Year__c,
                            },
                            {
                                label: label(
                                    'custom.FA_InitiativeViewSharingPublisher'
                                ),
                                text: item.Publication_Publisher__c,
                            },
                            {
                                label: label(
                                    'custom.FA_InitiativeViewSharingAuthor'
                                ),
                                text: item.Publication_Author__c,
                            },
                            {
                                label: label(
                                    'custom.FA_InitiativeViewSharingPublicationDOI'
                                ),
                                text: item.Publication_DOI__c,
                            },
                        ];
                    }

                    let returnObj = {
                        headline: item.Things_To_Do__c,
                        label: item.Dissemination_Method__c,
                        tags: item.Audience_Tag__c?.split(';'),
                        items: items,
                    };

                    if (item.reportReflection) {
                        returnObj = {
                            ...returnObj,
                            reportReflection: item.reportReflection,
                        };
                    }
                    return returnObj;
                });
            setResults(results);
        }
    }, [initiative]);

    return (
        <SectionWrapper id={asId(label('custom.FA_ReportWizardMenuSharing'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label('custom.FA_ReportViewSubHeadingSharingOverall')}
                    </h3>
                    <UpdateButton mode="report" baseUrl="sharing-results" />
                </div>
            </SectionWrapper>

            {/*
                1. Items but no reflections
                2. No items
                3. Items with reflection
            */}

            {results?.length > 0 &&
            results?.filter(item => item.reportReflection).length < 1 ? (
                <SectionEmpty type="noReflections" />
            ) : results?.length < 1 ? (
                <SectionEmpty type="report" />
            ) : (
                results?.length > 0 &&
                results?.map((item, index) => (
                    <div key={`r-${index}`}>
                        <SectionWrapper>
                            <ReportSharingCard
                                headline={item.headline}
                                description={item.label}
                                tags={item.tags}
                                items={item.items}
                            />
                        </SectionWrapper>

                        <TextCard
                            hasBackground={true}
                            headline={label(
                                'custom.FA_ReportViewSubHeadingSharingReflections'
                            )}
                            body={item.reportReflection}
                        />

                        {index < results.length - 1 && <DividerLine />}
                    </div>
                ))
            )}
        </SectionWrapper>
    );
};

ReportResultsComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportResultsComponent.defaultProps = {};

export default ReportResultsComponent;
