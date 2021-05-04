// React
import React from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Utilities
import { useAuth, useMetadata } from 'utilities/hooks';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';

const IntroductionComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Hook: Router
    const router = useRouter();

    return (
        <>
            <TitlePreamble
                title={labelTodo('Welcome to your new initiative')}
                preamble={labelTodo(
                    'A new way to structure your project and report on your impact'
                )}
            />
            <div className="flex justify-center my-64">
                <Image
                    src="/images/new-initiative.png"
                    width="700"
                    height="374"
                />
            </div>
            <p className="t-body">
                Maxwell's equations – the foundation of classical
                electromagnetism – describe light as a wave that moves with a
                characteristic velocity. The modern view is that light needs no
                medium of transmission, but Maxwell and his contemporaries were
                convinced that light waves were propagated in a medium,
                analogous to sound propagating in air, and ripples propagating
                on the surface of a pond
            </p>
            <div className="flex justify-end w-full mt-32 space-x-12">
                <Button
                    theme="coral"
                    variant="secondary"
                    action={() => router.back()}>
                    {labelTodo('Back')}
                </Button>
                <Button
                    theme="coral"
                    action={'/wizard/initiative/information-capture'}>
                    {labelTodo('Continue')}
                </Button>
            </div>
        </>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

IntroductionComponent.propTypes = {
    pageProps: t.object,
};

IntroductionComponent.defaultProps = {
    pageProps: {},
};

IntroductionComponent.layout = 'wizardBlank';

export default IntroductionComponent;
