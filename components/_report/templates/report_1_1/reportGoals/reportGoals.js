// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';
import { asId } from 'utilities';

// Components
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import UpdateButton from 'components/updateButton';
import TextCard from 'components/_initiative/textCard';

const ReportGoalsComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label, getValueLabel } = useLabels();

    const [isNnfLeadFunder, setIsNnfLeadFunder] = useState(false);

    useEffect(() => {
        const nnfLeadFunder = Object.values(initiative._funders).filter(
            item =>
                item.Type__c === constants.ACCOUNT.LEAD_FUNDER &&
                item.Account__c === constants.IDS.NNF_ACCOUNT
        );
        const isNnfLeadFunder = nnfLeadFunder.length > 0 ? true : false;
        setIsNnfLeadFunder(isNnfLeadFunder);
    }, [initiative]);

    return (
        <SectionWrapper id={asId(label('ReportWizardMenuGoals'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {/* Show to different headings. Depending on if lead funder is Novo Nordisk Foundation */}
                        {!isNnfLeadFunder &&
                            label('InitiativeViewGoalsHeading')}
                        {isNnfLeadFunder &&
                            label('ReportViewHeadingFunderObjectives')}
                    </h3>
                    {!isNnfLeadFunder && (
                        <UpdateButton mode="report" baseUrl="goals" />
                    )}
                </div>
            </SectionWrapper>

            {Object.values(initiative._goals).length > 0 &&
                Object.values(initiative._goals).map((item, index) => {
                    const title =
                        item.Type__c == constants.GOALS.GOAL_CUSTOM
                            ? item.Goal__c
                            : getValueLabel(
                                  'Initiative_Goal__c.Funder_Objective__c',
                                  item.Funder_Objective__c,
                                  true
                              );
                    return (
                        <TextCard
                            key={`g-${index}`}
                            hasBackground={false}
                            className="mt-32"
                            headline={title}
                            label={item.Type__c}
                        />
                    );
                })}
            {Object.values(initiative._goals).length < 1 && (
                <SectionEmpty type="report" />
            )}
        </SectionWrapper>
    );
};

ReportGoalsComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportGoalsComponent.defaultProps = {};

export default ReportGoalsComponent;
