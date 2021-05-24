// React
import React, { useEffect, useState } from 'react';

// Packages
import Image from 'next/image';
import t from 'prop-types';
import { useRouter } from 'next/router';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';
import { stripUndefined, isJson } from 'utilities';

// Components
import SectionWrapper from 'components/sectionWrapper';
import ReportDetailCard from 'components/_initiative/reportDetailCard';
import ReportSharingCard from 'components/_initiative/reportSharingCard';
import TextCard from 'components/_initiative/textCard';
import NumberCard from 'components/_initiative/numberCard';
import DividerLine from 'components/_initiative/dividerLine';
import ChartCard from 'components/_initiative/chartCard';

const ReportComponent = ({ pageProps }) => {
    const router = useRouter();
    const { reportId } = router.query;

    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Fetch initiative data
    const {
        CONSTANTS,
        // reset,
        initiative,
        populateReportDetails,
        // getReportDetails,
    } = useInitiativeDataStore();

    // Hook: Metadata
    const { labelTodo, label } = useMetadata();

    // Data manipulation
    const [developmentGoals, setDevelopmentGoals] = useState();
    const [initiativeData, setInitiativeData] = useState();
    const [donutData, setDonutData] = useState();
    const [pieChartStyle, setPieChartStyle] = useState({});
    const [totalAmount, setTotalAmount] = useState();
    const [currency, setCurrency] = useState();

    // Overview
    const [coApplicants, setCoApplicants] = useState();
    const [coFunders, setCoFunders] = useState();
    const [novoFunder, setNovoFunder] = useState();

    // Specific data for this report

    const [currentReport, setCurrentReport] = useState();
    const [funders, setFunders] = useState();
    const [applicants, setApplicants] = useState();
    const [collaborators, setCollaborators] = useState();
    const [
        employeesFundedReflection,
        setEmployeesFundedReflection,
    ] = useState();
    const [employeeGroups, setEmployeeGroups] = useState();

    // const [goals, setGoals] = useState();
    const [activities, setActivities] = useState();
    const [results, setResults] = useState();
    const [outcomes, setOutcomes] = useState();
    const [influences, setInfluences] = useState();
    const [evaluations, setEvaluations] = useState();

    const donutColors = [
        'bg-teal-60',
        'bg-blue-60',
        'bg-coral-60',
        'bg-amber-60',
    ];
    const donutHex = [
        '#507C93', // bg-teal-60
        '#545E92', // bg-blue-60
        '#995B57', // bg-coral-60
        '#977958', // bg-amber-60
    ];

    useEffect(() => {
        // Temporary fix! - Clear initiative data
        // - User could be looking at hard coded link to another initiative
        // - Opening the report needs to wait for loading correct initiative
        // reset();
    }, []);

    useEffect(() => {
        if (reportId) {
            populateReportDetails(reportId);
        }
    }, [reportId]);

    useEffect(() => {
        // Initial Load - Handle empty object state?
        if (
            reportId &&
            initiative?._activities &&
            Object.keys(initiative?._activities).length !== 0 &&
            initiative?._reports &&
            Object.keys(initiative?._reports).length !== 0 &&
            initiative?._reportDetails &&
            Object.keys(initiative?._reportDetails).length !== 0
        ) {
            // console.log('initiative: ', initiative);

            // Get Report version
            const currentReport = initiative._reports[reportId];
            // const reportVersion = currentReport.version; // "1" or "1.1"
            setCurrentReport(currentReport);

            // Get list of funders
            const funders = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == CONSTANTS.TYPES.FUNDER_OVERVIEW
                        ? true
                        : false;
                })
                .map(item => {
                    // Get funder based on key
                    const funder =
                        initiative._funders[item.Initiative_Funder__c];

                    // Add reflection to funder
                    funder.reportReflection = item.Description__c;
                    return funder;
                });
            setFunders(funders);

            // Collaborators are split in two groups
            // "Co-applicants" & "Additional Collaborator"
            // Get all and then split them
            const allCollaborators = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == CONSTANTS.TYPES.COLLABORATOR_OVERVIEW
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
            const applicants = allCollaborators.filter(
                item =>
                    item.Type__c !=
                    CONSTANTS.TYPES.COLLABORATORS.includes(item.Type__c)
            );
            const collaborators = allCollaborators.filter(
                item =>
                    item.Type__c ==
                    CONSTANTS.TYPES.COLLABORATORS.includes(item.Type__c)
            );
            setApplicants(applicants);
            setCollaborators(collaborators);

            // Get reflection for employees funded
            const employeesReflection = Object.values(
                initiative._reportDetails
            ).filter(item => {
                return item.Type__c == CONSTANTS.TYPES.EMPLOYEES_FUNDED_OVERVIEW
                    ? true
                    : false;
            });
            setEmployeesFundedReflection(employeesReflection[0].Description__c);

            // Employee funded - Data for Number cards
            // Group empoyees per role
            // EX Data:
            // {
            //     { role: 'Project manager', total: 2, male: 1, female: 1 },
            //     { role: 'Scientists', total: 4, male: 1, female: 3 },
            // };
            let employeeGroups = Object.values(
                initiative._employeesFunded
            ).reduce((result, employee) => {
                result[employee.Role_Type__c] =
                    result[employee.Role_Type__c] || {};
                // Ref
                const group = result[employee.Role_Type__c];

                // Role
                group.role = employee.Role_Type__c;

                // Total employees
                group.total = group.total ? group.total + 1 : 1;

                // Calculate how many are male/female/other in each group
                if (employee.Gender__c == CONSTANTS.TYPES.GENDER_MALE) {
                    group.male = group.male ? group.male + 1 : 1;
                } else if (
                    employee.Gender__c == CONSTANTS.TYPES.GENDER_FEMALE
                ) {
                    group.female = group.female ? group.female + 1 : 1;
                } else if (employee.Gender__c == CONSTANTS.TYPES.GENDER_OTHER) {
                    group.other = group.other ? group.other + 1 : 1;
                }
                return result;
            }, {});
            setEmployeeGroups(employeeGroups);

            // Get reports ALL Activities
            // Activies are split between:
            // Activities == "Intervention"
            // Sharing of results == "Dissimination"
            const allActivities = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == CONSTANTS.TYPES.ACTIVITY_OVERVIEW
                        ? true
                        : false;
                })
                .map(item => {
                    // Get Activity based on key
                    const activity =
                        initiative._activities[item.Initiative_Activity__c];
                    // Add Report Reflection text to activities
                    activity.reportReflection = item.Description__c;
                    return activity;
                });

            // Create list of indicators per "Activity"
            // Type == "Intervention"
            const activities = Object.values(allActivities).reduce(
                (accumulator, activity) => {
                    const title = activity.Things_To_Do__c;
                    const description = activity.Things_To_Do_Description__c;
                    const location = activity.Initiative_Location__c.split(
                        ';'
                    ).join(', ');
                    const reportReflection = activity.reportReflection;

                    // Loop indicators
                    // Add indicators if it matches the activity ID
                    const indicators = Object.values(
                        initiative._activitySuccessMetrics
                    ).map(item => {
                        if (activity.Id == item.Initiative_Activity__c) {
                            let title;
                            let label;
                            let groupTitle;

                            if (
                                item.Type__c ===
                                CONSTANTS.TYPES.INDICATOR_PREDEFINED
                            ) {
                                // If gender is "Other" -> use "Gender_Other__c" field
                                const gender =
                                    item.Gender__c ==
                                    CONSTANTS.TYPES.INDICATOR_GENDER_OTHER
                                        ? item.Gender_Other__c
                                        : item.Gender__c;
                                title = `${gender} (${labelTodo('age')} ${
                                    item.Lowest_Age__c
                                }-${item.Highest_Age__c})`;
                                label = labelTodo('Reached so far');
                                groupTitle = labelTodo('People reached');
                            }
                            // Custom indicators - CONSTANTS.TYPES.INDICATOR_CUSTOM
                            else {
                                title = item.Name;
                                label = labelTodo('Total so far');
                                groupTitle = labelTodo('Indicator');
                            }

                            // Not all indicators have a "Target"
                            const value = item.Target__c
                                ? `${item.Current_Status__c} / ${item.Target__c}`
                                : item.Current_Status__c;

                            return {
                                type: item.Type__c,
                                groupTitle: groupTitle,
                                title: title,
                                value: value,
                                label: label,
                            };
                        }
                    });
                    // Split indicators into Two groups 'People' & 'Custom'
                    const peopleIndicators = indicators.filter(
                        indicator =>
                            indicator &&
                            indicator.type ==
                                CONSTANTS.TYPES.INDICATOR_PREDEFINED
                    );
                    const customIndicators = indicators.filter(
                        indicator =>
                            indicator &&
                            indicator.type == CONSTANTS.TYPES.INDICATOR_CUSTOM
                    );

                    // Only add activities of type "intervention"
                    // Only add activities - if they have indicators
                    if (
                        activity.Activity_Type__c ==
                            CONSTANTS.TYPES.ACTIVITY_INTERVENTION &&
                        stripUndefined(indicators).length > 0
                    ) {
                        accumulator.push({
                            title: title,
                            description: description,
                            location: location,
                            peopleIndicators: peopleIndicators,
                            customIndicators: customIndicators,
                            reportReflection: reportReflection,
                        });
                    }
                    return accumulator;
                },
                []
            );
            setActivities(activities);

            // Sharing of results == "Dissimination"
            const results = Object.values(allActivities)
                .filter(item => {
                    // "Dissemination" or "Intervention"
                    return item.Activity_Type__c ==
                        CONSTANTS.TYPES.ACTIVITY_INTERVENTION
                        ? true
                        : false;
                })
                .map(item => {
                    let items = [];

                    // If activity has publications
                    if (item.Publication_Type__c) {
                        items = [
                            {
                                label: labelTodo('Publication type'),
                                text: item.Publication_Type__c,
                            },
                            {
                                label: labelTodo('Publication year'),
                                text: item.Publication_Year__c,
                            },
                            {
                                label: labelTodo('Publisher'),
                                text: item.Publication_Publisher__c,
                            },
                            {
                                label: labelTodo('Author'),
                                text: item.Publication_Author__c,
                            },
                            {
                                label: labelTodo('DOI'),
                                text: item.Publication_DOI__c,
                            },
                        ];
                    }
                    return {
                        headline: item.Things_To_Do__c,
                        label: item.Dissemination_Method__c,
                        tags: item.Audience_Tag__c?.split(';'),
                        reportReflection: item.reportReflection,
                        items: items,
                    };
                });
            setResults(results);

            // Report outcomes
            const outcomes = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == CONSTANTS.TYPES.OUTCOME_OVERVIEW
                        ? true
                        : false;
                })
                .map(item => {
                    // console.log('outcome: ', item);
                    // // Get Goal based on key
                    // const goal =
                    //     initiative._goals[item.Initiative_Activity__c];
                    // // Add Report Reflection text to activities
                    // goal.rep ortReflection = item.Description__c;
                    // return goal;
                });
            // console.log('Outcomes: ', outcomes);
            setOutcomes(outcomes);

            // Influence on policy
            const influences = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == 'Influence On Policy' ? true : false;
                })
                .map(item => {
                    return item.Description__c;
                });
            setInfluences(influences);

            // Evaluations
            const evaluations = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == 'Evaluation' ? true : false;
                })
                .map(item => {
                    return item.Description__c;
                });
            setEvaluations(evaluations);

            // const achievements = Object.values(
            //     initiative._reportDetails
            // ).filter(item => {
            //     return item.Type__c == 'Achievement' ? true : false;
            // });

            // Co-Funders & Co-Applicants (used in Header)
            const coFunders = Object.values(initiative._funders)
                .filter(item => item.Type__c == 'Co funder')
                .map(item => item.Account__r.Name);

            const coApplicants = Object.values(initiative._collaborators)
                .filter(item => item.Type__c == 'Co applicant')
                .map(item => item.Account__r.Name);

            setCoFunders(coFunders);
            setCoApplicants(coApplicants);

            // Header - Merge goal data, to signel array
            const goalAmounts = initiative.Problem_Effect__c?.split(';');
            const goalTitles = initiative.Translated_Problem_Effect__c?.split(
                ';'
            );
            if (goalTitles && goalTitles.length > 0) {
                const developmentGoals = goalTitles.map((title, index) => {
                    return { title: title, amount: goalAmounts[index] };
                });
                setDevelopmentGoals(developmentGoals);
            }

            // 🍩 Donut data 🍩
            // Build donut slices using color gradient
            // See here: https://keithclark.co.uk/articles/single-element-pure-css-pie-charts/
            const currency = Object.values(initiative._funders)[0]
                .CurrencyIsoCode;
            const totalAmount = Object.values(initiative._funders).reduce(
                (total, funder) => {
                    return total + funder.Amount__c;
                },
                0
            );
            setTotalAmount(totalAmount);
            setCurrency(currency);

            // Header - If Novo Nordisk is lead funder
            // Calculate Novo's funding share
            const novoFunder = Object.values(initiative._funders)
                .filter(
                    item =>
                        item.Type__c == 'Lead funder' &&
                        item.Account__r.Name == 'Novo Nordisk Fonden'
                )
                .map(item => ({
                    amount: `${
                        item.CurrencyIsoCode
                    } ${item.Amount__c.toLocaleString('de-DE')}`,
                    share: `${Math.round(
                        (item.Amount__c / totalAmount) * 100
                    )}%`,
                }))[0];
            setNovoFunder(novoFunder);

            const donutData = Object.values(initiative._funders).map(
                (funder, index) => {
                    return {
                        color: donutColors[index],
                        hex: donutHex[index],
                        name: funder.Account__r.Name,
                        currency: funder.CurrencyIsoCode,
                        amount: funder.Amount__c,
                        totalAmount: totalAmount,
                        percentage: funder.Amount__c / totalAmount,
                    };
                }
            );

            const multiplier = 3.6; // 1% of 360

            // Create object array.
            // Use reduce to add previous "deg" to position current slice (360 deg)
            let donutStyles = donutData.reduce((previous, slice) => {
                const prevDeg = previous[previous.length - 1]
                    ? previous[previous.length - 1].deg
                    : 0;
                const deg = slice.percentage * 100 * multiplier;
                const obj = {
                    deg: deg + prevDeg,
                    hex: slice.hex,
                };
                previous.push(obj);
                return previous;
            }, []);
            // Create array of color / deg pairs, one per slice
            donutStyles = donutStyles.map((slice, index) => {
                // Last Slice uses '0' instead of 'X deg' - to close circle
                if (index == donutStyles.length - 1) {
                    return `${slice.hex} 0`;
                } else {
                    return `${slice.hex} 0 ${slice.deg}deg`;
                }
            });
            // Construct gradient string
            // Example output: `conic-gradient(red 72deg, green 0 110deg, pink 0 130deg, blue 0 234deg, cyan 0)`,
            const gradient = `conic-gradient(${donutStyles.join(', ')})`;
            setPieChartStyle({ backgroundImage: gradient });
            setDonutData(donutData);
            setInitiativeData(initiative);
        }
    }, [initiative]);

    return (
        <>
            {initiativeData && (
                <>
                    {/* Header */}
                    <SectionWrapper>
                        <SectionWrapper>
                            <div className="w-64 h-64 overflow-hidden rounded-4">
                                {initiativeData.Hero_Image_URL__c && (
                                    // <Image
                                    //     src={initiativeData.Hero_Image_URL__c}
                                    //     width="64"
                                    //     height="64"></Image>
                                    <img
                                        className="w-full h-full"
                                        src={initiativeData.Hero_Image_URL__c}
                                    />
                                )}
                            </div>
                            <div className="mt-16">
                                {initiativeData.Lead_Grantee__r.Name}
                            </div>

                            <div className="mt-48 t-h1">
                                {initiativeData.Name}
                            </div>
                            <div className="mt-16 t-sh2">
                                {labelTodo('Annual report 2021')}
                            </div>
                            <div className="flex mt-16 t-caption text-blue-60">
                                {initiativeData.Application_Id__c}
                                <div className="mx-4">•</div>
                                {initiativeData.Stage__c}
                            </div>
                        </SectionWrapper>
                    </SectionWrapper>
                    {/* Overview */}
                    <SectionWrapper
                        id={label('custom.FA_ReportWizardMenuOverview')}>
                        <SectionWrapper>
                            <h2 className="t-h4">{labelTodo('Overview')}</h2>
                            <h3 className="mt-24 t-preamble">
                                {initiativeData.Summary__c}
                            </h3>
                        </SectionWrapper>
                        {/* Information cards */}
                        <div className="inline-grid items-start w-full grid-cols-1 md:grid-cols-2 md:gap-24">
                            <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                                <div className="t-sh6 text-blue-60">
                                    {labelTodo('Grant giving area')}
                                </div>
                                <h3 className="t-h5">
                                    {initiativeData.Category__c}
                                </h3>
                                {/* 
                                <div className="mt-16 t-sh6 text-blue-60">
                                    {labelTodo('Additional goals')}
                                </div>
                                <h3 className="t-h5">
                                    {labelTodo('Missing data? 🛑')}
                                </h3>
                                */}
                                <div className="mt-16 t-sh6 text-blue-60">
                                    {labelTodo('Sustainable development goals')}
                                </div>
                                <div className="flex flex-col">
                                    {developmentGoals &&
                                        developmentGoals.map(
                                            (problem, index) => (
                                                <h3
                                                    key={`g-${index}`}
                                                    className="mt-8 t-h5">
                                                    <span className="px-6 pt-4 mr-4 leading-none text-white bg-teal-300 rounded-4">
                                                        {problem.amount.toLocaleString(
                                                            'de-DE'
                                                        )}
                                                    </span>
                                                    {problem.title}
                                                </h3>
                                            )
                                        )}
                                </div>
                            </div>
                            <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                                <div className="t-sh6 text-blue-60">
                                    {labelTodo('Grant start and end date')}
                                </div>
                                <h3 className="t-h5">
                                    {initiativeData.Grant_Start_Date__c}
                                    {' - '}
                                    {initiativeData.Grant_End_Date__c}
                                </h3>
                                <div className="mt-16 t-sh6 text-blue-60">
                                    {labelTodo('Initiative location')}
                                </div>
                                <h3 className="t-h5">
                                    {initiativeData.Translated_Where_Is_Problem__c?.split(
                                        ';'
                                    ).join(', ')}
                                </h3>
                            </div>
                            <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                                <div className="t-sh6 text-blue-60">
                                    {labelTodo('Co-funders')}
                                </div>

                                <div>
                                    {coFunders.map((item, index) => (
                                        <h3 key={`f-${index}`} className="t-h5">
                                            {item}
                                        </h3>
                                    ))}
                                </div>
                                <div className="mt-16 t-sh6 text-blue-60">
                                    {labelTodo('Co-applicants')}
                                </div>
                                <h3 className="t-h5">
                                    {coApplicants.join(', ')}
                                </h3>
                            </div>
                            {novoFunder && (
                                <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                                    <div className="t-sh6 text-blue-60">
                                        {labelTodo(
                                            'Amount granted by Novo Nordisk Foundation'
                                        )}
                                    </div>
                                    <h3 className="t-h5">
                                        {novoFunder.amount}
                                    </h3>

                                    <div className="mt-16 t-sh6 text-blue-60">
                                        {labelTodo('Share of total funding')}
                                    </div>
                                    <h3 className="t-h5">{novoFunder.share}</h3>
                                </div>
                            )}
                        </div>
                    </SectionWrapper>
                    {/* Funders */}
                    <SectionWrapper
                        id={label('custom.FA_ReportWizardMenuFunders')}>
                        <SectionWrapper>
                            <h3 className="t-h4">{labelTodo('Funders')}</h3>
                        </SectionWrapper>
                        {/* Donut chart */}
                        <div className="flex items-center p-16 border-4 border-blue-10 rounded-8">
                            <div className="w-1/2 p-32">
                                {/* Donut chart */}
                                <div className="pie" style={pieChartStyle}>
                                    <div className="absolute w-full -mt-16 text-center top-1/2">
                                        <p className="t-sh7 text-blue-60">
                                            Total
                                        </p>
                                        <p className="t-h6">
                                            {currency}{' '}
                                            {totalAmount.toLocaleString(
                                                'de-DE'
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2">
                                {/* Headline */}
                                <div className="t-caption-bold">
                                    Funders and contributions overall
                                </div>
                                {/* List of funders */}
                                {donutData.map((item, index) => (
                                    <div
                                        key={`d-${index}`}
                                        className="flex mt-8 t-caption">
                                        <span
                                            className={`w-16 h-16 mr-8 rounded-2 ${item.color}`}></span>
                                        {`${item.name} - ${
                                            item.currency
                                        } ${item.amount.toLocaleString(
                                            'de-DE'
                                        )}`}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* List of funders */}
                        {Object.values(funders).map((item, index) => (
                            <div key={`f-${index}`}>
                                <SectionWrapper>
                                    <ReportDetailCard
                                        headline={item.Account__r.Name}
                                        image="" // Funders don't have logo/image
                                        description="" // Funders don't have a description
                                        items={[
                                            {
                                                label: 'Amount',
                                                text: `${
                                                    item.CurrencyIsoCode
                                                } ${item.Amount__c.toLocaleString(
                                                    'de-DE'
                                                )}`,
                                            },
                                            {
                                                label: 'Approval date',
                                                text: item.Grant_Start_Date__c,
                                            },
                                        ]}
                                    />
                                </SectionWrapper>
                                <SectionWrapper className="bg-blue-10 rounded-8">
                                    <div className="t-h5">
                                        {labelTodo('Updates from this year')}
                                    </div>
                                    <p className="mt-8 t-body">
                                        {item.reportReflection}
                                    </p>
                                </SectionWrapper>
                            </div>
                        ))}
                    </SectionWrapper>
                    {/* Report Summary */}
                    <SectionWrapper>
                        <SectionWrapper>
                            <h2 className="t-h4">
                                {labelTodo('Report summary')}
                            </h2>
                        </SectionWrapper>
                        <TextCard
                            hasBackground={true}
                            headline="Overall perfomance"
                            body={
                                initiativeData._reports[reportId]
                                    ?.Summary_Of_Activities__c
                            }
                        />
                        <TextCard
                            hasBackground={true}
                            className="mt-32"
                            headline="Challenges & Learnings"
                            body={
                                initiativeData._reports[reportId]
                                    ?.Summary_Of_Challenges_And_Learnings__c
                            }
                        />
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Headline: "Key changes" */}
                    <SectionWrapper paddingY={false}>
                        <SectionWrapper paddingY={false}>
                            <h2 className="t-h3 mt-96">
                                {labelTodo('Key changes')}
                            </h2>
                        </SectionWrapper>
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Applicants */}
                    {applicants && (
                        <SectionWrapper
                            id={label('custom.FA_ReportWizardMenuApplicants')}>
                            <SectionWrapper>
                                <h3 className="t-h4">
                                    {labelTodo(
                                        'New co-applicant relationships this year'
                                    )}
                                </h3>
                            </SectionWrapper>
                            {applicants.map((item, index) => (
                                <div key={`a-${index}`}>
                                    <SectionWrapper>
                                        <ReportDetailCard
                                            headline={item.Account__r.Name}
                                            image="" // Collaborators don't have an image
                                            description="" // Collaborators don't have a description
                                            items={[
                                                {
                                                    label: labelTodo('Type'),
                                                    text: item.Type__c,
                                                },
                                                {
                                                    label: labelTodo('Period'),
                                                    text: `${item.Start_Date__c} - ${item.End_Date__c}`,
                                                },
                                            ]}
                                        />
                                    </SectionWrapper>
                                    <TextCard
                                        hasBackground={true}
                                        headline={labelTodo(
                                            'Updates from this year'
                                        )}
                                        body={item.reportReflection}
                                    />
                                </div>
                            ))}
                        </SectionWrapper>
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Collaborators */}
                    {collaborators && (
                        <SectionWrapper
                            id={label(
                                'custom.FA_ReportWizardMenuCollaborations'
                            )}>
                            <SectionWrapper>
                                <h3 className="t-h4">
                                    {labelTodo('Overview of collaborations')}
                                </h3>
                            </SectionWrapper>
                            {collaborators.map((item, index) => (
                                <div key={`c-${index}`}>
                                    <SectionWrapper>
                                        <ReportDetailCard
                                            headline={item.Account__r.Name}
                                            image="" // Collaborators don't have an image
                                            description="" // Collaborators don't have a description
                                            items={[
                                                {
                                                    label: labelTodo('Type'),
                                                    text: item.Type__c,
                                                },
                                                {
                                                    label: labelTodo('Period'),
                                                    text: `${item.Start_Date__c} - ${item.End_Date__c}`,
                                                },
                                            ]}
                                        />
                                    </SectionWrapper>
                                    <TextCard
                                        hasBackground={true}
                                        headline={labelTodo(
                                            'Updates from this year'
                                        )}
                                        body={item.reportReflection}
                                    />
                                </div>
                            ))}
                        </SectionWrapper>
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Employees funded by the grant */}
                    {employeesFundedReflection && (
                        <SectionWrapper
                            id={label('custom.FA_ReportWizardMenuEmployees')}>
                            <SectionWrapper>
                                <h3 className="t-h4">
                                    {labelTodo('Employees funded by the grant')}
                                </h3>
                            </SectionWrapper>

                            <div className="inline-grid w-full grid-cols-2 gap-16 mt-16 md:grid-cols-4 xl:grid-cols-4">
                                {Object.values(employeeGroups).map(
                                    (group, index) => {
                                        const males = group.male
                                            ? `${group.male} Male`
                                            : null;
                                        const females = group.female
                                            ? `${group.female} Female`
                                            : null;
                                        const other = group.other
                                            ? `${group.other} Other`
                                            : null;
                                        const description = [
                                            males,
                                            females,
                                            other,
                                        ]
                                            .filter(item => item)
                                            .join(', ');
                                        return (
                                            <NumberCard
                                                key={`e-${index}`}
                                                number={group.total}
                                                headline={group.role}
                                                description={description}
                                            />
                                        );
                                    }
                                )}
                            </div>

                            <TextCard
                                className="mt-32"
                                hasBackground={true}
                                headline={labelTodo('Updates from this year')}
                                body={employeesFundedReflection}
                            />
                        </SectionWrapper>
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Goals */}
                    <SectionWrapper
                        id={label('custom.FA_ReportWizardMenuGoals')}>
                        <SectionWrapper>
                            <h3 className="t-h4">{labelTodo('Goals')}</h3>
                        </SectionWrapper>

                        {Object.values(initiativeData._goals).map(
                            (item, index) => {
                                const title =
                                    item.Type__c == 'Custom'
                                        ? item.Goal__c
                                        : item.Funder_Objective__c;
                                return (
                                    <TextCard
                                        key={`g-${index}`}
                                        hasBackground={false}
                                        className="mt-32"
                                        headline={title}
                                        label={item.Type__c}
                                    />
                                );
                            }
                        )}
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Activities */}
                    {activities && (
                        <SectionWrapper
                            id={label('custom.FA_ReportWizardMenuActivities')}>
                            <SectionWrapper>
                                <h3 className="t-h4">
                                    {labelTodo('Activities')}
                                </h3>
                            </SectionWrapper>

                            {activities.map((item, index) => (
                                <div key={`a-${index}`}>
                                    <SectionWrapper>
                                        <ReportDetailCard
                                            headline={item.title}
                                            description={item.description}
                                            items={[
                                                {
                                                    label: 'Location',
                                                    text: item.location,
                                                },
                                            ]}
                                        />
                                    </SectionWrapper>
                                    <SectionWrapper>
                                        {item.peopleIndicators && (
                                            <ChartCard
                                                useBorder={true}
                                                headline={
                                                    item.peopleIndicators[0]
                                                        .groupTitle
                                                }
                                                items={item.peopleIndicators}
                                            />
                                        )}
                                    </SectionWrapper>
                                    <SectionWrapper>
                                        {item.customIndicators && (
                                            <ChartCard
                                                className="mt-24"
                                                useBorder={true}
                                                headline={
                                                    item.customIndicators[0]
                                                        .groupTitle
                                                }
                                                items={item.customIndicators}
                                            />
                                        )}
                                        {/* <ChartCard
                                            useBorder={true}
                                            headline={labelTodo('Indicators')}
                                            items={item.indicators}
                                        /> */}
                                    </SectionWrapper>
                                    <TextCard
                                        hasBackground={true}
                                        className="mt-32"
                                        headline={labelTodo(
                                            'Updates from this year'
                                        )}
                                        body={item.reportReflection}
                                    />
                                    {index < activities.length - 1 && (
                                        <DividerLine />
                                    )}
                                </div>
                            ))}
                        </SectionWrapper>
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Sharing of results */}
                    {results && (
                        <SectionWrapper
                            id={label('custom.FA_ReportWizardMenuSharing')}>
                            <SectionWrapper>
                                <h3 className="t-h4">
                                    {labelTodo('Sharing of results')}
                                </h3>
                            </SectionWrapper>
                            {results.map((item, index) => (
                                <div key={`r-${index}`}>
                                    <SectionWrapper>
                                        <ReportSharingCard
                                            headline={item.headline}
                                            description={item.label}
                                            tags={item.tags}
                                            items={item.items}
                                        />
                                    </SectionWrapper>

                                    <TextCard
                                        hasBackground={true}
                                        headline={labelTodo(
                                            'Updates from this year'
                                        )}
                                        body={item.reportReflection}
                                    />

                                    {index < activities.length - 1 && (
                                        <DividerLine />
                                    )}
                                </div>
                            ))}
                        </SectionWrapper>
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Logbook entries - TBD */}
                    {/*
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="t-h4">
                                {labelTodo('Loogbook entries')}
                            </h3>
                        </SectionWrapper>
                        entries...
                    </SectionWrapper>
                    */}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Headline: "Key results" */}
                    <SectionWrapper paddingY={false}>
                        <SectionWrapper paddingY={false}>
                            <h2 className="t-h3 mt-96">
                                {labelTodo('Key results')}
                            </h2>
                        </SectionWrapper>
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Outcomes */}
                    {outcomes && (
                        <SectionWrapper>
                            <SectionWrapper>
                                <h3 className="t-h4">
                                    {labelTodo('Outcomes')}
                                </h3>
                            </SectionWrapper>
                            {outcomes.map((item, index) => (
                                <p key={`o-${index}`}>Outcome {index}</p>
                            ))}
                        </SectionWrapper>
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Influences on policy */}
                    {influences && (
                        <SectionWrapper
                            id={label('custom.FA_ReportWizardMenuInfluence')}>
                            <SectionWrapper>
                                <h3 className="t-h4">
                                    {labelTodo('Influences on policy')}
                                </h3>
                            </SectionWrapper>
                            {influences.map((item, index) => (
                                <div key={`i-${index}`}>
                                    <TextCard
                                        hasBackground={true}
                                        headline={labelTodo(
                                            'How the initiative had influence on policy or practice'
                                        )}
                                        body={item}
                                    />

                                    {index < influences.length - 1 && (
                                        <DividerLine />
                                    )}
                                </div>
                            ))}
                        </SectionWrapper>
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Evaluations */}
                    {evaluations && (
                        <SectionWrapper
                            id={label('custom.FA_ReportWizardMenuEvaluations')}>
                            <SectionWrapper>
                                <h3 className="t-h4">
                                    {labelTodo('Evaluations')}
                                </h3>
                            </SectionWrapper>
                            {evaluations.map((item, index) => (
                                <div key={`i-${index}`}>
                                    <TextCard
                                        hasBackground={true}
                                        headline={labelTodo(
                                            'Evaluation regarding this report'
                                        )}
                                        body={item}
                                    />

                                    {index < evaluations.length - 1 && (
                                        <DividerLine />
                                    )}
                                </div>
                            ))}
                        </SectionWrapper>
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Reflections */}
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="t-h4">{labelTodo('Reflections')}</h3>
                        </SectionWrapper>
                        <TextCard
                            hasBackground={true}
                            headline={labelTodo('Project purpose')}
                            body={currentReport.Project_Purpose__c}
                        />
                        <TextCard
                            className="mt-32"
                            hasBackground={true}
                            headline={labelTodo(
                                'Progress towards achieving the goals'
                            )}
                            body={
                                currentReport.Progress_Towards_Grant_Area_Themes__c
                            }
                        />
                        <TextCard
                            className="mt-32"
                            hasBackground={true}
                            headline={labelTodo('Important results')}
                            body={currentReport.Important_Results__c}
                        />
                        <TextCard
                            className="mt-32"
                            hasBackground={true}
                            headline={labelTodo(
                                'Post grant activities or results'
                            )}
                            body={currentReport.Post_Project_Activities__c}
                        />
                    </SectionWrapper>
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="t-h4">
                                {labelTodo('Additional information')}
                            </h3>
                            <p className="mt-32 t-small">
                                Additional information for this initiative can
                                be found on the initiative page
                            </p>
                        </SectionWrapper>
                    </SectionWrapper>
                </>
            )}
        </>
    );
};

// export async function getStaticProps(context) {
//     return {
//         props: {}, // will be passed to the page component as props
//     };
// }

ReportComponent.propTypes = {
    pageProps: t.object,
};

ReportComponent.defaultProps = {
    pageProps: {},
};

ReportComponent.layout = 'report';

export default ReportComponent;
