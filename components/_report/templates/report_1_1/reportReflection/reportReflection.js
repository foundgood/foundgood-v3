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
import TextCard from 'components/_initiative/textCard';

const ReportSummaryComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label } = useMetadata();

    // useEffect(() => {
    // }, []);

    return (
        <SectionWrapper
            id={asId(label('custom.FA_ReportWizardMenuEndReflections'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label(
                            'custom.FA_ReportViewSubHeadingInfluencesReflections'
                        )}
                    </h3>
                    <UpdateButton
                        mode="report"
                        baseUrl="end-of-grant-reflections"
                    />
                </div>
            </SectionWrapper>
            {/* Project purpose */}
            {report.Project_Purpose__c && (
                <TextCard
                    hasBackground={true}
                    headline={label(
                        'objects.initiativeReport.Project_Purpose__c'
                    )}
                    body={report.Project_Purpose__c}
                />
            )}
            {/* Empty state - Project purpose */}
            {!report.Project_Purpose__c && (
                <SectionEmpty
                    type="report"
                    headline={label(
                        'objects.initiativeReport.Project_Purpose__c'
                    )}
                />
            )}

            {/* Progress goals */}
            {report.Progress_Towards_Grant_Area_Themes__c && (
                <TextCard
                    className="mt-32"
                    hasBackground={true}
                    headline={label(
                        'objects.initiativeReport.Progress_Towards_Grant_Area_Themes__c'
                    )}
                    body={report.Progress_Towards_Grant_Area_Themes__c}
                />
            )}
            {/* Empty state - Progress goals */}
            {!report.Project_Purpose__c && (
                <SectionEmpty
                    type="report"
                    headline={label(
                        'objects.initiativeReport.Progress_Towards_Grant_Area_Themes__c'
                    )}
                />
            )}

            {/* Important results */}
            {report.Important_Results__c && (
                <TextCard
                    className="mt-32"
                    hasBackground={true}
                    headline={label(
                        'objects.initiativeReport.Important_Results__c'
                    )}
                    body={report.Important_Results__c}
                />
            )}
            {/* Empty state - Important results */}
            {!report.Important_Results__c && (
                <SectionEmpty
                    type="report"
                    headline={label(
                        'objects.initiativeReport.Important_Results__c'
                    )}
                />
            )}
        </SectionWrapper>
    );
};

ReportSummaryComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportSummaryComponent.defaultProps = {};

export default ReportSummaryComponent;
