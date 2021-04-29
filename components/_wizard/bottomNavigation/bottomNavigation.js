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

const BottomNavigationComponent = () => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    return (
        <div className="flex items-center justify-between w-full">
            <Button theme="coral" variant="secondary">
                {labelTodo('Exit')}
            </Button>
            <p
                className={cc([
                    'hidden t-footnote text-coral-60 md:flex transition-default opacity-0',
                    {
                        'opacity-100': true, // TODO Connect to store when stuff is updated
                    },
                ])}>
                {labelTodo('Your updates have been saved')}
            </p>
            <div className="flex space-x-12">
                <Button theme="coral" variant="secondary">
                    {labelTodo('Back')}
                </Button>
                <Button theme="coral">{labelTodo('Continue')}</Button>
            </div>
        </div>
    );
};

BottomNavigationComponent.propTypes = {};

BottomNavigationComponent.defaultProps = {};

export default BottomNavigationComponent;
