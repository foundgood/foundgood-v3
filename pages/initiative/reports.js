// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';

// Components
import Button from 'components/button';
import ReportCard from 'components/_wizard/reportCard';

const ReportsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    return (
        <>
            <h1 className="t-h1">Reports</h1>
            <div className="p-16 bg-white rounded-8 lg:p-32">
                <div className="flex justify-between">
                    <h2 className="t-h3">
                        {labelTodo('Reports for Novo Nordisk Foundation')}
                    </h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>

                <div className="flex flex-wrap items-start">
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="not-started"
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="in-progress"
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="review"
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="complete"
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="not-started"
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="in-progress"
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="review"
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="complete"
                    />
                </div>
            </div>
            <div className="p-16 mt-24 bg-white rounded-8 lg:p-32">
                <div className="flex justify-between">
                    <h2 className="t-h3">
                        {labelTodo('Reports for Tuborg Foundation')}
                    </h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>

                <ReportCard
                    useBackground={false}
                    headline="Status report"
                    date="April 28th 2021"
                    status="review"
                />
            </div>
        </>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

ReportsComponent.propTypes = {
    pageProps: t.object,
};

ReportsComponent.defaultProps = {
    pageProps: {},
};

ReportsComponent.layout = 'initiative';

export default ReportsComponent;
