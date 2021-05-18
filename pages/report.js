// React
import React, { useEffect, useState } from 'react';

// Packages
import Image from 'next/image';
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';
import { isJson } from 'utilities';

// Components
import SectionWrapper from 'components/sectionWrapper';
import ReportDetailCard from 'components/_initiative/reportDetailCard';
import ReportSharingCard from 'components/_initiative/reportSharingCard';
import TextCard from 'components/_report/textCard';
import NumberCard from 'components/_initiative/numberCard';
import DividerLine from 'components/_initiative/dividerLine';
import ChartCard from 'components/_initiative/chartCard';

const ReportComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Fetch initiative data
    const { initiative } = useInitiativeDataStore();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    // Data manipulation
    const [developmentGoals, setDevelopmentGoals] = useState();
    const [initiativeData, setInitiativeData] = useState();
    const [donutData, setDonutData] = useState();
    const [pieChartStyle, setPieChartStyle] = useState({});
    const [applicants, setApplicants] = useState();
    const [collaborators, setCollaborators] = useState();

    const [coApplicants, setCoApplicants] = useState();
    const [coFunders, setCoFunders] = useState();
    const [novoFunder, setNovoFunder] = useState();

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
        const goalTitles = initiative?.Translated_Problem_Effect__c?.split(';');
        if (goalTitles && goalTitles.length > 0) {
            const developmentGoals = goalTitles.map((title, index) => {
                return { title: title, amount: goalAmounts[index] };
            });
            setDevelopmentGoals(developmentGoals);
        }

        // "Collaborators" & "Applicants" all comes from "initiative._collaborators"
        // Split them up depending on the type.
        // TYPE: "Additional collaborator" === Collaborator. All other types are Applicants
        let collaborators = Object.values(initiative._collaborators).filter(
            item => {
                return item.Translated_Type__c == 'Additional collaborator'
                    ? true
                    : false;
            }
        );
        let applicants = Object.values(initiative._collaborators).filter(
            item => {
                return item.Translated_Type__c != 'Additional collaborator'
                    ? true
                    : false;
            }
        );
        setApplicants(applicants);
        setCollaborators(collaborators);

        // 🍩 Donut data 🍩
        // Build donut slices using color gradient
        // See here: https://keithclark.co.uk/articles/single-element-pure-css-pie-charts/

        const totalAmount = Object.values(initiative._funders).reduce(
            (total, funder) => {
                return total + funder.Amount__c;
            },
            0
        );

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
                share: `${Math.round((item.Amount__c / totalAmount) * 100)}%`,
            }))[0];
        console.log(novoFunder);
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
                    {/* Header */}
                    <SectionWrapper>
                        <SectionWrapper>
                            <div className="w-64 h-64 overflow-hidden rounded-4">
                                {/* {initiativeData.Hero_Image_URL__c && (
                                    <Image
                                        src={initiativeData.Hero_Image_URL__c}
                                        width="64"
                                        height="64"></Image>
                                )} */}
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
                        {/* <div className="flex flex-col items-start md:flex-row"> */}
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
                                    {labelTodo('Missing data 🛑')}
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

                        {/* List of funders */}
                        <>
                            <SectionWrapper>
                                <ReportDetailCard
                                    headline="Co-funder name"
                                    image="/images/fg-card-square-1.png"
                                    description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                                    items={[
                                        {
                                            label: 'Amount',
                                            text: 'DKK 500.000',
                                        },
                                        {
                                            label: 'Approval date',
                                            text: 'June 15th 2020',
                                        },
                                    ]}
                                />
                            </SectionWrapper>

                            <SectionWrapper className="bg-blue-10 rounded-8">
                                <div className="t-h5">
                                    Updates from this year
                                </div>
                                <p className="mt-8 t-body">
                                    In the eighteenth century the German
                                    philosopher Immanuel Kant developed a theory
                                    of knowledge in which knowledge about space
                                    can be both a priori and synthetic.
                                    According to Kant, knowledge about space is
                                    synthetic, in that statements about space
                                    are not simply true by virtue of the meaning
                                    of the words in the statement.
                                </p>
                            </SectionWrapper>
                        </>
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
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                        />
                        <TextCard
                            hasBackground={true}
                            className="mt-32"
                            headline="Challenges & Learnings"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                        />
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Key changes */}
                    <SectionWrapper>
                        <SectionWrapper className="mt-96">
                            <h2 className="t-h3">{labelTodo('Key changes')}</h2>
                        </SectionWrapper>
                        <SectionWrapper>
                            <h3 className="t-h4">
                                {labelTodo(
                                    'New co-applicant relationships this year'
                                )}
                            </h3>
                        </SectionWrapper>

                        <SectionWrapper>
                            <ReportDetailCard
                                headline="Co-funder name"
                                image="/images/fg-card-square-1.png"
                                description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                                items={[
                                    { label: 'Amount', text: 'DKK 500.000' },
                                    {
                                        label: 'Approval date',
                                        text: 'June 15th 2020',
                                    },
                                ]}
                            />
                        </SectionWrapper>
                        <TextCard
                            hasBackground={true}
                            headline="Updates from this year"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                        />
                        <SectionWrapper>
                            <ReportDetailCard
                                headline="Co-funder name"
                                image="/images/fg-card-square-1.png"
                                description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                                items={[
                                    { label: 'Amount', text: 'DKK 500.000' },
                                    {
                                        label: 'Approval date',
                                        text: 'June 15th 2020',
                                    },
                                ]}
                            />
                        </SectionWrapper>
                        <TextCard
                            hasBackground={true}
                            headline="Updates from this year"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                        />
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Overview of collaborations */}
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="t-h4">
                                {labelTodo('Overview of collaborations')}
                            </h3>
                        </SectionWrapper>

                        <SectionWrapper>
                            <ReportDetailCard
                                headline="Co-funder name"
                                image="/images/fg-card-square-1.png"
                                description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                                items={[
                                    { label: 'Amount', text: 'DKK 500.000' },
                                    {
                                        label: 'Approval date',
                                        text: 'June 15th 2020',
                                    },
                                ]}
                            />
                        </SectionWrapper>
                        <TextCard
                            hasBackground={true}
                            headline="Updates from this year"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                        />
                        <SectionWrapper>
                            <ReportDetailCard
                                headline="Co-funder name"
                                image="/images/fg-card-square-1.png"
                                description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                                items={[
                                    { label: 'Amount', text: 'DKK 500.000' },
                                    {
                                        label: 'Approval date',
                                        text: 'June 15th 2020',
                                    },
                                ]}
                            />
                        </SectionWrapper>
                        <TextCard
                            hasBackground={true}
                            headline="Updates from this year"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                        />
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Employees funded by the grant */}
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="t-h4">
                                {labelTodo('Employees funded by the grant')}
                            </h3>
                        </SectionWrapper>

                        <div className="inline-grid w-full grid-cols-2 gap-16 mt-16 md:grid-cols-4 2xl:grid-cols-6">
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
                        </div>
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Goals */}
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="t-h4">{labelTodo('Goals')}</h3>
                        </SectionWrapper>
                        <TextCard
                            hasBackground={false}
                            className="mt-32"
                            headline="Updates from this year"
                            label="Custom"
                        />

                        <TextCard
                            hasBackground={true}
                            className="mt-32"
                            headline="Updates from this year"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                        />
                        <DividerLine />

                        <TextCard
                            hasBackground={false}
                            className="mt-32"
                            headline="Updates from this year"
                            label="Custom"
                        />

                        <TextCard
                            hasBackground={true}
                            className="mt-32"
                            headline="Updates from this year"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                        />
                        <DividerLine />

                        <TextCard
                            hasBackground={false}
                            className="mt-32"
                            headline="Updates from this year"
                            label="Custom"
                        />

                        <TextCard
                            hasBackground={true}
                            className="mt-32"
                            headline="Updates from this year"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                        />
                    </SectionWrapper>
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Activities */}
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="t-h4">{labelTodo('Activities')}</h3>
                        </SectionWrapper>

                        <SectionWrapper>
                            <ReportDetailCard
                                headline="Activity #1 name"
                                description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                                items={[
                                    {
                                        label: 'Location',
                                        text: 'Uganda, Denmark',
                                    },
                                ]}
                            />
                        </SectionWrapper>
                        <SectionWrapper>
                            <ChartCard
                                useBorder={true}
                                headline="Indicators"
                                items={[
                                    {
                                        title: 'Schools built',
                                        value: '256',
                                        label: 'Reached so far',
                                    },
                                    {
                                        title: 'Adults (24+)',
                                        value: '384',
                                        label: 'Reached so far',
                                    },
                                ]}
                            />
                        </SectionWrapper>
                        <TextCard
                            hasBackground={true}
                            className="mt-32"
                            headline="Updates from this year"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement. "
                        />
                        <DividerLine />

                        <SectionWrapper>
                            <ReportDetailCard
                                headline="Activity #2 name"
                                description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                                items={[
                                    {
                                        label: 'Location',
                                        text: 'Uganda, Denmark',
                                    },
                                ]}
                            />
                        </SectionWrapper>
                        <SectionWrapper>
                            <ChartCard
                                useBorder={true}
                                headline="Indicators"
                                items={[
                                    {
                                        title: 'Schools built',
                                        value: '12',
                                        label: 'Reached so far',
                                    },
                                    {
                                        title: 'Wells buil',
                                        value: '24',
                                        label: 'Reached so far',
                                    },
                                ]}
                            />
                        </SectionWrapper>
                        <TextCard
                            hasBackground={true}
                            className="mt-32"
                            headline="Updates from this year"
                            body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement. "
                        />
                    </SectionWrapper>
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

                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <SectionWrapper className="bg-coral-40">
                        <h2 className="t-h5">
                            {labelTodo('To edge container')}
                        </h2>
                    </SectionWrapper>
                    <SectionWrapper className="bg-teal-300">
                        <SectionWrapper>
                            <h2 className="t-h5">
                                {labelTodo('Indented container')}
                            </h2>
                        </SectionWrapper>
                    </SectionWrapper>

                    <SectionWrapper className="bg-amber-300">
                        <SectionWrapper paddingY={false}>
                            <h2 className="t-h5">
                                {labelTodo('No padding Y')}
                            </h2>
                        </SectionWrapper>
                    </SectionWrapper>
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

ReportComponent.propTypes = {
    pageProps: t.object,
};

ReportComponent.defaultProps = {
    pageProps: {},
};

ReportComponent.layout = 'report';

export default ReportComponent;
