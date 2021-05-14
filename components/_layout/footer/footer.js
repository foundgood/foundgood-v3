// React
import React from 'react';

// Packages
import t from 'prop-types';

// Images
import FGLogo from 'assets/images/fg-logo-mark.svg';

const FooterComponent = () => {
    return (
        <div className="flex flex-col items-center pt-76 pb-96">
            <FGLogo className="fill-current" />
            <span className="mt-8 t-sh7 text-blue-70">Made with Foundgood</span>
        </div>
    );
};

FooterComponent.propTypes = {};

FooterComponent.defaultProps = {};

export default FooterComponent;
