// React
import React from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import t from 'prop-types';

// Utilities
import { useAuth, useMetadata } from 'utilities/hooks';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';

const OverallPerformanceComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    return (
        <>
            <TitlePreamble
                title={labelTodo('Overall performance')}
                preamble={labelTodo('')}
            />
        </>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

OverallPerformanceComponent.propTypes = {
    pageProps: t.object,
};

OverallPerformanceComponent.defaultProps = {
    pageProps: {},
};

OverallPerformanceComponent.layout = 'wizard';

export default OverallPerformanceComponent;
