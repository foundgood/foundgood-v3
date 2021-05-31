// React
import React from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';

// Components
import SectionWrapper from 'components/sectionWrapper';

const ReportHeaderComponent = ({ initiative, report }) => {
    return (
        <SectionWrapper>
            <SectionWrapper>
                <div className="w-64 h-64 overflow-hidden rounded-4">
                    {initiative.Hero_Image_URL__c && (
                        <Image
                            src={initiative.Hero_Image_URL__c}
                            width="64"
                            height="64"></Image>
                        // <img
                        //     className="w-full h-full"
                        //     src={initiative.Hero_Image_URL__c}
                        // />
                    )}
                </div>
                <div className="mt-16">{initiative.Lead_Grantee__r?.Name}</div>

                <h1 className="mt-48 t-h1">{initiative.Name}</h1>
                <div className="mt-16 t-sh2">
                    {report.Report_Type__c}{' '}
                    {report.Due_Date__c?.substring(0, 4)}
                </div>
                <div className="flex mt-16 t-caption text-blue-60">
                    {/* Which id to show? */}
                    {initiative.Application_Id__c}
                    <div className="mx-4">•</div>
                    {initiative.Stage__c}
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
