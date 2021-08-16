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
import DividerLine from 'components/_initiative/dividerLine';

const ReportInfluencesComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label } = useMetadata();

    const [influences, setInfluences] = useState([]);

    useEffect(() => {
        // Make sure we have Report Details
        if (Object.values(initiative._reportDetails).length > 0) {
            // Influence on policy
            const influences = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == constants.TYPES.INFLUENCE_ON_POLICY
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
                              subHeading: item.Type_Of_Influence__c,
                          }
                        : {};
                });
            setInfluences(influences);
        }
    }, []);

    return (
        <SectionWrapper id={asId(label('custom.FA_ReportWizardMenuInfluence'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label(
                            'custom.FA_ReportViewSubHeadingInfluencesOverall'
                        )}
                    </h3>
                    <UpdateButton mode="report" baseUrl="influence-on-policy" />
                </div>
            </SectionWrapper>

            {/*
                1. Items but no reflections
                2. No items
                3. Items with reflection
            */}
            {influences?.length > 0 &&
            influences?.filter(item => item.reportReflection).length < 1 ? (
                <SectionEmpty type="noReflections" />
            ) : influences?.length < 1 ? (
                <SectionEmpty type="report" />
            ) : (
                influences
                    ?.filter(item => item.reportReflection)
                    .map((item, index) => (
                        <div key={`i-${index}`}>
                            <SectionWrapper paddingY={false}>
                                <p className="mb-24 t-h6">{item.subHeading}</p>
                            </SectionWrapper>
                            <TextCard
                                hasBackground={true}
                                headline={label(
                                    'custom.FA_ReportViewSubHeadingInfluencesReflections'
                                )}
                                body={item.reportReflection}
                            />

                            {index < influences.length - 1 && <DividerLine />}
                        </div>
                    ))
            )}
        </SectionWrapper>
    );
};

ReportInfluencesComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportInfluencesComponent.defaultProps = {};

export default ReportInfluencesComponent;
