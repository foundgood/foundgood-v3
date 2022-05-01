// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';

const AlertMessageComponent = ({ description }) => {
    // Hook: Metadata
    const { labelTodo } = useLabels();

    return (
        <div className="inline-block px-8 pt-4 bg-amber-20 text-amber-300 rounded-4">
            {labelTodo(description)}
        </div>
    );
};

AlertMessageComponent.propTypes = {
    // Alert message
    description: t.string,
};

AlertMessageComponent.defaultProps = {};

export default AlertMessageComponent;
