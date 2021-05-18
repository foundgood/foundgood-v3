// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';

// Utilities
import { useMetadata, useAuth, useResponsive } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';
import { isJson } from 'utilities';

// Components
import Button from 'components/button';
import NumberCard from 'components/_report/numberCard';
import SectionWrapper from 'components/sectionWrapper';

const ProjectComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Fetch initiative data
    const { initiative } = useInitiativeDataStore();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Hook: Get breakpoint
    const bp = useResponsive();

    // Effect: Listen to breakpoint and toggle menu accordingly
    const largeBps = ['lg', 'xl', '2xl', '3xl'];

    // Data manipulation
    const [developmentGoals, setDevelopmentGoals] = useState();
    const [initiativeData, setInitiativeData] = useState();
    const [donutData, setDonutData] = useState();
    const [pieChartStyle, setPieChartStyle] = useState({});
    const [applicants, setApplicants] = useState();
    const [collaborators, setCollaborators] = useState();

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
        // Initial Load - Handle empty object state?
        if (initiative._funders == null) return;

        console.log('initiative: ', initiative);

        // "Collaborators" & "Applicants" all comes from "initiative._collaborators"
        // Split them up depending on the type.
        // TYPE: "Additional collaborator" === Collaborator. All other types are Applicants
        const collaborators = Object.values(initiative._collaborators).filter(
            item => {
                if (item.Translated_Type__c == 'Additional collaborator') {
                    return item;
                }
            }
        );
        const applicants = Object.values(initiative._collaborators).filter(
            item => {
                if (item.Translated_Type__c != 'Additional collaborator') {
                    return item;
                }
            }
        );
        setApplicants(applicants);
        setCollaborators(collaborators);

        // Merge goal data, to signel array
        const goalAmounts = initiative?.Problem_Effect__c?.split(';');
        const goalTitles = initiative?.Translated_Problem_Effect__c?.split(';');
        if (goalTitles && goalTitles.length > 0) {
            const developmentGoals = goalTitles.map((title, index) => {
                return { title: title, amount: goalAmounts[index] };
            });
            setDevelopmentGoals(developmentGoals);
        }

        // 🍩 Donut data 🍩
        // Build donut slices using color gradient
        // See here: https://keithclark.co.uk/articles/single-element-pure-css-pie-charts/

        const totalAmount = Object.values(initiative._funders).reduce(
            (total, funder) => {
                return total + funder.Amount__c;
            },
            0
        );

        // // TEMPORARY USE OTHER AMOUNTS
        // const donutAmounts = [500000, 1000000, 350000];
        // const totalAmount = 1850000;

        // const donutData = initiative?._funders.map((funder, index) => {
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
                    // // TEMPORARY USE OTHER AMOUNTS
                    // amount: donutAmounts[index],
                    // totalAmount: totalAmount,
                    // percentage: donutAmounts[index] / totalAmount,
                };
            }
        );

        const multiplier = 3.6; // 1% of 360

        // Create object array - add previous items "deg" (360 deg), to position current slice
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
    }, [initiative]);

    return (
        <>
            {initiativeData && (
                <>
                    <SectionWrapper>
                        <h1 className="t-h1">{labelTodo('Overview')}</h1>
                    </SectionWrapper>
                    {/* Overview */}
                    <SectionWrapper className="bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">{labelTodo('Summary')}</h2>
                            <Button variant="secondary">
                                {labelTodo('Update')}
                            </Button>
                        </div>

                        <div className="mt-24">
                            {largeBps.includes(bp) && (
                                <div className="overflow-hidden rounded-8">
                                    <div className="relative w-full h-full">
                                        {initiativeData.Hero_Image_URL__c && (
                                            <div className="relative mt-16 bg-blue-10 imageContainer">
                                                {/* <Image
                                                    className="image"
                                                    src={
                                                        initiativeData.Hero_Image_URL__c
                                                    }
                                                    layout="fill"
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
                                            {labelTodo('Grant giving area')}
                                        </h4>
                                        <h3 className="t-h5">
                                            {
                                                initiativeData.Translated_Category__c
                                            }
                                        </h3>

                                        <h4 className="mt-16 t-sh6 text-blue-60">
                                            {labelTodo('Initiative period')}
                                        </h4>
                                        <h3 className="t-h5">
                                            {initiativeData.Grant_Start_Date__c}
                                            {' - '}
                                            {initiativeData.Grant_End_Date__c}
                                        </h3>
                                    </div>

                                    <div className="p-16 border-4 lg:ml-12 lg:w-1/2 border-gray-10 rounded-8">
                                        <h4 className="t-sh6 text-blue-60">
                                            {labelTodo('Initiative location')}
                                        </h4>
                                        <h3 className="t-h5">
                                            {initiativeData.Translated_Where_Is_Problem__c?.split(
                                                ';'
                                            ).join(', ')}
                                        </h3>

                                        <h4 className="mt-16 t-sh6 text-blue-60">
                                            {labelTodo(
                                                'Sustainable development goals'
                                            )}
                                        </h4>
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
                                </div>
                            </div>
                        </div>
                    </SectionWrapper>
                    {/* Funding */}
                    <SectionWrapper className="mt-32 bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">{labelTodo('Funding')}</h2>
                            <Button variant="secondary">
                                {labelTodo('Update')}
                            </Button>
                        </div>

                        <div className="flex items-center p-16">
                            <div className="w-1/2 p-24 t-h1">
                                {/* Donut chart */}
                                <div
                                    className="pie"
                                    style={pieChartStyle}></div>
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

                        <div className="mt-32 overflow-x-scroll md:overflow-hidden">
                            <div className="mt-32 min-w-[680px]">
                                {/* Table header */}
                                <div className="flex pb-8">
                                    <div className="w-full t-footnote-bold">
                                        {labelTodo('Funder')}
                                    </div>
                                    <div className="w-full t-footnote-bold">
                                        {labelTodo('Type')}
                                    </div>
                                    <div className="w-full t-footnote-bold">
                                        {labelTodo('Amount')}
                                    </div>
                                    <div className="w-full t-footnote-bold">
                                        {labelTodo('Approval date')}
                                    </div>
                                    <div className="w-full t-footnote-bold">
                                        {labelTodo('Grant period')}
                                    </div>
                                </div>
                                {/* Table Rows */}
                                {/* initiativeData._funders.map((item, index) => ( */}
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
                                                    {item.Translated_Type__c}
                                                </span>
                                            </div>
                                            <div className="w-full t-caption">
                                                {item.CurrencyIsoCode}{' '}
                                                {item.Amount__c.toLocaleString(
                                                    'de-DE'
                                                )}
                                            </div>
                                            <div className="w-full t-caption">
                                                {item.Approval_Date__c}
                                            </div>
                                            <div className="w-full t-caption">
                                                {item.Grant_Start_Date__c}
                                                {' - '}
                                                {item.Grant_End_Date__c}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </SectionWrapper>
                    {/* Goals */}
                    <SectionWrapper className="mt-32 bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">{labelTodo('Goals')}</h2>
                            <Button variant="secondary">
                                {labelTodo('Update')}
                            </Button>
                        </div>
                        {/* initiativeData._goals.map((goal, index) => ( */}
                        {Object.values(initiativeData._goals).map(
                            (goal, index) => (
                                <div
                                    key={`g-${index}`}
                                    className="p-16 mt-24 border-4 border-blue-10 rounded-4">
                                    <p className="t-preamble">{goal.Goal__c}</p>
                                    <p className="t-sh6 text-blue-60">
                                        {goal.Type__c}
                                    </p>
                                </div>
                            )
                        )}
                    </SectionWrapper>
                    {/* Applicants */}
                    <SectionWrapper className="mt-32 bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">{labelTodo('Applicants')}</h2>
                            <Button variant="secondary">
                                {labelTodo('Update')}
                            </Button>
                        </div>
                        {applicants &&
                            applicants.map((item, index) => (
                                <div key={item.Id} className="mt-32">
                                    <h4 className="t-h5">
                                        {item.Translated_Type__c}
                                    </h4>
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
                                        {/* Display year, not full date */}
                                        {item.Start_Date__c.substring(0, 4)}
                                        {' - '}
                                        {item.End_Date__c.substring(0, 4)}
                                    </p>
                                    <p className="mt-16 t-body">
                                        {item.Description__c}
                                    </p>
                                </div>
                            ))}
                    </SectionWrapper>
                    {/* Collaborators */}
                    <SectionWrapper className="mt-32 bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {labelTodo('Collaborators')}
                            </h2>
                            <Button variant="secondary">
                                {labelTodo('Update')}
                            </Button>
                        </div>
                        {collaborators &&
                            collaborators.map((item, index) => (
                                <div key={item.Id} className="mt-32">
                                    <h4 className="t-h5">
                                        {item.Translated_Type__c}
                                    </h4>
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
                                        {/* Display year, not full date */}
                                        {item.Start_Date__c.substring(0, 4)}
                                        {' - '}
                                        {item.End_Date__c.substring(0, 4)}
                                    </p>
                                    <p className="mt-16 t-body">
                                        {item.Description__c}
                                    </p>
                                </div>
                            ))}
                    </SectionWrapper>

                    {/* Employees funded */}
                    {initiativeData._employeesFunded && (
                        <SectionWrapper className="mt-32 bg-white rounded-8">
                            <div className="flex justify-between">
                                <h2 className="t-h3">
                                    {labelTodo('Employees funded')}
                                </h2>
                                <Button variant="secondary">
                                    {labelTodo('Update')}
                                </Button>
                            </div>

                            <div className="inline-grid w-full grid-cols-2 gap-16 mt-16 md:grid-cols-4 xl:grid-cols-4">
                                {/* TODO - Decide on logic for these cards */}
                                <h1>Employee cards - TBD</h1>
                                {/* <NumberCard
                                    useBackground={true}
                                    number="6"
                                    headline="Researchers"
                                    description="4 female, 2 male"
                                />
                                <NumberCard
                                    useBackground={true}
                                    number="2"
                                    headline="Project managers"
                                    description="2 male"
                                />
                                <NumberCard
                                    useBackground={true}
                                    number="5"
                                    headline="Administrative staff"
                                    description="3 female, 2 male"
                                />
                                <NumberCard
                                    useBackground={true}
                                    number="6"
                                    headline="Technical staff"
                                    description="4 female, 2 male"
                                />
                                <NumberCard
                                    useBackground={true}
                                    number="20"
                                    headline="Other"
                                    description="10 female, 10 male"
                                />
                                <NumberCard
                                    useBackground={true}
                                    number="3"
                                    headline="Scientists"
                                    description="3 female"
                                /> */}
                            </div>
                            <div className="mt-32">
                                {/* Table header */}
                                <div className="flex pb-8">
                                    <div className="w-full t-footnote-bold">
                                        {labelTodo('Title')}
                                    </div>
                                    <div className="w-full t-footnote-bold">
                                        {labelTodo('Role')}
                                    </div>
                                    {largeBps.includes(bp) && (
                                        <div className="w-full t-footnote-bold">
                                            {labelTodo('Utilisation')}
                                        </div>
                                    )}
                                </div>
                                {/* Table Rows */}

                                {/* initiativeData._employeesFunded?.length && */}
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
                                                {item.Translated_Role_Type__c}
                                            </span>
                                        </div>
                                        {largeBps.includes(bp) && (
                                            <div className="w-full t-caption">
                                                {item.Percent_Involvement__c}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </SectionWrapper>
                    )}
                    {/* Problem Causes */}
                    {initiativeData.Problem_Causes__c && (
                        <SectionWrapper className="mt-32 bg-white rounded-8">
                            <div className="flex justify-between">
                                <h2 className="t-h3">
                                    {labelTodo('Causes of the problem')}
                                </h2>
                                <Button variant="secondary">
                                    {labelTodo('Update')}
                                </Button>
                            </div>

                            {/* Some fields are sometimes JSON strings */}
                            {isJson(initiativeData.Problem_Causes__c) &&
                                JSON.parse(
                                    initiativeData.Problem_Causes__c
                                ).map(item => (
                                    <p key={item.id} className="mt-16 t-body">
                                        {item.text}
                                    </p>
                                ))}
                            {!isJson(initiativeData.Problem_Causes__c) && (
                                <p className="mt-16 t-body">
                                    {initiativeData.Problem_Causes__c}
                                </p>
                            )}
                        </SectionWrapper>
                    )}
                    {/* Our vision */}
                    {initiativeData.Ultimate_Outcome__c && (
                        <SectionWrapper className="mt-32 bg-white rounded-8">
                            <div className="flex justify-between">
                                <h2 className="t-h3">
                                    {labelTodo('Our vision')}
                                </h2>
                                <Button variant="secondary">
                                    {labelTodo('Update')}
                                </Button>
                            </div>

                            <p className="mt-16 t-body">
                                {initiativeData.Ultimate_Outcome__c}
                            </p>
                        </SectionWrapper>
                    )}
                    {/* Organisational focus */}
                    {initiativeData.Why_Problem_Solving__c && (
                        <SectionWrapper className="mt-32 bg-white rounded-8">
                            <div className="flex justify-between">
                                <h2 className="t-h3">
                                    {labelTodo('Organisational focus')}
                                </h2>
                                <Button variant="secondary">
                                    {labelTodo('Update')}
                                </Button>
                            </div>

                            <p className="mt-16 t-body">
                                {initiativeData.Why_Problem_Solving__c}
                            </p>
                        </SectionWrapper>
                    )}
                    {/* The problem to be solved */}
                    {initiativeData.Situation_Today__c && (
                        <SectionWrapper className="mt-32 bg-white rounded-8">
                            <div className="flex justify-between">
                                <h2 className="t-h3">
                                    {labelTodo('The problem to be solved')}
                                </h2>
                                <Button variant="secondary">
                                    {labelTodo('Update')}
                                </Button>
                            </div>

                            <p className="mt-16 t-body">
                                {initiativeData.Situation_Today__c}
                            </p>
                        </SectionWrapper>
                    )}
                    {/* Reason for approach */}
                    {initiativeData.Approach_Thinking__c && (
                        <SectionWrapper className="mt-32 bg-white rounded-8">
                            <div className="flex justify-between">
                                <h2 className="t-h3">
                                    {labelTodo('Reason for approach')}
                                </h2>
                                <Button variant="secondary">
                                    {labelTodo('Update')}
                                </Button>
                            </div>

                            <p className="mt-16 t-body">
                                {initiativeData.Approach_Thinking__c}
                            </p>
                        </SectionWrapper>
                    )}
                </>
            )}
        </>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

ProjectComponent.propTypes = {
    pageProps: t.object,
};

ProjectComponent.defaultProps = {
    pageProps: {},
};

ProjectComponent.layout = 'initiative';

export default ProjectComponent;
