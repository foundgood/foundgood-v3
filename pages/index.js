// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';

// Utilities
import { useSalesForce, useMetadata, useAuth } from 'utilities/hooks';

// Components
import Button from 'components/button';
import SectionWrapper from 'components/sectionWrapper';
import Footer from 'components/_layout/footer';
import ReportRow from 'components/_report/reportRow';

// Icons
import { FiFileText } from 'react-icons/fi';

const HomeComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn, logout } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    const { sfQuery, queries } = useSalesForce();
    const { data, error } = sfQuery(queries.getObjectList.account());

    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        // Update search!
    }, [searchValue]);

    return (
        <div
            className={cc([
                'bg-amber-10 absolute flex justify-center left-0 right-0',
            ])}>
            {/* Content */}
            <div className="w-full max-w-[900px] page-mx mt-80 md:mt-120 pb-64 lg:pb-96 rounded-8">
                <SectionWrapper>
                    <div className="flex justify-between">
                        <h2 className="t-h3">
                            {labelTodo('Your initiatives')}
                        </h2>
                        <Button variant="secondary" theme="teal">
                            {labelTodo('Create initiative')}
                        </Button>
                    </div>
                    <input
                        type="text"
                        placeholder={labelTodo(
                            'Search by initiative name or application ID'
                        )}
                        onChange={event => {
                            // Local value state
                            setSearchValue(event.target.value);
                        }}
                        className="input-search"
                    />
                    {/* TODO - Search filters - Dropdowns or custom multiselects ? */}
                </SectionWrapper>

                <SectionWrapper>
                    <ReportRow
                        type="Annual report"
                        funder="UNHCR, The UN Refugee Agency" // Funder vs Collaborator ???
                        headline="Displayment crisis in Tigray, Ethiopia"
                        leadFunder="Novo Nordisk Foundation" // Funder vs Collaborator ???
                        reportId="NN123456789AAS"
                        status="In progress"
                        deadline="17-05-2021"
                    />

                    <ReportRow
                        type="Annual report"
                        funder="UNHCR, The UN Refugee Agency" // Funder vs Collaborator ???
                        headline="Displayment crisis in Tigray, Ethiopia"
                        leadFunder="Novo Nordisk Foundation" // Funder vs Collaborator ???
                        reportId="NN123456789AAS"
                        status="In progress"
                        deadline="17-05-2021"
                    />

                    <ReportRow
                        type="Annual report"
                        funder="UNHCR, The UN Refugee Agency" // Funder vs Collaborator ???
                        headline="Displayment crisis in Tigray, Ethiopia"
                        leadFunder="Novo Nordisk Foundation" // Funder vs Collaborator ???
                        reportId="NN123456789AAS"
                        status="In progress"
                        deadline="17-05-2021"
                    />
                </SectionWrapper>

                {/* <div className="t-h1">
                    <Link href="/wizard">Foundgood,</Link>
                    <Button theme="amber" action={() => logout()}>
                        Logout
                    </Button>
                    <div className="flex flex-col w-full px-32 mt-32">
                        <h1 className="t-h3">
                            Data from the server (only after login)
                        </h1>
                        {data?.records?.length > 0 &&
                            data?.records?.map(item => (
                                <p
                                    key={item.Id}
                                    className="flex justify-between t-body">
                                    <span>{item.Name}</span>
                                    <span>{item.Translated_Location__c}</span>
                                </p>
                            ))}
                    </div>
                </div> */}
                <Footer />
            </div>
        </div>
    );
};

HomeComponent.propTypes = {
    pageProps: t.object,
};

HomeComponent.defaultProps = {
    pageProps: {},
};

export default HomeComponent;
