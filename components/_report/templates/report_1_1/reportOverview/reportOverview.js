// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import dayjs from 'dayjs';

// Utilities
import { useMetadata } from 'utilities/hooks';
import { asId } from 'utilities';

// Components
import SectionWrapper from 'components/sectionWrapper';
import UpdateButton from 'components/updateButton';

const ReportOverviewComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label, valueSet, getValueLabel } = useMetadata();

    const [developmentGoals, setDevelopmentGoals] = useState();
    const [coApplicants, setCoApplicants] = useState([]);
    const [coFunders, setCoFunders] = useState([]);
    const [reportFunder, setReportFunder] = useState();

    const sdgsColors = [
        '#E32840',
        '#DCA545',
        '#4F9E3E',
        '#C31D32',
        '#FC3D2E',
        '#33BEE0',
        '#FBC230',
        '#A01C44',
        '#FB6A33',
        '#DB1C68',
        '#FB9D37',
        '#BE8A38',
        '#417D47',
        '#1D98D7',
        '#5ABE38',
        '#0D699B',
        '#1C4969',
    ];

    useEffect(() => {
        // Make sure we have funders & collaborators
        // Overview details + Funders numbers
        if (
            Object.values(initiative._funders).length > 0 &&
            Object.values(initiative._collaborators).length > 0
        ) {
            // Total Amount
            const totalAmount = Object.values(initiative._funders).reduce(
                (total, funder) => {
                    return total + funder.Amount__c;
                },
                0
            );

            // Report funder details
            const funderId = report.Funder_Report__r.Application_Id__c;
            const reportFunder = Object.values(initiative._funders)
                .filter(item => item.Application_Id__c === funderId)
                .map(item => ({
                    name: item.Account__r?.Name,
                    amount: `${
                        item.CurrencyIsoCode
                    } ${item.Amount__c?.toLocaleString('de-DE')}`,
                    share: `${Math.round(
                        (item.Amount__c / totalAmount) * 100
                    )}%`,
                }))[0];
            setReportFunder(reportFunder);

            // Co-Funders & Co-Applicants (used in Header)
            const coFunders = Object.values(initiative._funders)
                .filter(item => item.Application_Id__c !== funderId)
                .map(item => item.Account__r.Name);
            setCoFunders(coFunders);

            const coApplicants = Object.values(initiative._collaborators)
                .filter(item =>
                    constants.TYPES.APPLICANTS_CREATE.includes(item.Type__c)
                )
                .map(item => item.Account__r.Name);
            setCoApplicants(coApplicants);

            // Header - Merge goal data, to signel array
            const sdgNums = initiative?.Problem_Effect__c?.split(';');
            const sdgs = valueSet('initiative.Problem_Effect__c'); // get global sdgs
            if (sdgNums?.length > 0) {
                const developmentGoals = sdgNums.map(num => {
                    return { title: sdgs[num - 1].label, amount: num };
                });
                setDevelopmentGoals(developmentGoals);
            }
        } else {
            setReportFunder(null);
            setCoFunders([]);
            setCoApplicants([]);
            setDevelopmentGoals(null);
        }
    }, [initiative]);

    // Funder objective
    const funderObjective =
        Object.values(initiative?._goals).find(
            item => item.Type__c === constants.TYPES.GOAL_PREDEFINED
        ) || {};

    // Funder
    const funder = Object.values(initiative._funders).find(
        funder => funder.Account__c === report.Funder_Report__r.Account__r.Id
    );

    return (
        <SectionWrapper id={asId(label('custom.FA_ReportWizardMenuOverview'))}>
            <SectionWrapper>
                <div className="flex justify-between">
                    <h3 className="t-h4">
                        {label('custom.FA_ReportViewHeadingOverview')}
                    </h3>
                    <UpdateButton mode="report" baseUrl="overview" />
                </div>
                <h3 className="mt-24 t-preamble">{initiative.Summary__c}</h3>
            </SectionWrapper>
            {/* Information cards */}
            <div className="inline-grid items-start w-full grid-cols-1 md:grid-cols-2 md:gap-24">
                <div className="p-16 border-4 border-gray-10 rounded-8">
                    <div className="t-sh6 text-blue-60">
                        {label('custom.FA_InitiativeViewGrantGivingArea')}
                    </div>
                    <h3 className="mt-20 mb-16 t-h5">
                        {initiative.Category__c}
                    </h3>
                    <div className="t-sh6 text-blue-60">
                        {label('objects.initiativeGoal.Funder_Objective__c')}
                    </div>
                    <h3 className="t-h5">
                        {getValueLabel(
                            'initiativeGoal.Funder_Objective__c',
                            funderObjective.Funder_Objective__c,
                            true
                        )}
                    </h3>
                    <div className="mt-16 t-sh6 text-blue-60">
                        {label('custom.FA_InitiativeViewSDGSs')}
                    </div>
                    <div className="flex flex-col">
                        {developmentGoals &&
                            developmentGoals.map((problem, index) => (
                                <h3 key={`g-${index}`} className="mt-8 t-h5">
                                    <span
                                        className={`px-6 pt-4 mr-8 leading-none text-white rounded-4`}
                                        style={{
                                            backgroundColor:
                                                sdgsColors[problem.amount - 1],
                                        }}>
                                        {problem.amount}
                                    </span>
                                    {problem.title}
                                </h3>
                            ))}
                        {!developmentGoals && (
                            <div>{label('custom.FA_ReportEmptySDGs')}</div>
                        )}
                    </div>
                </div>
                <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                    <div className="t-sh6 text-blue-60">
                        {label('custom.FA_ReportViewGrantStartEndDate')}
                    </div>
                    <h3 className="t-h5">
                        {dayjs(funder.Grant_Start_Date__c).format('DD.MM.YYYY')}
                        {' - '}
                        {dayjs(funder.Grant_End_Date__c).format('DD.MM.YYYY')}
                    </h3>
                    <div className="mt-16 t-sh6 text-blue-60">
                        {label('custom.FA_InitiativeViewInitiativeLocation')}
                    </div>
                    {/* Location */}
                    {initiative.Translated_Where_Is_Problem__c && (
                        <h3 className="t-h5">
                            {initiative.Translated_Where_Is_Problem__c?.split(
                                ';'
                            ).join(', ')}
                        </h3>
                    )}
                    {/* Empty state - No Location */}
                    {!initiative.Translated_Where_Is_Problem__c && (
                        <div>{label('custom.FA_ReportEmptyLocation')}</div>
                    )}
                </div>
                <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                    <div className="t-sh6 text-blue-60">
                        {label('custom.FA_ReportViewCoFunders')}
                    </div>

                    <div>
                        {/* List of co-funders */}
                        {coFunders?.length > 0 &&
                            coFunders?.map((item, index) => (
                                <h3 key={`f-${index}`} className="t-h5">
                                    {item}
                                </h3>
                            ))}
                        {/* Empty state - NO co-funders */}
                        {coFunders?.length < 1 &&
                            label('custom.FA_ReportEmptyCoFunders')}
                    </div>
                    <div className="mt-16 t-sh6 text-blue-60">
                        {label('custom.FA_ReportViewCoApplicants')}
                    </div>
                    {/* List of co-applicants */}
                    {coApplicants?.length > 0 && (
                        <h3 className="t-h5">{coApplicants.join(', ')}</h3>
                    )}
                    {/* Empty state - NO co-applicants */}
                    {coApplicants?.length < 1 && (
                        <div>{label('custom.FA_ReportEmptyCoApplicants')}</div>
                    )}
                </div>
                {reportFunder && (
                    <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                        <div className="t-sh6 text-blue-60">
                            {label('custom.FA_ReportViewAmountByFunder')}{' '}
                            {reportFunder.name}
                        </div>
                        <h3 className="t-h5">{reportFunder.amount}</h3>

                        <div className="mt-16 t-sh6 text-blue-60">
                            {label('custom.FA_ReportViewShareOfTotalFunding')}
                        </div>
                        <h3 className="t-h5">{reportFunder.share}</h3>
                    </div>
                )}
            </div>
        </SectionWrapper>
    );
};

ReportOverviewComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportOverviewComponent.defaultProps = {};

export default ReportOverviewComponent;
