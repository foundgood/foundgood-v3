// React
import React from 'react';

// Packages
import Image from 'next/image';
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';

// Components

const ReportComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    return (
        <>
            {/* Header */}
            <div className="p-32 md:px-64 xl:px-128">
                <div className="w-64 h-64 overflow-hidden rounded-4">
                    <Image
                        src="/images/fg-card-square-1.png"
                        width="64"
                        height="64"></Image>
                </div>
                <div className="mt-16">{labelTodo('SOS Børnebyerne')}</div>

                <div className="mt-48 t-h1">
                    {labelTodo(
                        'Coastal Hazard Wheel – Global coastal disaster prevention & recovery project'
                    )}
                </div>
                <div className="mt-16 t-sh2">
                    {labelTodo('Annual report 2021')}
                </div>
                <div className="flex mt-16 t-caption text-blue-60">
                    {labelTodo('NN123456789AAS')}
                    <div className="mx-4">•</div>
                    {labelTodo('In progress')}
                </div>
            </div>
            {/* Overview */}
            <div className="p-16 md:p-32 xl:px-64">
                <div className="p-16 md:pb-32 md:px-32 xl:px-64">
                    <h2 className="t-h4">{labelTodo('Overview')}</h2>
                    <h3 className="mt-24 t-preamble">
                        {labelTodo(
                            'This initiative is here to help people. We’ve created it because we care about a and it fits very well with the foundations strategic aims. It really is great read on and you’ll find out all about it'
                        )}
                    </h3>
                </div>
                {/* Information cards */}
                {/* <div className="flex flex-col items-start md:flex-row"> */}
                <div className="inline-grid items-start w-full grid-cols-1 md:grid-cols-2 md:gap-24">
                    <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                        <div className="t-sh6 text-blue-60">
                            {labelTodo('Grant giving area')}
                        </div>
                        <h3 className="t-h5">{labelTodo('Humanitarian')}</h3>
                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Novo Nordisk Foundation theme')}
                        </div>
                        <h3 className="t-h5">
                            {labelTodo(
                                'Responding to acute humanitarian crises'
                            )}
                        </h3>
                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Additional goals')}
                        </div>
                        <h3 className="t-h5">
                            {labelTodo(
                                'Exercitation veniam amet consequat sunt nostrud '
                            )}
                        </h3>
                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Sustainable development goals')}
                        </div>
                        <h3 className="t-h5">
                            <span className="px-6 pt-4 mr-4 leading-none text-white bg-teal-300 rounded-4">
                                {labelTodo('6')}
                            </span>
                            {labelTodo('Clean water and sanitation')}
                        </h3>
                    </div>
                    <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                        <div className="t-sh6 text-blue-60">
                            {labelTodo('Grant start and end date')}
                        </div>
                        <h3 className="t-h5">
                            {labelTodo('July 7 2020 – July 6 2021')}
                        </h3>
                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Initiative location')}
                        </div>
                        <h3 className="t-h5">
                            {labelTodo('Uganda & Denmark')}
                        </h3>
                    </div>
                    <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                        <div className="t-sh6 text-blue-60">
                            {labelTodo('Co-funders')}
                        </div>
                        <div className="">
                            <h3 className="t-h5">
                                {labelTodo('Leo Foundation')}
                            </h3>
                            <h3 className="t-h5">
                                {labelTodo('Ole Kirk’s Fond')}
                            </h3>
                        </div>

                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Co-applicants')}
                        </div>
                        <h3 className="t-h5">
                            {labelTodo(
                                'Elsewhere, Remotely, FoundAid, Robinson, Studion'
                            )}
                        </h3>
                    </div>
                    <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                        <div className="t-sh6 text-blue-60">
                            {labelTodo(
                                'Amount granted by Novo Nordisk Foundation'
                            )}
                        </div>
                        <h3 className="t-h5">{labelTodo('DKK 15.000.000')}</h3>

                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Share of total funding')}
                        </div>
                        <h3 className="t-h5">{labelTodo('67%')}</h3>
                    </div>
                </div>
            </div>

            {/* Key changes */}
            {/* <div className="p-32 md:px-64 xl:px-128">
                <h2 className="t-h3">{labelTodo('Key changes')}</h2>
                <h3 className="mt-32 t-h4">{labelTodo('Funding breakdown')}</h3>
            </div> */}

            {/* Funders */}
            <div className="p-16 md:pb-32 md:px-32 xl:px-64">
                <div className="p-16 md:pb-32 md:px-32 xl:px-64">
                    <h3 className="t-h4">{labelTodo('Funders')}</h3>
                </div>

                {/* Donut chart */}
                <div className="flex items-center p-16 border-4 rounded-8 border-amber-10">
                    {/* Pie chart */}
                    <div className="w-1/2 t-h1">
                        <h1>🍩 CHART</h1>
                    </div>
                    <div className="w-1/2">
                        {/* Headline */}
                        <div className="t-caption-bold">
                            Funders and contributions overall
                        </div>
                        {/* List of funders */}
                        <div className="flex mt-8 t-caption">
                            <span className="w-16 h-16 mr-8 bg-blue-60 rounded-2"></span>
                            Novo Nordisk Foundation – DKK 1.000.000
                        </div>
                        <div className="flex mt-8 t-caption">
                            <span className="w-16 h-16 mr-8 bg-amber-60 rounded-2"></span>
                            Novo Nordisk Foundation – DKK 1.000.000
                        </div>
                        <div className="flex mt-8 t-caption">
                            <span className="w-16 h-16 mr-8 bg-coral-60 rounded-2"></span>
                            Co-funder name – DKK 250.000
                        </div>
                        <div className="flex mt-8 t-caption">
                            <span className="w-16 h-16 mr-8 bg-teal-60 rounded-2"></span>
                            Additional funder name – DKK 250.000
                        </div>
                    </div>
                </div>

                {/* List of funders */}
                <>
                    <div className="p-16 mt-48 md:pb-32 md:px-32 xl:px-64">
                        <div className="flex justify-between">
                            <div className="mr-24">
                                <div className="flex">
                                    <div className="h-24 mr-8 overflow-hidden rounded-4">
                                        <Image
                                            src="/images/fg-card-square-1.png"
                                            width="24"
                                            height="24"
                                        />
                                    </div>
                                    <div>Co-funder name</div>
                                </div>

                                <p className="mt-16">
                                    Physiological respiration involves the
                                    mechanisms that ensure that the composition
                                    of the functional residual capacity is kept
                                    constant.
                                </p>
                            </div>

                            <div className="flex flex-col flex-none">
                                <div className="p-16 mt-8 border-4 border-blue-10 rounded-4">
                                    <div className="t-sh7">Amount</div>
                                    <div className="t-caption-bold">
                                        DKK 500.000
                                    </div>
                                </div>
                                <div className="p-16 mt-8 border-4 border-blue-10 rounded-4">
                                    <div className="t-sh7">Approval date</div>
                                    <div className="t-caption-bold">
                                        June 15th 2020
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-16 md:pb-32 md:px-32 xl:px-64 bg-blue-10 rounded-8">
                        <div className="t-h5">Updates from this year</div>
                        <p className="mt-8 t-body">
                            In the eighteenth century the German philosopher
                            Immanuel Kant developed a theory of knowledge in
                            which knowledge about space can be both a priori and
                            synthetic. According to Kant, knowledge about space
                            is synthetic, in that statements about space are not
                            simply true by virtue of the meaning of the words in
                            the statement.
                        </p>
                    </div>
                </>
            </div>

            {/* List of funders */}
            <div className="p-16 md:pb-32 md:px-32 xl:px-64">
                <h2 className="t-h3">{labelTodo('Co-funder name')}</h2>
                <div className="flex items-center p-16 md:p-32 xl:p-64 rounded-8 bg-amber-10">
                    <h2 className="t-h3">
                        {labelTodo('Updates from this year')}
                    </h2>
                </div>
            </div>

            {/* Report Summary */}
            <div className="p-16 md:p-32 xl:px-64">
                <div className="p-16 md:pb-32 md:px-32 xl:px-64">
                    <h2 className="t-h4">{labelTodo('Report summary')}</h2>
                </div>
                <div className="p-16 md:p-32 xl:p-64 bg-blue-10 rounded-8">
                    <h2 className="t-h5">{labelTodo('Overall performance')}</h2>
                    <p className="mt-16 t-body">
                        {labelTodo(
                            'Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant, and equilibrates with the gases dissolved in the pulmonary capillary blood, and thus throughout the body. Thus, in precise usage, the words breathing and ventilation are hyponyms, not synonyms, of respiration; but this prescription is not consistently followed, even by most health care providers, because the term respiratory rate (RR) is a well-established term in health care, even though it would need to be consistently replaced with ventilation rate if the precise usage were to be followed.'
                        )}
                    </p>
                    <h2 className="mt-32 t-h5">
                        {labelTodo('Challanges & learnings')}
                    </h2>
                    <p className="mt-16 t-body">
                        {labelTodo(
                            'Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant, and equilibrates with the gases dissolved in the pulmonary capillary blood, and thus throughout the body. Thus, in precise usage, the words breathing and ventilation are hyponyms, not synonyms, of respiration; but this prescription is not consistently followed, even by most health care providers, because the term respiratory rate (RR) is a well-established term in health care, even though it would need to be consistently replaced with ventilation rate if the precise usage were to be followed.'
                        )}
                    </p>
                </div>
            </div>

            {/* Containers - versions */}
            <div className="p-16 md:pb-32 md:px-32 xl:px-64 bg-blue-40">
                <h2 className="t-h5">{labelTodo('To edge container')}</h2>
            </div>
            <div className="p-32 md:px-64 xl:px-128 bg-amber-40">
                <h2 className="t-h5">{labelTodo('Indented container')}</h2>
            </div>

            <div className="p-16 md:pb-32 md:px-32 xl:px-64 bg-coral-40">
                <h2 className="t-h5">{labelTodo('To edge content')}</h2>
                <div className="p-16 md:pb-32 md:px-32 xl:px-64 bg-coral-20">
                    <h2 className="t-h5">{labelTodo('Indented content')}</h2>
                </div>
            </div>
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
