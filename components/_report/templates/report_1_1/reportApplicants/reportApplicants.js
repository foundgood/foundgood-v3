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
import ReportDetailCard from 'components/_initiative/reportDetailCard';
import TextCard from 'components/_initiative/textCard';

const ReportApplicantsComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label } = useLabels();

    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        // Make sure we have Report Details
        if (Object.values(initiative._reportDetails).length > 0) {
            // Collaborators are split in two groups
            // "Co-applicants" & "Additional Collaborator"
            // Get all and then split them
            const applicants = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c ==
                        constants.REPORT_DETAILS.COLLABORATOR_OVERVIEW
                        ? true
                        : false;
                })
                .map(item => {
                    // Get collaborator based on key
                    let collaborator = {
                        ...initiative._collaborators[
                            item.Initiative_Collaborator__c
                        ],
                    };

                    // Report reflection
                    const reflection =
                        item.Description__c === constants.CUSTOM.NO_REFLECTIONS
                            ? null
                            : item.Description__c;

                    // Add to collaborator
                    if (reflection) {
                        collaborator = {
                            ...collaborator,
                            reportReflection: reflection,
                        };
                    }

                    return collaborator;
                })
                .filter(
                    item =>
                        !constants.COLLABORATORS.ADDITIONAL_COLLABORATORS.includes(
                            item.Type__c
                        )
                );
            setApplicants(applicants);
        } else {
            setApplicants([]);
        }
    }, [initiative, report.Id]);

    return (
        <SectionWrapper id={asId(label('ReportWizardMenuApplicants'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label('InitiativeViewApplicantsHeading')}
                    </h3>
                    <UpdateButton
                        {...{
                            context: 'report',
                            baseUrl: 'applicants',
                            rules: getPermissionRules(
                                'report',
                                'applicants',
                                'update'
                            ),
                        }}
                    />
                </div>
            </SectionWrapper>

            {/*
                1. Items but no reflections
                2. No items
                3. Items
            */}
            {applicants?.length > 0 &&
            applicants?.filter(item => item.reportReflection).length < 1 ? (
                <SectionEmpty type="noReflections" />
            ) : applicants?.length < 1 ? (
                <SectionEmpty type="report" />
            ) : (
                applicants?.map((item, index) => (
                    <div key={`a-${index}`}>
                        <SectionWrapper>
                            <ReportDetailCard
                                headline={item.Account__r?.Name}
                                image="" // Collaborators don't have an image
                                description="" // Collaborators don't have a description
                                items={[
                                    {
                                        label: label(
                                            'ReportViewCollaboratorType'
                                        ),
                                        text: item.Type__c,
                                    },
                                    {
                                        label: label(
                                            'ReportViewCollaborationPeriod'
                                        ),
                                        text: `${item.Start_Date__c} - ${item.End_Date__c}`,
                                    },
                                ]}
                            />
                        </SectionWrapper>

                        <TextCard
                            hasBackground={true}
                            headline={label('ReportViewUpdatesForReport')}
                            body={item.reportReflection}
                        />
                    </div>
                ))
            )}
        </SectionWrapper>
    );
};

ReportApplicantsComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportApplicantsComponent.defaultProps = {};

export default ReportApplicantsComponent;
