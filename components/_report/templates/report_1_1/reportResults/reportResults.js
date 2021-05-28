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
            const allActivities = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == constants.TYPES.ACTIVITY_OVERVIEW
                        ? true
                        : false;
                })
                .map(item => {
                    // Get Activity based on key
                    const activity =
                        initiative._activities[item.Initiative_Activity__c];
                    // Add Report Reflection text to activities
                    activity.reportReflection = item.Description__c;
                    return activity;
                });

            // Sharing of results == "Dissimination"
            const results = Object.values(allActivities)
                .filter(item => {
                    // "Dissemination" or "Intervention"
                    return item.Activity_Type__c ==
                        CONSTANTS.TYPES.ACTIVITY_INTERVENTION
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
                    return {
                        headline: item.Things_To_Do__c,
                        label: item.Dissemination_Method__c,
                        tags: item.Audience_Tag__c?.split(';'),
                        reportReflection: item.reportReflection,
                        items: items,
                    };
                });
            setResults(results);
        }
    }, []);

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

            {results?.length > 0 &&
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
                ))}
            {results?.length < 1 && <SectionEmpty type="report" />}
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
