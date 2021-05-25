// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useContext, useAuth } from 'utilities/hooks';

// Components

const UpdateButtonComponent = ({ mode, baseUrl }) => {
    // Hook: Context
    const { INITIATIVE_ID, REPORT_ID } = useContext();

    // Hook: Metadata
    const { label } = useMetadata();

    // Hook: Auth
    const { userInitiativeRights } = useAuth();

    // Where to go?
    const url =
        mode === 'report'
            ? `wizard/${INITIATIVE_ID}/${baseUrl}/${REPORT_ID}`
            : `wizard/${INITIATIVE_ID}/${baseUrl}`;

    return (
        <Button
            variant="secondary"
            action={url}
            disabled={!userInitiativeRights.canEdit}>
            {label('custom.FA_Update')}
        </Button>
    );
};

UpdateButtonComponent.propTypes = {
    mode: t.oneOf(['initiative', 'report']).isRequired,
    baseUrl: t.string.isRequired,
};

UpdateButtonComponent.defaultProps = {};

export default UpdateButtonComponent;
