// React
import React from 'react';

// Packages
import t from 'prop-types';
import cc from 'classcat';

const TitlePreambleComponent = ({ title, preamble, preload }) => {
    return (
        <>
            <div
                className={cc([
                    'flex flex-col mb-32 transition-slow bg-clip-text transition-slow bg-gradient-to-r from-teal-80 to-teal-10',
                    {
                        'opacity-80 text-transparent title-preamble-preload-animate': preload,
                        'opacity-100 text-teal-100': !preload,
                    },
                ])}>
                <h2 className="t-h2">{title}</h2>
                {preamble && <p className="mt-16 t-preamble">{preamble}</p>}
            </div>
        </>
    );
};

TitlePreambleComponent.propTypes = {
    title: t.string,
    preamble: t.string,
    preload: t.bool,
};

TitlePreambleComponent.defaultProps = {
    preload: false,
};

export default TitlePreambleComponent;
