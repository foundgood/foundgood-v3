// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';

// Utilities
import { useMetadata, useAuth, useResponsive } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import NumberCard from 'components/_report/numberCard';

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
    const [isMobile, setIsMobile] = useState();

    // Effect: Listen to breakpoint and toggle menu accordingly
    const largeBps = ['lg', 'xl', '2xl', '3xl'];

    // Data manipulation
    const [developmentGoals, setDevelopmentGoals] = useState();

    useEffect(() => {
        if (largeBps.includes(bp)) {
            setIsMobile(false);
        } else {
            setIsMobile(true);
        }
    }, [bp]);

    useEffect(() => {
        console.log(
            'initiative: ',
            initiative,
            initiative._collaborators.length
        );
        const goalAmounts = initiative.Problem_Effect__c?.split(';');
        const goalTitles = initiative.Translated_Problem_Effect__c?.split(';');
        const developmentGoals = goalTitles.map((title, index) => {
            return { title: title, amount: goalAmounts[index] };
        });
        setDevelopmentGoals(developmentGoals);
    }, [initiative]);

    return (
        <>
            <h1 className="t-h1">{labelTodo('Project details')}</h1>

            {/* Overview */}
            <div className="p-20 mt-48 bg-white rounded-8 lg:my-24 lg:p-52 3xl:p-124">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Overview')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>

                <div className="mt-24 lg:flex">
                    {!isMobile && (
                        <div className="w-1/2 overflow-hidden rounded-8 lg:mr-24">
                            <div className="relative w-full h-full">
                                {initiative.Hero_Image_URL__c && (
                                    <Image
                                        // src="/images/fg-landscape-1.jpg"
                                        src={initiative.Hero_Image_URL__c}
                                        layout="fill"
                                        objectFit="cover"
                                        sizes="50vw"
                                    />
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col lg:w-1/2 lg:ml-24">
                        <p className="t-preamble">{initiative.Summary__c}</p>
                        <div className="mt-48 lg:mt-32 lg:flex lg:items-start">
                            <div className="p-16 mb-20 border-4 lg:mr-12 lg:w-1/2 border-gray-10 rounded-8">
                                <h4 className="t-sh6 text-blue-60">
                                    {labelTodo('Grant giving area')}
                                </h4>
                                <h3 className="t-h5">
                                    {labelTodo('Humanitarian')}
                                </h3>

                                <h4 className="mt-16 t-sh6 text-blue-60">
                                    {labelTodo('Novo Nordisk Foundation theme')}
                                </h4>
                                <h3 className="t-h5">
                                    {labelTodo(
                                        'Responding to acute humanitarian crises'
                                    )}
                                </h3>
                            </div>

                            <div className="p-16 border-4 lg:ml-12 lg:w-1/2 border-gray-10 rounded-8">
                                <h4 className="t-sh6 text-blue-60">
                                    {labelTodo('Initiative location')}
                                </h4>
                                <h3 className="t-h5">
                                    {initiative.Translated_Where_Is_Problem__c?.split(
                                        ';'
                                    ).join(', ')}
                                </h3>

                                <h4 className="mt-16 t-sh6 text-blue-60">
                                    {labelTodo('Sustainable development goals')}
                                </h4>
                                <div className="flex flex-col">
                                    {developmentGoals &&
                                        developmentGoals.map(
                                            (problem, index) => (
                                                <h3
                                                    key={`g-${index}`}
                                                    className="mt-8 t-h5">
                                                    <span className="px-6 pt-4 mr-4 leading-none text-white bg-teal-300 rounded-4">
                                                        {problem.amount}
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
            </div>

            <div className="pb-48">
                {/* Funding */}
                <div className="p-20 mt-48 bg-white rounded-8 lg:my-24 lg:p-52 3xl:p-124">
                    <div className="flex justify-between">
                        <h2 className="t-h3">{labelTodo('Funding')}</h2>
                        <Button variant="secondary">
                            {labelTodo('Update')}
                        </Button>
                    </div>

                    <div className="mt-32">
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
                        {initiative &&
                            initiative._funders.length &&
                            initiative._funders.map((item, index) => (
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
                                        {item.CurrencyIsoCode} {item.Amount__c}
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
                            ))}
                    </div>
                </div>
                {/* Collaborators */}
                <div className="p-20 mt-48 bg-white rounded-8 lg:my-24 lg:p-52 3xl:p-124">
                    <div className="flex justify-between">
                        <h2 className="t-h3">{labelTodo('Collaborators')}</h2>
                        <Button variant="secondary">
                            {labelTodo('Update')}
                        </Button>
                    </div>
                    {initiative &&
                        initiative._collaborators.length &&
                        initiative._collaborators.map((item, index) => (
                            <div key={`c-${index}`} className="mt-32">
                                <h4 className="t-h5">
                                    {item.Translated_Type__c}
                                </h4>
                                <h3 className="flex items-center leading-none t-h4">
                                    <div className="relative w-32 h-32 mr-8 overflow-hidden rounded-8">
                                        {/* TODO - Where does image come from? */}
                                        <Image
                                            src="/images/fg-landscape-1.jpg"
                                            layout="fill"
                                            objectFit="cover"
                                            sizes="64px"
                                        />
                                    </div>
                                    {item.Translated_Type__c.Name}
                                </h3>
                                <p className="mt-16 t-sh5 text-blue-60">
                                    {/* Only display year, not full date */}
                                    {item.Start_Date__c.substring(0, 4)}
                                    {' - '}
                                    {item.End_Date__c.substring(0, 4)}
                                </p>
                                <p className="mt-16 t-body">
                                    {item.Description__c}
                                </p>
                            </div>
                        ))}
                </div>
                {/* Employees funded */}
                <div className="p-20 mt-48 bg-white rounded-8 lg:my-24 lg:p-52 3xl:p-124">
                    <div className="flex justify-between">
                        <h2 className="t-h3">
                            {labelTodo('Employees funded')}
                        </h2>
                        <Button variant="secondary">
                            {labelTodo('Update')}
                        </Button>
                    </div>

                    <div className="inline-grid w-full grid-cols-2 gap-16 mt-16 md:grid-cols-4 xl:grid-cols-4">
                        <NumberCard
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
                        />
                    </div>
                    <div className="mt-32">
                        {/* Table header */}
                        <div className="flex pb-8 border-b-2 border-amber-10">
                            <div className="w-full t-footnote-bold">
                                {labelTodo('Title')}
                            </div>
                            <div className="w-full t-footnote-bold">
                                {labelTodo('Role')}
                            </div>
                            {!isMobile && (
                                <div className="w-full t-footnote-bold">
                                    {labelTodo('Utilisation')}
                                </div>
                            )}
                        </div>
                        {/* Table Rows */}
                        <div className="flex pt-16 pb-16 border-b-2 border-amber-10">
                            <div className="w-full t-h6">
                                {labelTodo('Ethnographic researcher')}
                            </div>
                            <div className="w-full">
                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                    {labelTodo('Researcher')}
                                </span>
                            </div>
                            {!isMobile && (
                                <div className="w-full t-caption">
                                    {labelTodo('100%')}
                                </div>
                            )}
                        </div>

                        <div className="flex pt-16 pb-16 border-b-2 border-amber-10">
                            <div className="w-full t-h6">
                                {labelTodo('Project manager')}
                            </div>
                            <div className="w-full">
                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                    {labelTodo('Project manager')}
                                </span>
                            </div>
                            {!isMobile && (
                                <div className="w-full t-caption">
                                    {labelTodo('100%')}
                                </div>
                            )}
                        </div>

                        <div className="flex pt-16 pb-16 border-b-2 border-amber-10">
                            <div className="w-full t-h6">
                                {labelTodo('Conference organizer')}
                            </div>
                            <div className="w-full">
                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                    {labelTodo('Administrative staff')}
                                </span>
                            </div>
                            {!isMobile && (
                                <div className="w-full t-caption">
                                    {labelTodo('100%')}
                                </div>
                            )}
                        </div>

                        <div className="flex pt-16 pb-16 border-b-2 border-amber-10">
                            <div className="w-full t-h6">
                                {labelTodo('System Administrator')}
                            </div>
                            <div className="w-full">
                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                    {labelTodo('Technical staff')}
                                </span>
                            </div>
                            {!isMobile && (
                                <div className="w-full t-caption">
                                    {labelTodo('100%')}
                                </div>
                            )}
                        </div>

                        {/* TODO Last item no border */}
                        <div className="flex pt-16 pb-16">
                            <div className="w-full t-h6">
                                {labelTodo('Social media manager')}
                            </div>
                            <div className="w-full">
                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                    {labelTodo('Other')}
                                </span>
                            </div>
                            {!isMobile && (
                                <div className="w-full t-caption">
                                    {labelTodo('100%')}
                                </div>
                            )}
                        </div>
                    </div>
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

ProjectComponent.propTypes = {
    pageProps: t.object,
};

ProjectComponent.defaultProps = {
    pageProps: {},
};

ProjectComponent.layout = 'initiative';

export default ProjectComponent;
