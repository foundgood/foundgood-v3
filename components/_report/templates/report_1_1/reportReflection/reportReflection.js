// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { asId, getPermissionRules } from 'utilities';
import { useLabels } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import UpdateButton from 'components/updateButton';
import TextCard from 'components/_initiative/textCard';

const ReportSummaryComponent = ({ report }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////
    const { label, object } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <SectionWrapper id={asId(label('ReportWizardMenuEndReflections'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label('ReportViewHeadingEndReflections')}
                    </h3>
                    <UpdateButton
                        {...{
                            context: 'report',
                            baseUrl: 'end-of-grant-reflections',
                            rules: getPermissionRules(
                                'report',
                                'endOfGrantReflections',
                                'update'
                            ),
                        }}
                    />
                </div>
            </SectionWrapper>

            {/* Project purpose */}
            {report.Project_Purpose__c ? (
                <TextCard
                    hasBackground={true}
                    headline={object.label('Initiative__c.Project_Purpose__c')}
                    body={report.Project_Purpose__c}
                />
            ) : (
                <SectionEmpty
                    type="report"
                    headline={object.label('Initiative__c.Project_Purpose__c')}
                />
            )}

            {/* Progress goals */}
            {report.Progress_Towards_Grant_Area_Themes__c ? (
                <TextCard
                    className="mt-32"
                    hasBackground={true}
                    headline={object.label(
                        'Initiative__c.Progress_Towards_Grant_Area_Themes__c'
                    )}
                    body={report.Progress_Towards_Grant_Area_Themes__c}
                />
            ) : (
                <SectionEmpty
                    type="report"
                    headline={object.label(
                        'Initiative__c.Progress_Towards_Grant_Area_Themes__c'
                    )}
                />
            )}

            {/* Important results */}
            {report.Important_Results__c ? (
                <TextCard
                    className="mt-32"
                    hasBackground={true}
                    headline={object.label(
                        'Initiative__c.Important_Results__c'
                    )}
                    body={report.Important_Results__c}
                />
            ) : (
                <SectionEmpty
                    type="report"
                    headline={object.label(
                        'Initiative__c.Important_Results__c'
                    )}
                />
            )}
        </SectionWrapper>
    );
};

ReportSummaryComponent.propTypes = {
    report: t.object.isRequired,
};

ReportSummaryComponent.defaultProps = {};

export default ReportSummaryComponent;
