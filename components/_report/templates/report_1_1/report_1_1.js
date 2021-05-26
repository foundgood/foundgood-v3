// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';
import { stripUndefined, asId } from 'utilities';

// Components
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import UpdateButton from 'components/updateButton';
import ReportDetailCard from 'components/_initiative/reportDetailCard';
import ReportSharingCard from 'components/_initiative/reportSharingCard';
import TextCard from 'components/_initiative/textCard';
import NumberCard from 'components/_initiative/numberCard';
import DividerLine from 'components/_initiative/dividerLine';
import ChartCard from 'components/_initiative/chartCard';

const Report_1_1Component = ({ initiative, report, CONSTANTS }) => {
    // Hook: Metadata
    const { labelTodo, label } = useMetadata();

    // Data manipulation
    const [initiativeData, setInitiativeData] = useState();
    const [developmentGoals, setDevelopmentGoals] = useState();
    const [donutData, setDonutData] = useState();
    const [pieChartStyle, setPieChartStyle] = useState({});
    const [totalAmount, setTotalAmount] = useState();
    const [currency, setCurrency] = useState();

    // Overview
    const [coApplicants, setCoApplicants] = useState();
    const [coFunders, setCoFunders] = useState();
    const [novoLeadFunder, setNovoLeadFunder] = useState();

    // Specific data for this report
    const [currentReport, setCurrentReport] = useState([]);
    const [funders, setFunders] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [employeesFundedReflection, setEmployeesFundedReflection] = useState(
        []
    );
    const [employeeGroups, setEmployeeGroups] = useState([]);
    const [activities, setActivities] = useState([]);
    const [results, setResults] = useState([]);
    const [influences, setInfluences] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    // const [outcomes, setOutcomes] = useState(); // TBD

    const donutColors = [
        'bg-teal-60',
        'bg-blue-60',
        'bg-coral-60',
        'bg-amber-60',
        'bg-teal-100',
        'bg-blue-100',
        'bg-coral-100',
        'bg-amber-100',
        'bg-teal-300',
        'bg-blue-300',
        'bg-coral-300',
        'bg-amber-300',
    ];
    const donutHex = [
        '#507C93', // bg-teal-60
        '#545E92', // bg-blue-60
        '#995B57', // bg-coral-60
        '#977958', // bg-amber-60
        '#1C5471', // bg-teal-100
        '#223070', // bg-blue-100
        '#782C28', // bg-coral-100
        '#76502A', // bg-amber-100
        '#548DBB', // bg-teal-300
        '#4355B8', // bg-blue-300
        '#B15446', // bg-coral-300
        '#B7894D', // bg-amber-300
    ];

    useEffect(() => {
        // Initial Load
        if (report?.Id && initiative?.Id) {
            // Set current report
            setCurrentReport(report);

            console.log('report: ', report);
            console.log('initiative: ', initiative);

            // Make sure we have Report Details
            if (Object.values(initiative._reportDetails).length > 0) {
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
                const allCollaborators = Object.values(
                    initiative._reportDetails
                )
                    .filter(item => {
                        return item.Type__c ==
                            CONSTANTS.TYPES.COLLABORATOR_OVERVIEW
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
                        !CONSTANTS.TYPES.COLLABORATORS.includes(item.Type__c)
                );
                const collaborators = allCollaborators.filter(item =>
                    CONSTANTS.TYPES.COLLABORATORS.includes(item.Type__c)
                );
                console.log('collaborators: ', collaborators);
                setApplicants(applicants);
                setCollaborators(collaborators);

                // Get reflection for employees funded
                const employeesReflection = Object.values(
                    initiative._reportDetails
                ).filter(item => {
                    return item.Type__c ==
                        CONSTANTS.TYPES.EMPLOYEES_FUNDED_OVERVIEW
                        ? true
                        : false;
                });
                setEmployeesFundedReflection(
                    employeesReflection[0]?.Description__c
                );

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
                        const description =
                            activity.Things_To_Do_Description__c;
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
                                // let title;
                                // let label;
                                // let groupTitle;
                                // Not all indicators have a "Target"
                                const value = item.Target__c
                                    ? `${item.Current_Status__c} / ${item.Target__c}`
                                    : item.Current_Status__c;

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

                                    return {
                                        type: item.Type__c,
                                        groupTitle: label(
                                            'custom.FA_InitiativeViewIndicatorsPeopleReached'
                                        ),
                                        title: `${gender} (${labelTodo(
                                            'age'
                                        )} ${item.Lowest_Age__c}-${
                                            item.Highest_Age__c
                                        })`,
                                        value: value,
                                        label: label(
                                            'custom.FA_ReportViewActivitiesGraphKeyDuring'
                                        ),
                                    };
                                }
                                // Custom indicators - CONSTANTS.TYPES.INDICATOR_CUSTOM
                                else {
                                    return {
                                        type: item.Type__c,
                                        groupTitle: label(
                                            'custom.FA_InitiativeViewIndicatorsMetrics'
                                        ),
                                        title: item.Name,
                                        value: value,
                                        label: label(
                                            'custom.FA_ReportViewActivitiesGraphKeyDuring'
                                        ),
                                    };
                                }
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
                                indicator.type ==
                                    CONSTANTS.TYPES.INDICATOR_CUSTOM
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
                                    label: label(
                                        'custom.FA_InitiativeViewSharingPublicationType'
                                    ),
                                    text: item.Publication_Type__c,
                                },
                                {
                                    label: label(
                                        'custom.FA_InitiativeViewSharingPublicationYear'
                                    ),
                                    text: item.Publication_Year__c,
                                },
                                {
                                    label: label(
                                        'custom.FA_InitiativeViewSharingPublisher'
                                    ),
                                    text: item.Publication_Publisher__c,
                                },
                                {
                                    label: label(
                                        'custom.FA_InitiativeViewSharingAuthor'
                                    ),
                                    text: item.Publication_Author__c,
                                },
                                {
                                    label: label(
                                        'custom.FA_InitiativeViewSharingPublicationDOI'
                                    ),
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

                // // Report outcomes - TBD
                // const outcomes = Object.values(initiative._reportDetails)
                //     .filter(item => {
                //         console.log('Type__c: ', item.Type__c);
                //         return item.Type__c == CONSTANTS.TYPES.OUTCOME_OVERVIEW
                //             ? true
                //             : false;
                //     })
                //     .map(item => {
                //         console.log('outcome: ', item.Problem_Resolutions);
                //     });
                // setOutcomes(outcomes);

                // Influence on policy
                const influences = Object.values(initiative._reportDetails)
                    .filter(item => {
                        return item.Type__c ==
                            CONSTANTS.TYPES.INFLUENCE_ON_POLICY
                            ? true
                            : false;
                    })
                    .map(item => {
                        return item.Description__c;
                    });
                setInfluences(influences);

                // Evaluations
                const evaluations = Object.values(initiative._reportDetails)
                    .filter(item => {
                        return item.Type__c == CONSTANTS.TYPES.EVALUATION
                            ? true
                            : false;
                    })
                    .map(item => {
                        return item.Description__c;
                    });
                setEvaluations(evaluations);

                // NOT USED
                // const achievements = Object.values(
                //     initiative._reportDetails
                // ).filter(item => {
                //     return item.Type__c == 'Achievement' ? true : false;
                // });
            }

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

            // Make sure we have funders & collaborators
            // Overview details + Funders numbers
            if (
                Object.values(initiative._funders).length > 0 &&
                Object.values(initiative._collaborators).length > 0
            ) {
                // Co-Funders & Co-Applicants (used in Header)
                const coFunders = Object.values(initiative._funders)
                    .filter(item => item.Type__c == 'Co funder')
                    .map(item => item.Account__r.Name);
                setCoFunders(coFunders);

                const coApplicants = Object.values(initiative._collaborators)
                    .filter(item => item.Type__c == 'Co applicant')
                    .map(item => item.Account__r.Name);
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
                            item.Type__c === CONSTANTS.TYPES.LEAD_FUNDER &&
                            item.Account__c === CONSTANTS.IDS.NNF_ACCOUNT
                    )
                    .map(item => ({
                        amount: `${
                            item.CurrencyIsoCode
                        } ${item.Amount__c?.toLocaleString('de-DE')}`,
                        share: `${Math.round(
                            (item.Amount__c / totalAmount) * 100
                        )}%`,
                    }))[0];
                setNovoLeadFunder(novoFunder);

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
            }

            setInitiativeData(initiative);
        }
    }, [initiative]);

    return (
        <>
            {initiativeData && (
                <>
                    {/* ------------------------------------------------------------------------------------------ */}
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
                                {initiativeData.Lead_Grantee__r?.Name}
                            </div>

                            <h1 className="mt-48 t-h1">
                                {initiativeData.Name}
                            </h1>
                            <div className="mt-16 t-sh2">
                                {currentReport.Report_Type__c}{' '}
                                {currentReport.Due_Date__c?.substring(0, 4)}
                            </div>
                            <div className="flex mt-16 t-caption text-blue-60">
                                {initiativeData.Application_Id__c}
                                <div className="mx-4">•</div>
                                {initiativeData.Stage__c}
                            </div>
                        </SectionWrapper>
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Overview */}
                    <SectionWrapper
                        id={asId(label('custom.FA_ReportWizardMenuOverview'))}>
                        <SectionWrapper>
                            <div className="flex justify-between">
                                <h3 className="t-h4">
                                    {label(
                                        'custom.FA_ReportViewHeadingOverview'
                                    )}
                                </h3>
                                <UpdateButton
                                    mode="report"
                                    baseUrl="overview"
                                />
                            </div>
                            <h3 className="mt-24 t-preamble">
                                {initiativeData.Summary__c}
                            </h3>
                        </SectionWrapper>
                        {/* Information cards */}
                        <div className="inline-grid items-start w-full grid-cols-1 md:grid-cols-2 md:gap-24">
                            <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                                <div className="t-sh6 text-blue-60">
                                    {label(
                                        'custom.FA_InitiativeViewGrantGivingArea'
                                    )}
                                </div>
                                <h3 className="t-h5">
                                    {initiativeData.Category__c}
                                </h3>
                                <div className="mt-16 t-sh6 text-blue-60">
                                    {label('custom.FA_InitiativeViewSDGSs')}
                                </div>
                                <div className="flex flex-col">
                                    {developmentGoals &&
                                        developmentGoals.map(
                                            (problem, index) => (
                                                <h3
                                                    key={`g-${index}`}
                                                    className="mt-8 t-h5">
                                                    <span
                                                        className={`px-6 pt-4 mr-8 leading-none text-white bg-sdgs-${problem.amount} rounded-4`}>
                                                        {problem.amount?.toLocaleString(
                                                            'de-DE'
                                                        )}
                                                    </span>
                                                    {problem.title}
                                                </h3>
                                            )
                                        )}
                                    {!developmentGoals && (
                                        <div>
                                            {label('custom.FA_ReportEmptySDGs')}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                                <div className="t-sh6 text-blue-60">
                                    {label(
                                        'custom.FA_ReportViewGrantStartEndDate'
                                    )}
                                </div>
                                <h3 className="t-h5">
                                    {initiativeData.Grant_Start_Date__c}
                                    {' - '}
                                    {initiativeData.Grant_End_Date__c}
                                </h3>
                                <div className="mt-16 t-sh6 text-blue-60">
                                    {label(
                                        'custom.FA_InitiativeViewInitiativeLocation'
                                    )}
                                </div>
                                {/* Location */}
                                {initiativeData.Translated_Where_Is_Problem__c && (
                                    <h3 className="t-h5">
                                        {initiativeData.Translated_Where_Is_Problem__c?.split(
                                            ';'
                                        ).join(', ')}
                                    </h3>
                                )}
                                {/* Empty state - No Location */}
                                {!initiativeData.Translated_Where_Is_Problem__c && (
                                    <div>
                                        {label('custom.FA_ReportEmptyLocation')}
                                    </div>
                                )}
                            </div>
                            <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                                <div className="t-sh6 text-blue-60">
                                    {label('custom.FA_ReportViewCoFunders')}
                                </div>

                                <div>
                                    {/* List of co-funders */}
                                    {coFunders &&
                                        coFunders.map((item, index) => (
                                            <h3
                                                key={`f-${index}`}
                                                className="t-h5">
                                                {item}
                                            </h3>
                                        ))}
                                    {/* Empty state - NO co-funders */}
                                    {!coFunders &&
                                        label('custom.FA_ReportEmptyCoFunders')}
                                </div>
                                <div className="mt-16 t-sh6 text-blue-60">
                                    {label('custom.FA_ReportViewCoApplicants')}
                                </div>
                                {/* List of co-applicants */}
                                {coApplicants && (
                                    <h3 className="t-h5">
                                        {coApplicants.join(', ')}
                                    </h3>
                                )}
                                {/* Empty state - NO co-applicants */}
                                {!coApplicants && (
                                    <div>
                                        {label(
                                            'custom.FA_ReportEmptyCoApplicants'
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* TDD - Only related to NNf or ALL lead funders? */}
                            {novoLeadFunder && (
                                <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                                    <div className="t-sh6 text-blue-60">
                                        {label(
                                            'custom.FA_ReportViewAmountByFunder'
                                        )}
                                        {' Novo Nordisk Foundation'}
                                    </div>
                                    <h3 className="t-h5">
                                        {novoLeadFunder.amount}
                                    </h3>

                                    <div className="mt-16 t-sh6 text-blue-60">
                                        {label(
                                            'custom.FA_ReportViewShareOfTotalFunding'
                                        )}
                                    </div>
                                    <h3 className="t-h5">
                                        {novoLeadFunder.share}
                                    </h3>
                                </div>
                            )}
                        </div>
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Report Summary */}
                    <SectionWrapper
                        id={asId(label('custom.FA_ReportWizardMenuSummary'))}>
                        <SectionWrapper>
                            <div className="flex justify-between mt-32">
                                <h3 className="t-h4">
                                    {label(
                                        'custom.FA_ReportViewHeadingSummary'
                                    )}
                                </h3>
                                <UpdateButton
                                    mode="report"
                                    baseUrl="report-summary"
                                />
                            </div>
                        </SectionWrapper>
                        {/* Overall perfomance */}
                        {currentReport?.Summary_Of_Activities__c && (
                            <TextCard
                                hasBackground={true}
                                headline={label(
                                    'objects.initiativeReport.Summary_Of_Activities__c'
                                )}
                                body={currentReport?.Summary_Of_Activities__c}
                            />
                        )}
                        {/* Empty state - No Overall perfomance */}
                        {!currentReport?.Summary_Of_Activities__c && (
                            <SectionEmpty
                                type="report"
                                headline={label(
                                    'objects.initiativeReport.Summary_Of_Activities__c'
                                )}
                            />
                        )}

                        {currentReport?.Summary_Of_Challenges_And_Learnings__c && (
                            <TextCard
                                hasBackground={true}
                                className="mt-32"
                                headline={label(
                                    'objects.initiativeReport.Summary_Of_Challenges_And_Learnings__c'
                                )}
                                body={
                                    currentReport?.Summary_Of_Challenges_And_Learnings__c
                                }
                            />
                        )}
                        {/* Empty state - No Overall perfomance */}
                        {!currentReport?.Summary_Of_Challenges_And_Learnings__c && (
                            <SectionEmpty
                                type="report"
                                headline={label(
                                    'objects.initiativeReport.Summary_Of_Challenges_And_Learnings__c'
                                )}
                            />
                        )}
                    </SectionWrapper>

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Goals */}
                    <SectionWrapper
                        id={asId(label('custom.FA_ReportWizardMenuGoals'))}>
                        <SectionWrapper>
                            <div className="flex justify-between mt-32">
                                <h3 className="t-h4">
                                    {/* Show to different headings. Depending on if lead funder is Novo Nordisk Foundation */}
                                    {!novoLeadFunder &&
                                        label(
                                            'custom.FA_InitiativeViewGoalsHeading'
                                        )}
                                    {!novoLeadFunder &&
                                        label(
                                            'custom.FA_ReportViewHeadingFunderObjectives'
                                        )}
                                </h3>
                                <UpdateButton mode="report" baseUrl="goals" />
                            </div>
                        </SectionWrapper>

                        {Object.values(initiativeData._goals).length > 0 &&
                            Object.values(initiativeData._goals).map(
                                (item, index) => {
                                    const title =
                                        item.Type__c ==
                                        CONSTANTS.TYPES.GOAL_CUSTOM
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
                        {Object.values(initiativeData._goals).length < 1 && (
                            <SectionEmpty type="report" />
                        )}
                    </SectionWrapper>

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Headline: "Key changes" */}
                    <SectionWrapper paddingY={false}>
                        <h2 className="t-h3 mt-96">
                            {label('custom.FA_ReportViewHeadingKeyChanges')}
                        </h2>
                    </SectionWrapper>

                    {/* Funders */}
                    <SectionWrapper
                        id={asId(label('custom.FA_ReportWizardMenuFunders'))}>
                        <SectionWrapper>
                            <div className="flex justify-between mt-32">
                                <h3 className="t-h4">
                                    {label(
                                        'custom.FA_ReportViewSubHeadingFundersOverall'
                                    )}
                                </h3>
                                <UpdateButton mode="report" baseUrl="funders" />
                            </div>
                        </SectionWrapper>
                        {/* Donut chart */}
                        {donutData && (
                            <div className="flex flex-col items-center p-16 border-4 md:flex-row border-blue-10 rounded-8">
                                <div className="w-full p-32 md:w-1/2">
                                    {/* Donut chart */}
                                    <div className="pie" style={pieChartStyle}>
                                        <div className="absolute w-full -mt-16 text-center top-1/2">
                                            <p className="t-sh7 text-blue-60">
                                                {label(
                                                    'custom.FA_InitiativeViewTotalFunded'
                                                )}
                                            </p>
                                            <p className="t-h6">
                                                {currency}{' '}
                                                {totalAmount?.toLocaleString(
                                                    'de-DE'
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2">
                                    {/* Headline */}
                                    <div className="t-caption-bold">
                                        {label(
                                            'custom.FA_InitiativeViewFundingOverview'
                                        )}
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
                                            } ${item.amount?.toLocaleString(
                                                'de-DE'
                                            )}`}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Empty state - No funders */}
                        {!donutData && <SectionEmpty type="report" />}

                        {/* List of funders */}
                        {funders &&
                            funders.map((item, index) => (
                                <div key={`f-${index}`}>
                                    <SectionWrapper>
                                        <ReportDetailCard
                                            headline={item.Account__r.Name}
                                            image="" // Funders don't have logo/image
                                            description="" // Funders don't have a description
                                            items={[
                                                {
                                                    label: label(
                                                        'custom.FA_InitiativeViewFunderTableColumnHeadersAmount'
                                                    ),
                                                    text: `${
                                                        item.CurrencyIsoCode
                                                    } ${item.Amount__c?.toLocaleString(
                                                        'de-DE'
                                                    )}`,
                                                },
                                                {
                                                    label: label(
                                                        'custom.FA_InitiativeViewFunderTableColumnHeadersApprovalDate'
                                                    ),
                                                    text:
                                                        item.Grant_Start_Date__c,
                                                },
                                            ]}
                                        />
                                    </SectionWrapper>
                                    <SectionWrapper className="bg-blue-10 rounded-8">
                                        <div className="t-h5">
                                            {label(
                                                'custom.FA_ReportViewSubHeadingFundersReflections'
                                            )}
                                        </div>
                                        <p className="mt-8 t-body">
                                            {item.reportReflection}
                                        </p>
                                    </SectionWrapper>

                                    {index < funders.length - 1 && (
                                        <DividerLine />
                                    )}
                                </div>
                            ))}
                    </SectionWrapper>

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Applicants */}
                    <SectionWrapper
                        id={asId(
                            label('custom.FA_ReportWizardMenuApplicants')
                        )}>
                        <SectionWrapper>
                            <div className="flex justify-between mt-32">
                                <h3 className="t-h4">
                                    {label(
                                        'custom.FA_InitiativeViewApplicantsHeading'
                                    )}
                                </h3>
                                <UpdateButton
                                    mode="report"
                                    baseUrl="applicants"
                                />
                            </div>
                        </SectionWrapper>

                        {applicants?.length > 0 &&
                            applicants?.map((item, index) => (
                                <div key={`a-${index}`}>
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
                                            'custom.FA_ReportViewUpdatesForReport'
                                        )}
                                        body={item.reportReflection}
                                    />
                                </div>
                            ))}
                        {applicants?.length < 1 && (
                            <SectionEmpty type="report" />
                        )}
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Collaborators */}
                    <SectionWrapper
                        id={asId(
                            label('custom.FA_ReportWizardMenuCollaborations')
                        )}>
                        <SectionWrapper>
                            <div className="flex justify-between mt-32">
                                <h3 className="t-h4">
                                    {label(
                                        'custom.FA_ReportViewSubHeadingCollaborationsOverall'
                                    )}
                                </h3>
                                <UpdateButton
                                    mode="report"
                                    baseUrl="collaborators"
                                />
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
                        {collaborators?.length < 1 && (
                            <SectionEmpty type="report" />
                        )}
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Employees funded by the grant */}
                    <SectionWrapper
                        id={asId(label('custom.FA_ReportWizardMenuEmployees'))}>
                        <SectionWrapper>
                            <div className="flex justify-between mt-32">
                                <h3 className="t-h4">
                                    {label(
                                        'custom.FA_ReportViewSubHeadingEmployeesOverall'
                                    )}
                                </h3>
                                <UpdateButton
                                    mode="report"
                                    baseUrl="employees-funded"
                                />
                            </div>
                        </SectionWrapper>
                        {employeesFundedReflection && (
                            <>
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
                                    headline={label(
                                        'custom.FA_ReportViewSubHeadingEmployeesReflections'
                                    )}
                                    body={employeesFundedReflection}
                                />
                            </>
                        )}
                        {!employeesFundedReflection && (
                            <SectionEmpty type="report" />
                        )}
                    </SectionWrapper>

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Activities */}
                    <SectionWrapper
                        id={asId(
                            label('custom.FA_ReportWizardMenuActivities')
                        )}>
                        <SectionWrapper>
                            <div className="flex justify-between mt-32">
                                <h3 className="t-h4">
                                    {label(
                                        'custom.FA_ReportViewSubHeadingActivitiesOverall'
                                    )}
                                </h3>
                                <UpdateButton
                                    mode="report"
                                    baseUrl="activities"
                                />
                            </div>
                        </SectionWrapper>

                        {activities?.length > 0 &&
                            activities?.map((item, index) => (
                                <div key={`a-${index}`}>
                                    <SectionWrapper>
                                        <ReportDetailCard
                                            headline={item.title}
                                            description={item.description}
                                            items={[
                                                {
                                                    label: label(
                                                        'custom.FA_InitiativeViewActivityLocation'
                                                    ),
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
                                        headline={label(
                                            'custom.FA_ReportViewSubHeadingActivityReflections'
                                        )}
                                        body={item.reportReflection}
                                    />
                                    {index < activities.length - 1 && (
                                        <DividerLine />
                                    )}
                                </div>
                            ))}
                        {activities?.length < 1 && (
                            <SectionEmpty type="report" />
                        )}
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Sharing of results */}
                    <SectionWrapper
                        id={asId(label('custom.FA_ReportWizardMenuSharing'))}>
                        <SectionWrapper>
                            <div className="flex justify-between mt-32">
                                <h3 className="t-h4">
                                    {label(
                                        'custom.FA_ReportViewSubHeadingSharingOverall'
                                    )}
                                </h3>
                                <UpdateButton
                                    mode="report"
                                    baseUrl="sharing-results"
                                />
                            </div>
                        </SectionWrapper>

                        {results?.length > 0 &&
                            results?.map((item, index) => (
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
                                        headline={label(
                                            'custom.FA_ReportViewSubHeadingSharingReflections'
                                        )}
                                        body={item.reportReflection}
                                    />

                                    {index < results.length - 1 && (
                                        <DividerLine />
                                    )}
                                </div>
                            ))}
                        {results?.length < 1 && <SectionEmpty type="report" />}
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Logbook entries - TBD */}
                    {/*
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="mt-32 t-h4">
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
                                {label('custom.FA_ReportViewHeadingKeyResults')}
                            </h2>
                        </SectionWrapper>
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Outcomes TBD */}
                    {/* {outcomes && (
                        <SectionWrapper>
                            <SectionWrapper>
                                <h3 className="mt-32 t-h4">
                                    {labelTodo('Outcomes')}
                                </h3>
                            </SectionWrapper>
                            {outcomes.map((item, index) => (
                                <p key={`o-${index}`}>Outcome {index}</p>
                            ))}
                        </SectionWrapper>
                    )} */}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Influences on policy */}
                    <SectionWrapper
                        id={asId(label('custom.FA_ReportWizardMenuInfluence'))}>
                        <SectionWrapper>
                            <div className="flex justify-between mt-32">
                                <h3 className="t-h4">
                                    {label(
                                        'custom.FA_ReportViewSubHeadingInfluencesOverall'
                                    )}
                                </h3>
                                <UpdateButton
                                    mode="report"
                                    baseUrl="influence-on-policy"
                                />
                            </div>
                        </SectionWrapper>
                        {influences?.length > 0 &&
                            influences?.map((item, index) => (
                                <div key={`i-${index}`}>
                                    <TextCard
                                        hasBackground={true}
                                        headline={label(
                                            'custom.FA_ReportViewSubHeadingInfluencesReflections'
                                        )}
                                        body={item}
                                    />

                                    {index < influences.length - 1 && (
                                        <DividerLine />
                                    )}
                                </div>
                            ))}
                        {influences?.length < 1 && (
                            <SectionEmpty type="report" />
                        )}
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Evaluations */}
                    <SectionWrapper
                        id={asId(
                            label('custom.FA_ReportWizardMenuEvaluations')
                        )}>
                        <SectionWrapper>
                            <div className="flex justify-between mt-32">
                                <h3 className="t-h4">
                                    {label(
                                        'custom.FA_ReportViewSubHeadingEvaluationsOverall'
                                    )}
                                </h3>
                                <UpdateButton
                                    mode="report"
                                    baseUrl="evaluations"
                                />
                            </div>
                        </SectionWrapper>
                        {evaluations?.length > 0 &&
                            evaluations?.map((item, index) => (
                                <div key={`i-${index}`}>
                                    <TextCard
                                        hasBackground={true}
                                        headline={label(
                                            'custom.FA_ReportViewSubHeadingEvaluationsReflections'
                                        )}
                                        body={item}
                                    />

                                    {index < evaluations.length - 1 && (
                                        <DividerLine />
                                    )}
                                </div>
                            ))}
                        {evaluations?.length < 1 && (
                            <SectionEmpty type="report" />
                        )}
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Reflections */}
                    <SectionWrapper
                        // id="end-of-grant-reflections"
                        id={asId(
                            label('custom.FA_ReportWizardMenuEndReflections')
                        )}>
                        <SectionWrapper>
                            <div className="flex justify-between mt-32">
                                <h3 className="t-h4">
                                    {label(
                                        'custom.FA_ReportViewSubHeadingInfluencesReflections'
                                    )}
                                </h3>
                                {/* 
                                <UpdateButton
                                    mode="report"
                                    baseUrl="evaluations"
                                />
                                */}
                            </div>
                        </SectionWrapper>
                        {/* Project purpose */}
                        {currentReport.Project_Purpose__c && (
                            <TextCard
                                hasBackground={true}
                                headline={label(
                                    'objects.initiativeReport.Project_Purpose__c'
                                )}
                                body={currentReport.Project_Purpose__c}
                            />
                        )}
                        {/* Empty state - Project purpose */}
                        {!currentReport.Project_Purpose__c && (
                            <SectionEmpty
                                type="report"
                                headline={label(
                                    'objects.initiativeReport.Project_Purpose__c'
                                )}
                            />
                        )}

                        {/* Progress goals */}
                        {currentReport.Progress_Towards_Grant_Area_Themes__c && (
                            <TextCard
                                className="mt-32"
                                hasBackground={true}
                                headline={label(
                                    'objects.initiativeReport.Progress_Towards_Grant_Area_Themes__c'
                                )}
                                body={
                                    currentReport.Progress_Towards_Grant_Area_Themes__c
                                }
                            />
                        )}
                        {/* Empty state - Progress goals */}
                        {!currentReport.Project_Purpose__c && (
                            <SectionEmpty
                                type="report"
                                headline={label(
                                    'objects.initiativeReport.Progress_Towards_Grant_Area_Themes__c'
                                )}
                            />
                        )}

                        {/* Important results */}
                        {currentReport.Important_Results__c && (
                            <TextCard
                                className="mt-32"
                                hasBackground={true}
                                headline={label(
                                    'objects.initiativeReport.Important_Results__c'
                                )}
                                body={currentReport.Important_Results__c}
                            />
                        )}
                        {/* Empty state - Important results */}
                        {!currentReport.Important_Results__c && (
                            <SectionEmpty
                                type="report"
                                headline={label(
                                    'objects.initiativeReport.Important_Results__c'
                                )}
                            />
                        )}

                        {/* Post project activities */}
                        {currentReport.Post_Project_Activities__c && (
                            <TextCard
                                className="mt-32"
                                hasBackground={true}
                                headline={label(
                                    'objects.initiativeReport.Post_Project_Activities__c'
                                )}
                                body={currentReport.Post_Project_Activities__c}
                            />
                        )}
                        {/* Empty state - Post project activities */}
                        {!currentReport.Post_Project_Activities__c && (
                            <SectionEmpty
                                type="report"
                                headline={label(
                                    'objects.initiativeReport.Post_Project_Activities__c'
                                )}
                            />
                        )}
                    </SectionWrapper>
                    {/* Additional Info */}
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="mt-32 t-h4">
                                {label(
                                    'custom.FA_ReportViewSubHeadingLogAdditional'
                                )}
                            </h3>
                            <p className="mt-32 t-small">
                                {label(
                                    'custom.FA_ReportViewSubHeadingLogAdditionalSubHeading'
                                )}
                            </p>
                        </SectionWrapper>
                    </SectionWrapper>
                </>
            )}
        </>
    );
};

Report_1_1Component.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    CONSTANTS: t.object.isRequired,
};

Report_1_1Component.defaultProps = {};

export default Report_1_1Component;
