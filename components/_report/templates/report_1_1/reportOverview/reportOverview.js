// React
import React from 'react';

// Packages
import t from 'prop-types';
import dayjs from 'dayjs';

// Utilities
import { useLabels } from 'utilities/hooks';
import { asId } from 'utilities';

// Components
import SectionWrapper from 'components/sectionWrapper';
import UpdateButton from 'components/updateButton';
import GridBox from 'components/gridBox';

const ReportOverviewComponent = ({ utilities, report }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object, pickList, getValueLabel } = useLabels();

    // ///////////////////
    // DATA
    // ///////////////////

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

    const initiative = utilities.initiative.get();

    const funders = utilities.funders.getAll();

    const funderReportApplicationId =
        report.Funder_Report__r?.Application_Id__c ?? null;

    const coFunders = funders
        .filter(item => item.Application_Id__c !== funderReportApplicationId)
        .map(item => item.Account__r.Name);

    const coApplicants = utilities.collaborators
        .getTypeApplicantsCreate()
        .map(item => item.Account__r.Name);

    const totalAmount = funders.reduce((acc, funder) => {
        return acc + funder.Amount__c;
    }, 0);

    const reportFunder = funders.reduce((acc, item) => {
        if (item.Application_Id__c === funderReportApplicationId) {
            return {
                ...acc,
                name: item.Account__r?.Name,
                amount: `${
                    item.CurrencyIsoCode
                } ${item.Amount__c?.toLocaleString('de-DE')}`,
                share: `${Math.round((item.Amount__c / totalAmount) * 100)} %`,
            };
        }
    }, {});

    const funderObjective = utilities.goals.getTypePredefined();

    const funder = utilities.funders.getFromAccountId(
        report.Funder_Report__r?.Account__r?.Id
    );

    const sdgNums = initiative.Problem_Effect__c?.split(';');
    const sdgs = pickList('Initiative__c.Problem_Effect__c');

    const developmentGoals = sdgNums.map(num => ({
        title: sdgs.find(sdg => sdg.value === num)?.label ?? null,
        amount: num,
    }));

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <SectionWrapper id={asId(label('ReportWizardMenuOverview'))}>
            {/* Title and summary */}
            <SectionWrapper>
                <div className="flex justify-between">
                    <h3 className="t-h4">
                        {label('ReportViewHeadingOverview')}
                    </h3>
                    <UpdateButton mode="report" baseUrl="overview" />
                </div>
                <h3 className="mt-24 t-preamble">{initiative.Summary__c}</h3>
            </SectionWrapper>

            {/* Information cards */}
            <div className="inline-grid items-start w-full grid-cols-1 md:grid-cols-2 md:gap-24">
                <GridBox>
                    <div className="t-sh6 text-blue-60">
                        {label('InitiativeViewGrantGivingArea')}
                    </div>
                    <h3 className="mb-16 t-h5">{initiative.Category__c}</h3>
                    <div className="t-sh6 text-blue-60">
                        {object.label('Initiative_Goal__c.Funder_Objective__c')}
                    </div>
                    <h3 className="t-h5">
                        {getValueLabel(
                            'Initiative_Goal__c.Funder_Objective__c',
                            funderObjective.Funder_Objective__c,
                            true
                        )}
                    </h3>
                    <div className="mt-16 t-sh6 text-blue-60">
                        {label('InitiativeViewSDGSs')}
                    </div>
                    <div className="flex flex-col">
                        {developmentGoals.length > 0 ? (
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
                            ))
                        ) : (
                            <div>{label('ReportEmptySDGs')}</div>
                        )}
                    </div>
                </GridBox>

                <GridBox>
                    {/* Grant dates */}
                    <div className="t-sh6 text-blue-60">
                        {label('ReportViewGrantStartEndDate')}
                    </div>
                    <h3 className="t-h5">
                        {dayjs(funder.Grant_Start_Date__c).format('DD.MM.YYYY')}
                        {' - '}
                        {dayjs(funder.Grant_End_Date__c).format('DD.MM.YYYY')}
                    </h3>

                    {/* Location */}
                    <div className="mt-16 t-sh6 text-blue-60">
                        {label('InitiativeViewInitiativeLocation')}
                    </div>
                    {initiative.Translated_Where_Is_Problem__c ? (
                        <h3 className="t-h5">
                            {initiative.Translated_Where_Is_Problem__c?.split(
                                ';'
                            ).join(', ')}
                        </h3>
                    ) : (
                        <div>{label('ReportEmptyLocation')}</div>
                    )}
                </GridBox>

                <GridBox>
                    {/* List of co-funders */}
                    <div className="t-sh6 text-blue-60">
                        {label('ReportViewCoFunders')}
                    </div>
                    <div>
                        {coFunders.length > 0
                            ? coFunders.map((item, index) => (
                                  <h3 key={`f-${index}`} className="t-h5">
                                      {item}
                                  </h3>
                              ))
                            : label('ReportEmptyCoFunders')}
                    </div>

                    {/* List of co-applicants */}
                    <div className="mt-16 t-sh6 text-blue-60">
                        {label('ReportViewCoApplicants')}
                    </div>
                    {coApplicants?.length > 0 ? (
                        <h3 className="t-h5">{coApplicants.join(', ')}</h3>
                    ) : (
                        <div>{label('ReportEmptyCoApplicants')}</div>
                    )}
                </GridBox>

                {reportFunder && (
                    <GridBox>
                        <div className="t-sh6 text-blue-60">
                            {label('ReportViewAmountByFunder')}{' '}
                            {reportFunder.name}
                        </div>
                        <h3 className="t-h5">{reportFunder.amount}</h3>

                        <div className="mt-16 t-sh6 text-blue-60">
                            {label('ReportViewShareOfTotalFunding')}
                        </div>
                        <h3 className="t-h5">{reportFunder.share}</h3>
                    </GridBox>
                )}
            </div>
        </SectionWrapper>
    );
};

ReportOverviewComponent.propTypes = {
    utilities: t.object.isRequired,
    report: t.object.isRequired,
};

ReportOverviewComponent.defaultProps = {};

export default ReportOverviewComponent;
