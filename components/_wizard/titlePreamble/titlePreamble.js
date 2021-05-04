// React
import React from 'react';

// Packages
import t from 'prop-types';

const TitlePreambleComponent = ({ title, preamble }) => {
    return (
        <div className="flex flex-col mb-32 text-teal-100">
            <h2 className="t-h2">{title}</h2>
            {preamble && <p className="mt-16 t-preamble">{preamble}</p>}
        </div>
    );
};

TitlePreambleComponent.propTypes = {
    title: t.string,
    preamble: t.string,
};

TitlePreambleComponent.defaultProps = {};

export default TitlePreambleComponent;
