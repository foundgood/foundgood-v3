// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';

// Icon
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const WizardStatusComponent = () => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    return (
        <div className="flex flex-col py-12 md:items-center md:justify-end md:flex-row bg-teal-20 page-px">
            <p className="mb-12 mr-12 lg:mr-24 t-small text-teal-60 md:flex md:mb-0 line-clamp-2">
                {labelTodo('6 more sections needed before you can submit')}
            </p>
            <div className="flex items-center self-end space-x-12">
                <Button
                    theme="teal"
                    variant="secondary"
                    icon={FiChevronLeft}
                    iconPosition="center"
                    iconType="stroke"
                />
                <Button
                    theme="teal"
                    variant="secondary"
                    icon={FiChevronRight}
                    iconPosition="center"
                    iconType="stroke"
                />
                <Button
                    theme="teal"
                    icon={FiChevronRight}
                    iconPosition="right"
                    iconType="stroke">
                    {labelTodo('Wizard')}
                </Button>
            </div>
        </div>
    );
};

WizardStatusComponent.propTypes = {};

WizardStatusComponent.defaultProps = {};

export default WizardStatusComponent;