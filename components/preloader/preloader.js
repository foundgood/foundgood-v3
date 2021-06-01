// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Components
// import SectionWrapper from 'components/sectionWrapper';

// Icons
import FGLogo from 'assets/images/fg-logo-mark.svg';

const PreloaderComponent = ({ hasBg = false, className }) => {
    // const elementClassNames = cc([
    //     { 'px-16 md:px-32': !paddingY },
    //     {
    //         'p-16 md:px-32 md:pt-32 md:pb-24': paddingY,
    //         'offset-anchor': id,
    //     },
    //     className,
    // ]);
    return (
        <div
            className={cc([
                'flex flex-col items-center pt-76 pb-96 rounded-8',
                { 'bg-white': hasBg },
            ])}>
            <FGLogo className="fill-current animate-preloader-colors" />
        </div>
    );
};

PreloaderComponent.propTypes = {};

PreloaderComponent.defaultProps = {};

export default PreloaderComponent;
