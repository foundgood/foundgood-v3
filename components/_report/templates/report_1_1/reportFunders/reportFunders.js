// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { asId, getPermissionRules } from 'utilities';
import { useLabels } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import UpdateButton from 'components/updateButton';
import DividerLine from 'components/_initiative/dividerLine';
import ReportDetailCard from 'components/_initiative/reportDetailCard';

const ReportFundersComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label } = useLabels();

    const [funders, setFunders] = useState([]);

    const [donutData, setDonutData] = useState();
    const [pieChartStyle, setPieChartStyle] = useState({});
    const [totalAmount, setTotalAmount] = useState();
    const [currency, setCurrency] = useState();

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
        // Make sure we have funders & collaborators
        // Overview details + Funders numbers
        if (Object.values(initiative._funders).length > 0) {
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

            const donutData = Object.values(initiative._funders).map(
                (funder, index) => {
                    return {
                        color: donutColors[index],
                        hex: donutHex[index],
                        name: funder.Account__r?.Name,
                        currency: funder.CurrencyIsoCode,
                        amount: funder.Amount__c,
                        totalAmount: totalAmount,
                        percentage: funder.Amount__c / totalAmount,
                    };
                }
            );
            setDonutData(donutData);

            if (donutData.length > 1) {
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
            } else {
                setPieChartStyle({ backgroundColor: donutData[0].hex });
            }

            // Make sure we have Report Details
            if (Object.values(initiative._reportDetails).length > 0) {
                // Get list of funders
                const funders = Object.values(initiative._reportDetails)
                    .filter(item => {
                        return item.Type__c ==
                            constants.REPORT_DETAILS.FUNDER_OVERVIEW
                            ? true
                            : false;
                    })
                    .map(item => {
                        // Get funder based on key
                        let funder = null;
                        // Report reflection
                        const reflection =
                            item.Description__c ===
                            constants.CUSTOM.NO_REFLECTIONS
                                ? null
                                : item.Description__c;

                        if (reflection) {
                            funder = {
                                ...initiative._funders[
                                    item.Initiative_Funder__c
                                ],
                                reportReflection: reflection,
                            };
                        }

                        return funder;
                    })
                    .filter(item => item);
                setFunders(funders);
            } else {
                setFunders([]);
            }
        }
    }, [initiative, report.Id]);

    return (
        <SectionWrapper id={asId(label('ReportWizardMenuFunders'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label('ReportViewSubHeadingFundersOverall')}
                    </h3>
                    <UpdateButton
                        {...{
                            context: 'report',
                            baseUrl: 'funders',
                            rules: getPermissionRules(
                                'report',
                                'funders',
                                'update'
                            ),
                        }}
                    />
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
                                    {label('InitiativeViewTotalFunded')}
                                </p>
                                <p className="t-h6">
                                    {currency}{' '}
                                    {totalAmount?.toLocaleString('de-DE')}
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
                        {donutData.map((item, index) => (
                            <div
                                key={`d-${index}`}
                                className="flex mt-8 t-caption">
                                <span
                                    className={`w-16 h-16 mr-8 rounded-2 ${item.color}`}></span>
                                {`${item.name} - ${
                                    item.currency
                                } ${item.amount?.toLocaleString('de-DE')}`}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Empty state - No funders */}
            {!donutData && <SectionEmpty type="report" />}
            {/* List of funders */}
            {funders?.length > 0 ? (
                funders?.map((item, index) => (
                    <div key={`f-${index}`}>
                        <SectionWrapper>
                            <ReportDetailCard
                                headline={item.Account__r?.Name}
                                image="" // Funders don't have logo/image
                                description="" // Funders don't have a description
                                items={[
                                    {
                                        label: label(
                                            'InitiativeViewFunderTableColumnHeadersAmount'
                                        ),
                                        text: `${
                                            item.CurrencyIsoCode
                                        } ${item.Amount__c?.toLocaleString(
                                            'de-DE'
                                        )}`,
                                    },
                                    {
                                        label: label(
                                            'InitiativeViewFunderTableColumnHeadersApplicationId'
                                        ),
                                        text: item.Application_Id__c,
                                    },
                                ]}
                            />
                        </SectionWrapper>
                        <SectionWrapper className="bg-blue-10 rounded-8">
                            <>
                                <div className="t-h5">
                                    {label(
                                        'ReportViewSubHeadingFundersReflections'
                                    )}
                                </div>
                                <p className="mt-8 t-body">
                                    {item.reportReflection}
                                </p>
                            </>
                        </SectionWrapper>

                        {index < funders.length - 1 && <DividerLine />}
                    </div>
                ))
            ) : (
                <SectionEmpty type="noReflections" />
            )}
        </SectionWrapper>
    );
};

ReportFundersComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportFundersComponent.defaultProps = {};

export default ReportFundersComponent;
