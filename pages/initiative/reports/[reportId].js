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
import TextCard from 'components/_report/textCard';
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
        initiative,
        populateReportDetails,
        // getReportDetails,
    } = useInitiativeDataStore();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

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
    const [funders, setFunders] = useState();
    const [applicants, setApplicants] = useState();
    const [collaborators, setCollaborators] = useState();
    const [employeesFunded, setEmployeesFunded] = useState();
    // const [goals, setGoals] = useState();
    const [activities, setActivities] = useState();
    const [sharingResults, setSharingResults] = useState();

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
        if (reportId) {
            // console.log('reportId: ', reportId);
            populateReportDetails(reportId);
            // const report = getReportDetails(reportId);
            // console.log('report: ', report);
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
            console.log('initiative: ', initiative);

            // Get Report version
            // const currentReport = initiative._reports[reportId]
            // const reportVersion = currentReport.version; // "1" or "1.1"

            // Get list of funders
            const funders = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == 'Funder Overview' ? true : false;
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
                    return item.Type__c == 'Collaborator Overview'
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
                item => item.Type__c != 'Additional collaborator'
            );
            const collaborators = allCollaborators.filter(
                item => item.Type__c == 'Additional collaborator'
            );
            setApplicants(applicants);
            setCollaborators(collaborators);

            // Get reflection for employees funded
            const employees = Object.values(initiative._reportDetails).filter(
                item => {
                    return item.Type__c == 'Employees Funded Overview'
                        ? true
                        : false;
                }
            );
            setEmployeesFunded(employees[0].Description__c);

            // Get reports Activities
            // Activies are split between:
            // Activities == "Intervention"
            // Sharing of results == "Dissimination"
            const allActivities = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == 'Activity Overview' ? true : false;
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
            const activities = Object.values(allActivities).reduce(
                (accumulator, activity) => {
                    const title = activity.Things_To_Do__c;
                    const description = activity.Things_To_Do_Description__c;
                    const location = activity.Initiative_Location__c.split(
                        ';'
                    ).join(', ');

                    // Loop indicators
                    // Add indicators if it matches the activity ID
                    const indicators = Object.values(
                        initiative._activitySuccessMetrics
                    ).map(item => {
                        if (activity.Id == item.Initiative_Activity__c) {
                            let title;
                            let label;
                            if (item.Type__c === 'People') {
                                // If gender is "Other" -> use "Gender_Other__c" field
                                const gender =
                                    item.Gender__c == 'Other'
                                        ? item.Gender_Other__c
                                        : item.Gender__c;
                                title = `${gender} (age ${item.Lowest_Age__c}-${item.Highest_Age__c})`;
                                label = labelTodo('Reached so far');
                            } else {
                                title = item.Name;
                                label = labelTodo('Total so far');
                            }

                            return {
                                title: title,
                                value: `${item.Progress__c} / ${item.Target__c}`,
                                current: item.Progress__c,
                                total: item.Target__c,
                                label: label,
                            };
                        }
                    });

                    // Only add activities of type "intervention"
                    // Only add activities - if they have indicators
                    console.log('activity: ', activity);
                    if (
                        activity.Activity_Type__c == 'Intervention' &&
                        stripUndefined(indicators).length > 0
                    ) {
                        accumulator.push({
                            title: title,
                            description: description,
                            location: location,
                            indicators: indicators,
                        });
                    }
                    return accumulator;
                },
                []
            );
            setActivities(activities);
            // const activities = allActivities.filter(
            //     item => item.Activity_Type__c == 'Intervention'
            // );
            // const goals = allActivities.filter(
            //     item => item.Activity_Type__c == 'Dissemination'
            // );

            // setGoals(goals);

            // const influence = Object.values(initiative._reportDetails).filter(
            //     item => {
            //         return item.Type__c == 'Influence On Policy' ? true : false;
            //     }
            // );
            // const outcomes = Object.values(initiative._reportDetails).filter(
            //     item => {
            //         return item.Type__c == 'Outcome' ? true : false;
            //     }
            // );
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
            const goalAmounts = initiative?.Problem_Effect__c?.split(';');
            const goalTitles = initiative?.Translated_Problem_Effect__c?.split(
                ';'
            );
            if (goalTitles && goalTitles.length > 0) {
                const developmentGoals = goalTitles.map((title, index) => {
                    return { title: title, amount: goalAmounts[index] };
                });
                setDevelopmentGoals(developmentGoals);
            }

            // // "Collaborators" & "Applicants" all comes from "initiative._collaborators"
            // // Split them up depending on the type.
            // // TYPE: "Additional collaborator" === Collaborator. All other types are Applicants
            // let collaborators = Object.values(initiative._collaborators).filter(
            //     item => {
            //         return item.Translated_Type__c == 'Additional collaborator'
            //             ? true
            //             : false;
            //     }
            // );
            // let applicants = Object.values(initiative._collaborators).filter(
            //     item => {
            //         return item.Translated_Type__c != 'Additional collaborator'
            //             ? true
            //             : false;
            //     }
            // );
            // setApplicants(applicants);
            // setCollaborators(collaborators);

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
                                {initiativeData.Translated_Stage__c}
                            </div>
                        </SectionWrapper>
                    </SectionWrapper>
                    {/* Overview */}
                    <SectionWrapper>
                        {/* <div className="p-16 md:p-32 xl:px-64"> */}
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
                                    {initiativeData.Translated_Category__c}
                                </h3>
                                <div className="mt-16 t-sh6 text-blue-60">
                                    {labelTodo('Additional goals')}
                                </div>
                                <h3 className="t-h5">
                                    {labelTodo('Missing data? 🛑')}
                                </h3>
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
                    <SectionWrapper>
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
                        <SectionWrapper>
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
                        <SectionWrapper>
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
                    {employeesFunded && (
                        <SectionWrapper>
                            <SectionWrapper>
                                <h3 className="t-h4">
                                    {labelTodo('Employees funded by the grant')}
                                </h3>
                            </SectionWrapper>

                            {/* <div className="inline-grid w-full grid-cols-2 gap-16 mt-16 md:grid-cols-4 2xl:grid-cols-6">
                                <NumberCard
                                    number="6"
                                    headline="Researchers"
                                    description="4 female, 2 male"
                                />
                                <NumberCard
                                    number="2"
                                    headline="Project managers"
                                    description="2 male"
                                />
                                <NumberCard
                                    number="5"
                                    headline="Administrative staff"
                                    description="3 female, 2 male"
                                />
                                <NumberCard
                                    number="6"
                                    headline="Technical staff"
                                    description="4 female, 2 male"
                                />
                                <NumberCard
                                    number="20"
                                    headline="Other"
                                    description="10 female, 10 male"
                                />
                                <NumberCard
                                    number="3"
                                    headline="Scientists"
                                    description="3 female"
                                />
                            </div> */}
                            <TextCard
                                hasBackground={true}
                                headline={labelTodo('Updates from this year')}
                                body={employeesFunded}
                            />
                        </SectionWrapper>
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Goals */}
                    {/* {goals && (
                        <SectionWrapper>
                            <SectionWrapper>
                                <h3 className="t-h4">{labelTodo('Goals')}</h3>
                            </SectionWrapper>

                            {goals.map((item, index) => {
                                <>
                                    <TextCard
                                        hasBackground={false}
                                        className="mt-32"
                                        headline="🛑 A custom objective we’ve created"
                                        label="Custom"
                                    />

                                    <TextCard
                                        hasBackground={true}
                                        className="mt-32"
                                        headline="🛑 Updates from this year"
                                        body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                                    />
                                    {index < goals.index - 1 && <DividerLine />}
                                </>;
                            })}
                        </SectionWrapper>
                    )} */}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Activities */}
                    {activities && (
                        <SectionWrapper>
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
                                        <ChartCard
                                            useBorder={true}
                                            headline="Indicators"
                                            items={item.indicators}
                                        />
                                    </SectionWrapper>
                                    <TextCard
                                        hasBackground={true}
                                        className="mt-32"
                                        headline="Updates from this year"
                                        body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement. "
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
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="t-h4">
                                {labelTodo('Sharing of results')}
                            </h3>

                            <ReportSharingCard
                                headline="Science Weekly 🔬"
                                label="Journal publication"
                                tags={[
                                    'Policymakers',
                                    'Politicians',
                                    'Professional practitioners',
                                ]}
                                items={[
                                    {
                                        label: 'Publication type',
                                        text: 'Industry magazine',
                                    },
                                    { label: 'Publication year', text: '2021' },
                                    {
                                        label: 'Publisher',
                                        text:
                                            'Media company publishing international',
                                    },
                                    {
                                        label: 'Author',
                                        text: 'Uganda, Denmark',
                                    },
                                    { label: 'DOI', text: 'Uganda, Denmark' },
                                ]}
                            />
                        </SectionWrapper>

                        <TextCard
                            hasBackground={true}
                            headline="Description for this report"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                        />

                        <DividerLine />

                        <SectionWrapper>
                            <ReportSharingCard
                                headline="The Joe Rogan Podcast 💪"
                                label="TV/radio/film/podcast"
                                tags={[
                                    'Policymakers',
                                    'Politicians',
                                    'Professional practitioners',
                                ]}
                            />
                        </SectionWrapper>

                        <TextCard
                            hasBackground={true}
                            headline="Description for this report"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                        />
                    </SectionWrapper>
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="t-h4">
                                {labelTodo('Loogbook entries')}
                            </h3>
                        </SectionWrapper>
                        entries...
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
