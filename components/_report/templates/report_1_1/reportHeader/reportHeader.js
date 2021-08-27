// React
import React, { useState, useEffect } from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/sectionWrapper';

const ReportHeaderComponent = ({ initiative, report, constants }) => {
    const [mainApplicant, setMainApplicant] = useState();

    // Hook: Metadata
    const { label } = useMetadata();

    useEffect(() => {
        // Report main applicant
        const applicant = Object.values(initiative?._collaborators).filter(
            item => item.Type__c === constants.TYPES.MAIN_COLLABORATOR
        );
        setMainApplicant(applicant[0]?.Account__r?.Name);
    }, [initiative]);

    return (
        <SectionWrapper>
            <SectionWrapper>
                <div className="relative w-64 h-64 overflow-hidden rounded-4 bg-blue-10">
                    {initiative.Hero_Image_URL__c && (
                        <Image
                            src={initiative.Hero_Image_URL__c}
                            layout="fill"
                            objectFit="cover"
                        />
                        // <img
                        //     className="w-full h-full"
                        //     src={initiative.Hero_Image_URL__c}
                        // />
                    )}
                </div>
                <div className="mt-16">{mainApplicant}</div>

                <h1 className="mt-48 t-h1">{initiative.Name}</h1>
                <div className="mt-16 t-sh2">
                    {`${report.Report_Type__c} ${label(
                        'custom.FA_TitleReport'
                    )} ${report.Due_Date__c?.substring(0, 4)}`}
                </div>
                <div className="flex mt-16 t-caption text-blue-60">
                    {report.Funder_Report__r.Application_Id__c}
                    {initiative.Stage__c && ` • ${initiative.Stage__c}`}
                </div>
            </SectionWrapper>
        </SectionWrapper>
    );
};

ReportHeaderComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportHeaderComponent.defaultProps = {};

export default ReportHeaderComponent;
