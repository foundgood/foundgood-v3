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
        <div className="flex flex-row flex-wrap items-center justify-end bg-teal-20 page-px">
            <p className="pt-12 pb-0 mr-auto lg:mr-24 t-small text-teal-60 line-clamp-2 sm:pb-12">
                <span className="mr-4 font-bold">
                    {labelTodo('6 more sections') + ''}
                </span>
                <span>{labelTodo('needed before you can submit')}</span>
            </p>
            <div className="flex items-center self-end py-12 pl-24 ml-auto space-x-12">
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
                <Button theme="teal">{labelTodo('Run wizard')}</Button>
            </div>
        </div>
    );
};

WizardStatusComponent.propTypes = {};

WizardStatusComponent.defaultProps = {};

export default WizardStatusComponent;
