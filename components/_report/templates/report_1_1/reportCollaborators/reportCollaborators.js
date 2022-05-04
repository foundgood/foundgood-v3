// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import dayjs from 'dayjs';

// Utilities
import { useLabels } from 'utilities/hooks';
import { asId } from 'utilities';

// Components
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import UpdateButton from 'components/updateButton';
import ReportDetailCard from 'components/_initiative/reportDetailCard';
import TextCard from 'components/_initiative/textCard';

const ReportCollaboratorsComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label } = useLabels();

    const [collaborators, setCollaborators] = useState([]);

    useEffect(() => {
        // Make sure we have Report Details
        if (Object.values(initiative._reportDetails).length > 0) {
            // Collaborators are split in two groups
            // "Co-applicants" & "Additional Collaborator"
            // Get all and then split them
            const collaborators = Object.values(initiative._reportDetails)
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
                .filter(item =>
                    constants.COLLABORATORS.ADDITIONAL_COLLABORATORS.includes(
                        item.Type__c
                    )
                );
            setCollaborators(collaborators);
        } else {
            setCollaborators([]);
        }
    }, [initiative, report.Id]);

    return (
        <SectionWrapper id={asId(label('ReportWizardMenuCollaborations'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label('ReportViewSubHeadingCollaborationsOverall')}
                    </h3>
                    <UpdateButton mode="report" baseUrl="collaborators" />
                </div>
            </SectionWrapper>

            {/*
                1. Items but no reflections
                2. No items
                3. Items with reflection
            */}
            {collaborators?.length > 0 &&
            collaborators?.filter(item => item.reportReflection).length < 1 ? (
                <SectionEmpty type="noReflections" />
            ) : collaborators?.length < 1 ? (
                <SectionEmpty type="report" />
            ) : (
                collaborators?.map((item, index) => (
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
                                        text: `${dayjs(
                                            item.Start_Date__c
                                        ).format('DD.MM.YYYY')} - ${dayjs(
                                            item.End_Date__c
                                        ).format('DD.MM.YYYY')}`,
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

ReportCollaboratorsComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportCollaboratorsComponent.defaultProps = {};

export default ReportCollaboratorsComponent;
