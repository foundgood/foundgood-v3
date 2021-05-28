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

const ReportEvaluationsComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label } = useMetadata();

    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        // Make sure we have Report Details
        if (Object.values(initiative._reportDetails).length > 0) {
            // Evaluations
            const evaluations = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == constants.TYPES.EVALUATION
                        ? true
                        : false;
                })
                .map(item => {
                    return item.Description__c;
                });
            setEvaluations(evaluations);
        }
    }, []);

    return (
        <SectionWrapper
            id={asId(label('custom.FA_ReportWizardMenuEvaluations'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label(
                            'custom.FA_ReportViewSubHeadingEvaluationsOverall'
                        )}
                    </h3>
                    <UpdateButton mode="report" baseUrl="evaluations" />
                </div>
            </SectionWrapper>
            {evaluations?.length > 0 &&
                evaluations?.map((item, index) => (
                    <div key={`i-${index}`}>
                        <TextCard
                            hasBackground={true}
                            headline={label(
                                'custom.FA_ReportViewSubHeadingEvaluationsReflections'
                            )}
                            body={item}
                        />

                        {index < evaluations.length - 1 && <DividerLine />}
                    </div>
                ))}
            {evaluations?.length < 1 && <SectionEmpty type="report" />}
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
