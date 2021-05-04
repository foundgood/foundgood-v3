// React
import React from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import t from 'prop-types';

// Utilities
import { useAuth, useMetadata } from 'utilities/hooks';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';

const PlanningComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    return (
        <>
            <TitlePreamble
                title={labelTodo('Planning')}
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

PlanningComponent.propTypes = {
    pageProps: t.object,
};

PlanningComponent.defaultProps = {
    pageProps: {},
};

PlanningComponent.layout = 'wizard';

export default PlanningComponent;
