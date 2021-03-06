// React
import React, { useEffect, useState } from 'react';

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
import DividerLine from 'components/_initiative/dividerLine';

const ReportEvaluationsComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label } = useLabels();

    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        // Make sure we have Report Details
        if (Object.values(initiative._reportDetails).length > 0) {
            // Evaluations
            const evaluations = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == constants.REPORT_DETAILS.EVALUATION
                        ? true
                        : false;
                })
                .map(item => {
                    // Report reflection
                    const reflection =
                        item.Description__c === constants.CUSTOM.NO_REFLECTIONS
                            ? null
                            : item.Description__c;

                    return reflection
                        ? {
                              reportReflection: reflection,
                              subHeading: item.Who_Is_Evaluating__c,
                          }
                        : {};
                });
            setEvaluations(evaluations);
        } else {
            setEvaluations([]);
        }
    }, [initiative, report.Id]);

    return (
        <SectionWrapper id={asId(label('ReportWizardMenuEvaluations'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label('ReportViewSubHeadingEvaluationsOverall')}
                    </h3>
                    <UpdateButton
                        {...{
                            context: 'report',
                            baseUrl: 'evaluations',
                            rules: getPermissionRules(
                                'report',
                                'evaluations',
                                'update'
                            ),
                        }}
                    />
                </div>
            </SectionWrapper>
            {/*
                1. Items but no reflections
                2. No items
                3. Items with reflection
            */}
            {evaluations?.length > 0 &&
            evaluations?.filter(item => item.reportReflection).length < 1 ? (
                <SectionEmpty type="noReflections" />
            ) : evaluations?.length < 1 ? (
                <SectionEmpty type="report" />
            ) : (
                evaluations
                    ?.filter(item => item.reportReflection)
                    ?.map((item, index) => (
                        <div key={`i-${index}`}>
                            <SectionWrapper paddingY={false}>
                                <p className="mb-24 t-h6">{item.subHeading}</p>
                            </SectionWrapper>
                            <TextCard
                                hasBackground={true}
                                headline={label(
                                    'ReportViewSubHeadingEvaluationsReflections'
                                )}
                                body={item.reportReflection}
                            />

                            {index < evaluations.length - 1 && <DividerLine />}
                        </div>
                    ))
            )}
        </SectionWrapper>
    );
};

ReportEvaluationsComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportEvaluationsComponent.defaultProps = {};

export default ReportEvaluationsComponent;
