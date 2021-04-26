// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';

// Utilities

// Components

// Images
import FGLogo from 'assets/images/fg-logo.svg';

const HeaderComponent = ({ showUserControls }) => {
    return (
        <div className="fixed flex items-center justify-between w-screen h-48 px-16 text-blue-300 bg-white z-header sm:px-24 lg:px-32 lg:h-64 sm:h-56">
            <FGLogo className="fill-current" />
            {showUserControls && <div>Room for user controls</div>}
        </div>
    );
};

HeaderComponent.propTypes = {
    showUserControls: t.bool,
};

HeaderComponent.defaultProps = {
    showUserControls: true,
};

export default HeaderComponent;
