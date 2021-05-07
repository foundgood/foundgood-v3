// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';
import { useResponsive } from 'utilities/hooks';

// Components
import Button from 'components/button';

// Icons
import { FiGithub } from 'react-icons/fi';

const ProjectComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Hook: Get breakpoint
    const bp = useResponsive();

    // // Effect: Listen to breakpoint and toggle menu accordingly
    const largeBps = ['lg', 'xl', '2xl', '3xl'];

    return (
        <>
            <h1 className="t-h1">Project details</h1>

            {/* Overview */}
            <div className="p-20 mt-48 bg-white rounded-8 lg:my-24 lg:p-52 3xl:p-124">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Overview')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>

                <div className="mt-24 lg:flex">
                    {largeBps.includes(bp) && (
                        <div className="w-1/2 h-full overflow-hidden rounded-8 lg:mr-24">
                            <img src="/images/fg-landscape-1.jpg" />
                        </div>
                    )}
                    <div className="flex flex-col lg:w-1/2 lg:ml-24">
                        <p className="t-preamble">
                            {labelTodo(
                                'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor.'
                            )}
                        </p>
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
                                    {labelTodo('Uganda & Denmark')}
                                </h3>

                                <h4 className="mt-16 t-sh6 text-blue-60">
                                    {labelTodo('Sustainable development goals')}
                                </h4>
                                <h3 className="t-h5">
                                    <span className="px-6 pt-4 mr-4 leading-none text-white bg-teal-300 rounded-4">
                                        {labelTodo('6')}
                                    </span>
                                    {labelTodo('Clean water and sanitation')}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pb-48 lg:inline-grid lg:grid-cols-2 lg:gap-24 lg:items-start">
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
                        <div className="flex pb-8 border-b-2 border-amber-10">
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
                        <div className="flex pt-16 pb-16 border-b-2 border-amber-10">
                            <div className="w-full t-h6">
                                {labelTodo('Novo Nordisk Foundation')}
                            </div>
                            <div className="w-full">
                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                    {labelTodo('Lead funder')}
                                </span>
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('DKK 1.000.000')}
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('2021/05/30')}
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('2021/01/01 – 2021/12/31')}
                            </div>
                        </div>
                        <div className="flex pt-16 pb-16 border-b-2 border-amber-10">
                            <div className="w-full t-h6">
                                {labelTodo('Novo Nordisk Foundation')}
                            </div>
                            <div className="w-full">
                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                    {labelTodo('Lead funder')}
                                </span>
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('DKK 1.000.000')}
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('2021/05/30')}
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('2021/01/01 – 2021/12/31')}
                            </div>
                        </div>
                        <div className="flex pt-16 pb-16 border-b-2 border-amber-10">
                            <div className="w-full t-h6">
                                {labelTodo('Novo Nordisk Foundation')}
                            </div>
                            <div className="w-full">
                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                    {labelTodo('Lead funder')}
                                </span>
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('DKK 1.000.000')}
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('2021/05/30')}
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('2021/01/01 – 2021/12/31')}
                            </div>
                        </div>
                        <div className="flex pt-16 pb-16 border-b-2 border-amber-10">
                            <div className="w-full t-h6">
                                {labelTodo('Novo Nordisk Foundation')}
                            </div>
                            <div className="w-full">
                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                    {labelTodo('Lead funder')}
                                </span>
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('DKK 1.000.000')}
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('2021/05/30')}
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('2021/01/01 – 2021/12/31')}
                            </div>
                        </div>
                        <div className="flex pt-16 pb-16">
                            <div className="w-full t-h6">
                                {labelTodo('Novo Nordisk Foundation')}
                            </div>
                            <div className="w-full">
                                <span className="w-full p-8 t-h6 bg-blue-20 rounded-8">
                                    {labelTodo('Lead funder')}
                                </span>
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('DKK 1.000.000')}
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('2021/05/30')}
                            </div>
                            <div className="w-full t-caption">
                                {labelTodo('2021/01/01 – 2021/12/31')}
                            </div>
                        </div>
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
                    <div className="mt-32">
                        <h4 className="t-h5">{labelTodo('Co-applicant')}</h4>
                        {/* Todo - what format are these icons/images? */}
                        <h3 className="flex items-center leading-none t-h4">
                            <span className="p-4 mr-8 overflow-hidden bg-blue-300 rounded-8">
                                <FiGithub />
                            </span>
                            {labelTodo('Unicef')}
                        </h3>
                        <p className="mt-16 t-sh5 text-blue-60">
                            {labelTodo('2011 - 2018')}
                        </p>
                        <p className="mt-16 t-body">
                            {labelTodo(
                                'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor.'
                            )}
                        </p>
                    </div>

                    <div className="mt-32">
                        <h4 className="t-h5">{labelTodo('Co-applicant')}</h4>
                        {/* Todo - what format are these icons/images? */}
                        <h3 className="flex items-center leading-none t-h4">
                            <span className="p-4 mr-8 overflow-hidden bg-amber-300 rounded-8">
                                <FiGithub />
                            </span>
                            {labelTodo('Dansk Røde Kors')}
                        </h3>
                        <p className="mt-16 t-sh5 text-blue-60">
                            {labelTodo('2001 - 2020')}
                        </p>
                        <p className="mt-16 t-body">
                            {labelTodo(
                                'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor.'
                            )}
                        </p>
                    </div>

                    <div className="mt-32">
                        <h4 className="t-h5">{labelTodo('Co-applicant')}</h4>
                        {/* Todo - what format are these icons/images? */}
                        <h3 className="flex items-center leading-none t-h4">
                            <span className="p-4 mr-8 overflow-hidden bg-teal-300 rounded-8">
                                <FiGithub />
                            </span>
                            {labelTodo('Unicef')}
                        </h3>
                        <p className="mt-16 t-sh5 text-blue-60">
                            {labelTodo('2011 - 2018')}
                        </p>
                        <p className="mt-16 t-body">
                            {labelTodo(
                                'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor.'
                            )}
                        </p>
                    </div>
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

                    <div className="inline-grid items-start w-full grid-cols-2 gap-16 mt-16 md:grid-cols-4 xl:grid-cols-4">
                        <div className="p-16 rounded-4 bg-blue-10">
                            <div className="text-blue-100 t-h1">
                                {labelTodo('999')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('Researchers')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('67% female')}
                            </div>
                        </div>

                        <div className="p-16 rounded-4 bg-blue-10">
                            <div className="text-blue-100 t-h1">
                                {labelTodo('2')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('Researchers')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('67% female')}
                            </div>
                        </div>

                        <div className="p-16 rounded-4 bg-blue-10">
                            <div className="text-blue-100 t-h1">
                                {labelTodo('4')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('Researchers')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('67% female')}
                            </div>
                        </div>

                        <div className="p-16 rounded-4 bg-blue-10">
                            <div className="text-blue-100 t-h1">
                                {labelTodo('20')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('Researchers')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('67% female')}
                            </div>
                        </div>

                        <div className="p-16 rounded-4 bg-blue-10">
                            <div className="text-blue-100 t-h1">
                                {labelTodo('1')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('Researchers')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('67% female')}
                            </div>
                        </div>

                        <div className="p-16 rounded-4 bg-blue-10">
                            <div className="text-blue-100 t-h1">
                                {labelTodo('6')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('Researchers')}
                            </div>
                            <div className="text-blue-60 t-footnote">
                                {labelTodo('67% female')}
                            </div>
                        </div>
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
                            {largeBps.includes(bp) && (
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
                            {largeBps.includes(bp) && (
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
                            {largeBps.includes(bp) && (
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
                            {largeBps.includes(bp) && (
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
                            {largeBps.includes(bp) && (
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
                            {largeBps.includes(bp) && (
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
