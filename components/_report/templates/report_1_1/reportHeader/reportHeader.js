// React
import React from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/sectionWrapper';

const ReportHeaderComponent = ({ utilities, report }) => {
    /// ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // DATA
    // ///////////////////

    const initiative = utilities.initiative.get();
    const mainCollaborator = utilities.collaborators.getTypeMain();

    // ///////////////////
    // RENDER
    // ///////////////////

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
                    )}
                </div>
                <div className="mt-16">{mainCollaborator.Account__r?.Name}</div>
                <h1 className="mt-48 t-h1">{initiative.Name}</h1>
                <div className="mt-16 t-sh2">{`${report.Report_Type__c} ${label(
                    'TitleReport'
                )} ${report.Due_Date__c?.substring(0, 4)}`}</div>
                <div className="flex mt-16 t-caption text-blue-60">
                    {report.Funder_Report__r?.Application_Id__c}
                    {initiative.Stage__c && ` • ${initiative.Stage__c}`}
                </div>
            </SectionWrapper>
        </SectionWrapper>
    );
};

ReportHeaderComponent.propTypes = {
    utilities: t.object.isRequired,
    report: t.object.isRequired,
};

ReportHeaderComponent.defaultProps = {};

export default ReportHeaderComponent;
