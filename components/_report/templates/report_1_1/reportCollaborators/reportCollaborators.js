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
import ReportDetailCard from 'components/_initiative/reportDetailCard';
import TextCard from 'components/_initiative/textCard';

const ReportCollaboratorsComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label } = useMetadata();

    const [collaborators, setCollaborators] = useState([]);

    useEffect(() => {
        // Make sure we have Report Details
        if (Object.values(initiative._reportDetails).length > 0) {
            // Collaborators are split in two groups
            // "Co-applicants" & "Additional Collaborator"
            // Get all and then split them
            const allCollaborators = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == constants.TYPES.COLLABORATOR_OVERVIEW
                        ? true
                        : false;
                })
                .map(item => {
                    // Get funder based on key
                    const collaborator =
                        initiative._collaborators[
                            item.Initiative_Collaborator__c
                        ];
                    // Add Report Reflection text to collaborators
                    collaborator.reportReflection = item.Description__c;
                    return collaborator;
                });
            const collaborators = allCollaborators.filter(item =>
                constants.TYPES.COLLABORATORS.includes(item.Type__c)
            );
            setCollaborators(collaborators);
        }
    }, []);

    return (
        <SectionWrapper
            id={asId(label('custom.FA_ReportWizardMenuCollaborations'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label(
                            'custom.FA_ReportViewSubHeadingCollaborationsOverall'
                        )}
                    </h3>
                    <UpdateButton mode="report" baseUrl="collaborators" />
                </div>
            </SectionWrapper>

            {collaborators?.length > 0 &&
                collaborators?.map((item, index) => (
                    <div key={`c-${index}`}>
                        <SectionWrapper>
                            <ReportDetailCard
                                headline={item.Account__r.Name}
                                image="" // Collaborators don't have an image
                                description="" // Collaborators don't have a description
                                items={[
                                    {
                                        label: label(
                                            'custom.FA_ReportViewCollaboratorType'
                                        ),
                                        text: item.Type__c,
                                    },
                                    {
                                        label: label(
                                            'custom.FA_ReportViewCollaborationPeriod'
                                        ),
                                        text: `${item.Start_Date__c} - ${item.End_Date__c}`,
                                    },
                                ]}
                            />
                        </SectionWrapper>
                        <TextCard
                            hasBackground={true}
                            headline={label(
                                'custom.FA_ReportViewSubHeadingCollaborationReflections'
                            )}
                            body={item.reportReflection}
                        />
                    </div>
                ))}
            {collaborators?.length < 1 && <SectionEmpty type="report" />}
        </SectionWrapper>
    );
};

ReportCollaboratorsComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportCollaboratorsComponent.defaultProps = {};

export default ReportCollaboratorsComponent;
