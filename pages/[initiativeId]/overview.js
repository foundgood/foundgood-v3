// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';
import dayjs from 'dayjs';

// Utilities
import { getPermissionRules } from 'utilities';
import { useLabels, useResponsive } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';
import { isJson } from 'utilities';

// Data
import sdgsColors from 'utilities/data/sdgColors';

// Components
import WithAuth from 'components/withAuth';
import Preloader from 'components/preloader';
import Footer from 'components/_layout/footer';
import UpdateButton from 'components/updateButton';
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import NumberCard from 'components/_initiative/numberCard';
import DividerLine from 'components/_initiative/dividerLine';
import TextCard from 'components/_initiative/textCard';
import OrganisationsInvolved from 'components/_initiative/organisationsInvolved';
import Contacts from 'components/_initiative/contacts';

const ProjectComponent = ({ pageProps }) => {
    // Fetch initiative data
    const { initiative, CONSTANTS } = useInitiativeDataStore();

    // Hook: Metadata
    const { label, object, pickList, dataSet, getValueLabel } = useLabels();

    // Hook: Get breakpoint
    const bp = useResponsive();

    // Effect: Listen to breakpoint and toggle menu accordingly
    const largeBps = ['lg', 'xl', '2xl', '3xl'];

    // Data manipulation
    const [developmentGoals, setDevelopmentGoals] = useState();
    const [initiativeData, setInitiativeData] = useState();
    const [donutData, setDonutData] = useState();
    const [pieChartStyle, setPieChartStyle] = useState({});
    const [totalAmount, setTotalAmount] = useState();
    const [currency, setCurrency] = useState();

    const [applicants, setApplicants] = useState();
    const [collaborators, setCollaborators] = useState();
    const [employeeGroups, setEmployeeGroups] = useState();

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
        // console.log('initiative: ', initiative);

        if (initiative?.Id) {
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
                if (employee.Gender__c == 'Male') {
                    group.male = group.male ? group.male + 1 : 1;
                } else if (employee.Gender__c == 'Female') {
                    group.female = group.female ? group.female + 1 : 1;
                } else if (employee.Gender__c == 'Other') {
                    group.other = group.other ? group.other + 1 : 1;
                }
                return result;
            }, {});
            setEmployeeGroups(employeeGroups);

            // "Collaborators" & "Applicants" all comes from "initiative._collaborators"
            // Split them up depending on the type.
            // TYPE: "Additional collaborator" === Collaborator. All other types are Applicants
            const collaborators = Object.values(
                initiative._collaborators
            ).filter(item => {
                if (
                    CONSTANTS.COLLABORATORS.ADDITIONAL_COLLABORATORS.includes(
                        item.Type__c
                    )
                ) {
                    return item;
                }
            });
            const applicants = Object.values(initiative._collaborators).filter(
                item => {
                    if (
                        !CONSTANTS.COLLABORATORS.ADDITIONAL_COLLABORATORS.includes(
                            item.Type__c
                        )
                    ) {
                        return item;
                    }
                }
            );
            setApplicants(applicants);
            setCollaborators(collaborators);

            // Merge goal data, to single array
            const sdgNums = initiative?.Problem_Effect__c?.split(';');
            const sdgs = pickList('Initiative__c.Problem_Effect__c'); // get global sdgs
            if (sdgNums?.length > 0) {
                const developmentGoals = sdgNums.map(num => {
                    return {
                        title:
                            sdgs.find(sdg => sdg.value === num)?.label ?? null,
                        amount: num,
                    };
                });
                setDevelopmentGoals(developmentGoals);
            }

            // Make sure data is loaded
            if (
                initiative?._funders &&
                Object.keys(initiative?._funders).length !== 0
            ) {
                // 🍩 Donut data 🍩
                // Build donut slices using color gradient
                // See here: https://keithclark.co.uk/articles/single-element-pure-css-pie-charts/
                const currencies = Object.values(initiative._funders).reduce(
                    (acc, funder) => {
                        acc.push(funder.CurrencyIsoCode);
                        return acc;
                    },
                    []
                );

                const hasMultipleCurrencies =
                    new Set(currencies).size !== 1 ? true : false;

                // If initiative have multiple currencies - Hide donutChart!
                if (!hasMultipleCurrencies) {
                    const currency = Object.values(initiative._funders)[0]
                        .CurrencyIsoCode;
                    const totalAmount = Object.values(
                        initiative._funders
                    ).reduce((total, funder) => {
                        return total + funder.Amount__c;
                    }, 0);
                    setTotalAmount(totalAmount);
                    setCurrency(currency);

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

                    if (donutData?.length > 1) {
                        const multiplier = 3.6; // 1% of 360

                        // Create object array - add previous items "deg" (360 deg), to position current slice
                        let donutStyles = donutData.reduce(
                            (previous, slice) => {
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
                            },
                            []
                        );
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
                        const gradient = `conic-gradient(${donutStyles.join(
                            ', '
                        )})`;
                        setPieChartStyle({ backgroundImage: gradient });
                    } else {
                        setPieChartStyle({ backgroundColor: donutData[0].hex });
                    }
                    setDonutData(donutData);
                }
            }

            setInitiativeData(initiative);
        }
    }, [initiative]);

    // Funder objective
    const funderObjective =
        Object.values(initiative?._goals).find(
            item => item.Type__c === CONSTANTS.GOALS.GOAL_PREDEFINED
        ) || {};

    return (
        <>
            {/* Preloading - Show loading */}
            {!initiativeData && <Preloader hasBg={true} />}

            {/* Data Loaded - Show initiative */}
            {initiativeData && (
                <div className="space-y-32 animate-fade-in">
                    <SectionWrapper>
                        <h1 className="t-h1">{label('MenuContext')}</h1>
                    </SectionWrapper>
                    {/* Overview */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewOverviewHeading')}
                            </h2>
                            <UpdateButton
                                {...{
                                    baseUrl: 'overview',
                                    rules: getPermissionRules(
                                        'initiative',
                                        'overview',
                                        'update'
                                    ),
                                }}
                            />
                        </div>

                        <div className="mt-24">
                            {largeBps.includes(bp) && (
                                <div className="overflow-hidden rounded-8">
                                    <div className="relative w-full h-full">
                                        {initiativeData.Hero_Image_URL__c && (
                                            <div className="relative mt-16 bg-blue-10 imageContainer">
                                                <Image
                                                    className="image"
                                                    src={
                                                        initiativeData.Hero_Image_URL__c
                                                    }
                                                    layout="fill"
                                                />
                                                {/* <img
                                                    className="w-full h-auto"
                                                    src={
                                                        initiativeData.Hero_Image_URL__c
                                                    }
                                                /> */}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col mt-24">
                                <p className="t-preamble">
                                    {initiativeData.Summary__c}
                                </p>
                                <div className="mt-48 lg:mt-32 lg:flex lg:items-start">
                                    <div className="p-16 mb-20 border-4 lg:mr-12 lg:w-1/2 border-gray-10 rounded-8">
                                        <h4 className="t-sh6 text-blue-60">
                                            {label(
                                                'InitiativeViewGrantGivingArea'
                                            )}
                                        </h4>
                                        <h3 className="t-h5">
                                            {initiativeData.Category__c}
                                        </h3>

                                        {funderObjective.Funder_Objective__c && (
                                            <>
                                                <h4 className="mt-16 t-sh6 text-blue-60">
                                                    {object.label(
                                                        'Initiative_Goal__c.Funder_Objective__c'
                                                    )}
                                                </h4>
                                                <h3 className="t-h5">
                                                    {getValueLabel(
                                                        'Initiative_Goal__c.Funder_Objective__c',
                                                        funderObjective.Funder_Objective__c,
                                                        true
                                                    )}
                                                </h3>
                                            </>
                                        )}

                                        <h4 className="mt-16 t-sh6 text-blue-60">
                                            {label(
                                                'ReportViewInitiativePeriod'
                                            )}
                                        </h4>
                                        {initiativeData.Grant_Start_Date__c && (
                                            <h3 className="t-h5">
                                                {`${dayjs(
                                                    initiativeData.Grant_Start_Date__c
                                                ).format(
                                                    'DD.MM.YYYY'
                                                )} - ${dayjs(
                                                    initiativeData.Grant_End_Date__c
                                                ).format('DD.MM.YYYY')}`}
                                            </h3>
                                        )}
                                    </div>

                                    <div className="p-16 border-4 lg:ml-12 lg:w-1/2 border-gray-10 rounded-8">
                                        <h4 className="t-sh6 text-blue-60">
                                            {label(
                                                'InitiativeViewInitiativeLocation'
                                            )}
                                        </h4>
                                        {/* Location */}
                                        {initiativeData.Where_Is_Problem__c && (
                                            <h3 className="t-h5">
                                                {initiativeData.Where_Is_Problem__c?.split(
                                                    ';'
                                                )
                                                    .map(
                                                        location =>
                                                            dataSet(
                                                                'Countries'
                                                            ).find(
                                                                c =>
                                                                    c.value ===
                                                                    location
                                                            )?.label
                                                    )
                                                    .join(', ')}
                                            </h3>
                                        )}
                                        {/* Empty state - No Location */}
                                        {!initiativeData.Where_Is_Problem__c && (
                                            <div>
                                                {label('ReportEmptyLocation')}
                                            </div>
                                        )}

                                        <h4 className="mt-16 t-sh6 text-blue-60">
                                            {label('InitiativeViewSDGSs')}
                                        </h4>
                                        <div className="flex flex-col">
                                            {developmentGoals &&
                                                developmentGoals.map(
                                                    (problem, index) => (
                                                        <h3
                                                            key={`g-${index}`}
                                                            className="mt-8 t-h5">
                                                            <span
                                                                className={`px-6 pt-4 mr-8 leading-none text-white rounded-4`}
                                                                style={{
                                                                    backgroundColor:
                                                                        sdgsColors[
                                                                            problem.amount -
                                                                                1
                                                                        ],
                                                                }}>
                                                                {problem.amount}
                                                            </span>
                                                            {problem.title}
                                                        </h3>
                                                    )
                                                )}
                                            {!developmentGoals && (
                                                <div>
                                                    {label('ReportEmptySDGs')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SectionWrapper>
                    {/* Organisations Involved */}
                    {/* <OrganisationsInvolved /> */}
                    {/* Contacts */}
                    {/* <Contacts /> */}
                    {/* Funding */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewFundersGrantsHeading')}
                            </h2>
                            <UpdateButton
                                {...{
                                    rules: getPermissionRules(
                                        'initiative',
                                        'funders',
                                        'update'
                                    ),
                                    baseUrl: 'funders',
                                }}
                            />
                        </div>

                        {donutData && (
                            <div className="flex flex-col items-center p-16 md:flex-row">
                                <div className="w-full p-32 md:w-1/2">
                                    {/* Donut chart */}
                                    <div className="pie" style={pieChartStyle}>
                                        <div className="absolute w-full -mt-16 text-center top-1/2">
                                            <p className="t-sh7 text-blue-60">
                                                {label(
                                                    'InitiativeViewTotalFunded'
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
                                        {label('InitiativeViewFundingOverview')}
                                    </div>
                                    {/* List of funders */}
                                    {donutData?.map((item, index) => (
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
                        <div className="mt-32 overflow-x-scroll md:overflow-hidden">
                            {/* BUG: min-width breaks the margins on mobile! min-w-[680px] */}
                            <div className="mt-32 min-w-[768px]">
                                {/* Table header */}
                                <div className="flex pb-8">
                                    <div className="w-full t-footnote-bold">
                                        {label(
                                            'InitiativeViewFunderTableColumnHeadersFunder'
                                        )}
                                    </div>
                                    <div className="w-full t-footnote-bold">
                                        {label(
                                            'InitiativeViewFunderTableColumnHeadersType'
                                        )}
                                    </div>
                                    <div className="w-full t-footnote-bold">
                                        {label(
                                            'InitiativeViewFunderTableColumnHeadersAmount'
                                        )}
                                    </div>
                                    <div className="w-full t-footnote-bold">
                                        {label(
                                            'InitiativeViewFunderTableColumnHeadersApplicationId'
                                        )}
                                    </div>
                                    <div className="w-full t-footnote-bold">
                                        {label(
                                            'InitiativeViewFunderTableColumnHeadersGrantPeriod'
                                        )}
                                    </div>
                                </div>
                                {/* Table Rows */}
                                {Object.values(initiativeData._funders).map(
                                    (item, index) => (
                                        <div
                                            key={`f-${index}`}
                                            className="flex pt-16 pb-16 border-t-2 border-amber-10">
                                            <div className="w-full t-h6">
                                                {item.Account__r.Name}
                                            </div>
                                            <div className="w-full">
                                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                                    {item.Type__c}
                                                </span>
                                            </div>
                                            <div className="w-full t-caption">
                                                {item.CurrencyIsoCode}{' '}
                                                {item.Amount__c?.toLocaleString(
                                                    'de-DE'
                                                )}
                                            </div>
                                            <div className="w-full t-caption">
                                                {item.Application_Id__c}
                                            </div>
                                            <div className="w-full t-caption">
                                                {dayjs(
                                                    item.Grant_Start_Date__c
                                                ).format('DD.MM.YYYY')}
                                                {' - '}
                                                {dayjs(
                                                    item.Grant_End_Date__c
                                                ).format('DD.MM.YYYY')}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Empty state - No funders */}
                        {Object.values(initiativeData._funders).length < 1 && (
                            <SectionEmpty type="initiative" />
                        )}
                    </SectionWrapper>

                    {/* Goals */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewGoalsHeading')}
                            </h2>
                            <UpdateButton
                                {...{
                                    rules: getPermissionRules(
                                        'initiative',
                                        'goals',
                                        'update'
                                    ),
                                    baseUrl: 'goals',
                                }}
                            />
                        </div>
                        {/* List goals */}
                        {Object.values(initiativeData._goals).map(
                            (item, index) => {
                                const title =
                                    item.Type__c == 'Custom'
                                        ? item.Goal__c
                                        : getValueLabel(
                                              'Initiative_Goal__c.Funder_Objective__c',
                                              item.Funder_Objective__c,
                                              true
                                          );

                                return (
                                    <TextCard
                                        key={`g-${index}`}
                                        hasBackground={false}
                                        className="mt-24"
                                        headline={title}
                                        label={item.Type__c}
                                    />
                                );
                            }
                        )}
                        {/* Empty state - No goals */}
                        {Object.values(initiativeData._goals).length < 1 && (
                            <SectionEmpty type="initiative" />
                        )}
                    </SectionWrapper>
                    {/* Applicants */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewApplicantsHeading')}
                            </h2>
                            <UpdateButton
                                {...{
                                    rules: getPermissionRules(
                                        'initiative',
                                        'applicants',
                                        'update'
                                    ),
                                    baseUrl: 'applicants',
                                }}
                            />
                        </div>
                        {applicants &&
                            applicants.map((item, index) => (
                                <div key={item.Id} className="mt-32">
                                    <h4 className="t-h5">{item.Type__c}</h4>
                                    <h3 className="flex items-center leading-none t-h4">
                                        {/* TODO - Where does image come from? */}
                                        {/*
                                        <div className="relative w-32 h-32 mr-8 overflow-hidden rounded-8">
                                            <Image
                                                src="/images/fg-landscape-1.jpg"
                                                layout="fill"
                                                objectFit="cover"
                                                sizes="64px"
                                            />
                                        </div>
                                        */}
                                        {item.Account__r?.Name}
                                    </h3>
                                    <p className="mt-16 t-sh5 text-blue-60">
                                        {/* Display year, not full date */}
                                        {item.Start_Date__c &&
                                            `${dayjs(item.Start_Date__c).format(
                                                'YYYY'
                                            )} - ${dayjs(
                                                item.End_Date__c
                                            ).format('YYYY')}`}
                                    </p>
                                    <p className="mt-16 t-body">
                                        {item.Description__c}
                                    </p>
                                    {index < applicants.length - 1 && (
                                        <DividerLine />
                                    )}
                                </div>
                            ))}
                        {/* Empty state - No Applicants */}
                        {applicants.length < 1 && (
                            <SectionEmpty type="initiative" />
                        )}
                    </SectionWrapper>

                    {/* Collaborators */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewCollaboratorsHeading')}
                            </h2>
                            <UpdateButton
                                {...{
                                    rules: getPermissionRules(
                                        'initiative',
                                        'collaborators',
                                        'update'
                                    ),
                                    baseUrl: 'collaborators',
                                }}
                            />
                        </div>
                        {collaborators &&
                            collaborators.map((item, index) => (
                                <div key={item.Id} className="mt-32">
                                    <h4 className="t-h5">{item.Type__c}</h4>
                                    <h3 className="flex items-center leading-none t-h4">
                                        {/* TODO - Where does image come from? */}
                                        {/* <div className="relative w-32 h-32 mr-8 overflow-hidden rounded-8">
                                            <Image
                                                src="/images/fg-landscape-1.jpg"
                                                layout="fill"
                                                objectFit="cover"
                                                sizes="64px"
                                            />
                                        </div> */}
                                        {item.Account__r.Name}
                                    </h3>
                                    <p className="mt-16 t-sh5 text-blue-60">
                                        {item.Start_Date__c &&
                                            `${dayjs(item.Start_Date__c).format(
                                                'YYYY'
                                            )} - ${dayjs(
                                                item.End_Date__c
                                            ).format('YYYY')}`}
                                    </p>
                                    <p className="mt-16 t-body">
                                        {item.Description__c}
                                    </p>
                                </div>
                            ))}
                        {/* Empty state - No Collaborators */}
                        {collaborators.length < 1 && (
                            <SectionEmpty type="initiative" />
                        )}
                    </SectionWrapper>

                    {/* Employees funded */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewEmployeesFundedHeading')}
                            </h2>
                            <UpdateButton
                                {...{
                                    rules: getPermissionRules(
                                        'initiative',
                                        'employeesFunded',
                                        'update'
                                    ),
                                    baseUrl: 'employees-funded',
                                }}
                            />
                        </div>
                        {Object.values(initiativeData._employeesFunded).length >
                            0 && (
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
                                                    useBackground={true}
                                                    number={group.total}
                                                    headline={group.role}
                                                    description={description}
                                                />
                                            );
                                        }
                                    )}
                                </div>
                                <div className="mt-32">
                                    {/* Table header */}
                                    <div className="flex pb-8">
                                        <div className="w-full t-footnote-bold">
                                            {label(
                                                'InitiativeViewEmployeesTableColumnHeadersTitle'
                                            )}
                                        </div>
                                        <div className="w-full t-footnote-bold">
                                            {label(
                                                'InitiativeViewEmployeesTableColumnHeadersRole'
                                            )}
                                        </div>
                                        {largeBps.includes(bp) && (
                                            <div className="w-full t-footnote-bold">
                                                {label(
                                                    'InitiativeViewEmployeesTableColumnHeadersUtilisation'
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Table Rows */}
                                    {Object.values(
                                        initiativeData._employeesFunded
                                    ).map((item, index) => (
                                        <div
                                            key={`e-${index}`}
                                            className="flex pt-16 pb-16 border-t-2 border-amber-10">
                                            <div className="w-full t-h6">
                                                {item.Job_Title__c}
                                            </div>
                                            <div className="w-full">
                                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                                    {item.Role_Type__c}
                                                </span>
                                            </div>
                                            {largeBps.includes(bp) && (
                                                <div className="w-full t-caption">
                                                    {
                                                        item.Percent_Involvement__c
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Empty state - No Employees */}
                        {Object.values(initiativeData._employeesFunded).length <
                            1 && <SectionEmpty type="initiative" />}
                    </SectionWrapper>

                    {/* Problem Causes */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewCausesHeading')}
                            </h2>
                            {/* <UpdateButton
                                {...{baseUrl: ""}}
                            /> */}
                        </div>
                        {initiativeData.Problem_Causes__c && (
                            <>
                                {/* Some fields are sometimes JSON strings */}
                                {isJson(initiativeData.Problem_Causes__c) &&
                                    JSON.parse(
                                        initiativeData.Problem_Causes__c
                                    ).map(item => (
                                        <p
                                            key={item.id}
                                            className="mt-16 t-body">
                                            {item.text}
                                        </p>
                                    ))}
                                {!isJson(initiativeData.Problem_Causes__c) && (
                                    <p className="mt-16 t-body">
                                        {initiativeData.Problem_Causes__c}
                                    </p>
                                )}
                            </>
                        )}
                        {!initiativeData.Problem_Causes__c && (
                            <SectionEmpty type="initiative" />
                        )}
                    </SectionWrapper>

                    {/* Our vision */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewVisionHeading')}
                            </h2>
                            {/* <UpdateButton
                                {...{baseUrl: ""}}
                            /> */}
                        </div>
                        {initiativeData.Ultimate_Outcome__c && (
                            <p className="mt-16 t-body">
                                {initiativeData.Ultimate_Outcome__c}
                            </p>
                        )}
                        {!initiativeData.Problem_Causes__c && (
                            <SectionEmpty type="initiative" />
                        )}
                    </SectionWrapper>

                    {/* Organisational focus */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewOrgFocusHeading')}
                            </h2>
                            {/* <UpdateButton
                                {...{baseUrl: ""}}
                            /> */}
                        </div>
                        {initiativeData.Why_Problem_Solving__c && (
                            <p className="mt-16 t-body">
                                {initiativeData.Why_Problem_Solving__c}
                            </p>
                        )}
                        {!initiativeData.Why_Problem_Solving__c && (
                            <SectionEmpty type="initiative" />
                        )}
                    </SectionWrapper>

                    {/* The problem to be solved */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewProblemsHeading')}
                            </h2>
                            {/* <UpdateButton
                                {...{baseUrl: ""}}
                            /> */}
                        </div>
                        {initiativeData.Situation_Today__c && (
                            <p className="mt-16 t-body">
                                {initiativeData.Situation_Today__c}
                            </p>
                        )}
                        {!initiativeData.Situation_Today__c && (
                            <SectionEmpty type="initiative" />
                        )}
                    </SectionWrapper>

                    {/* Reason for approach */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewReasonsHeading')}
                            </h2>
                            {/* <UpdateButton
                                {...{baseUrl: ""}}
                            /> */}
                        </div>
                        {initiativeData.Approach_Thinking__c && (
                            <p className="mt-16 t-body">
                                {initiativeData.Approach_Thinking__c}
                            </p>
                        )}
                        {!initiativeData.Approach_Thinking__c && (
                            <SectionEmpty type="initiative" />
                        )}
                    </SectionWrapper>

                    <Footer />
                </div>
            )}
        </>
    );
};

ProjectComponent.propTypes = {
    pageProps: t.object,
};

ProjectComponent.defaultProps = {
    pageProps: {},
};

ProjectComponent.layout = 'initiative';

export default WithAuth(ProjectComponent);
