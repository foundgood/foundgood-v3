// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';

// Utilities
import { useSalesForce, useMetadata, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import SectionWrapper from 'components/sectionWrapper';
import Footer from 'components/_layout/footer';
import ReportRow from 'components/_report/reportRow';

const HomeComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn, logout } = useAuth();
    verifyLoggedIn();

    // Reset initiative data
    const { reset } = useInitiativeDataStore();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    const { sfQuery, queries } = useSalesForce();
    const { data, error } = sfQuery(queries.getObjectList.account());

    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        reset();
    }, []);

    useEffect(() => {
        // Update search!
    }, [searchValue]);

    return (
        <div
            className={cc([
                'bg-amber-10 absolute min-h-full flex justify-center left-0 right-0',
            ])}>
            {/* Content */}
            <div className="w-full max-w-[900px] page-mx mt-80 md:mt-120 pb-64 lg:pb-96 rounded-8">
                <SectionWrapper>
                    <h2 className="t-h3">{labelTodo('Your reports')}</h2>
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
                        initiativeId="a0p1x00000EkTIwAAN"
                        reportId="a101x000002pIiFAAU"
                        type="Humanitarian"
                        headline="Example initiative title"
                        funder="Ole Kirk´s, Leo Foundation" // Funder vs Collaborator ???
                        leadFunder="Novo Nordisk Fonden" // Funder vs Collaborator ???
                        status="In progress"
                        dueDate="17-05-2021"
                    />

                    {/* 
                    <ReportRow
                        initiativeId="a0p1x00000Eh8COAAZ"
                        reportId="a101x000002pIi5AAE"
                        type="Humanitarian"
                        funder="Ole Kirk´s, Leo Foundation" // Funder vs Collaborator ???
                        headline="Example initiative title"
                        leadFunder="Novo Nordisk Fonden" // Funder vs Collaborator ???
                        status="In progress"
                        dueDate="17-05-2021"
                    />
                    */}
                </SectionWrapper>
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
