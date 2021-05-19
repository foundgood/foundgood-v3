// React
import React from 'react';

// Packages
import t from 'prop-types';

const DividerLineComponent = ({ number, headline, description }) => {
    return (
        <div className="my-16 md:my-32">
            <div className="h-4 bg-blue-10"></div>
        </div>
    );
};

DividerLineComponent.propTypes = {};

DividerLineComponent.defaultProps = {};

export default DividerLineComponent;
