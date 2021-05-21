// React
import React, { useEffect, useState } from 'react';

// Packages

// Utilities
import { useMetadata, useContext } from 'utilities/hooks';

// Components
import Button from 'components/button';

// Icon
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const WizardStatusComponent = () => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // TODO - Get dynamic ids
    // /wizard/[initiativeId]/introduction/[reportId]

    // Hook: Context
    const { INITIATIVE_ID, REPORT_ID } = useContext();

    const reportId = 'a101x000002pIiFAAU';
    const initiativeId = 'a0p1x00000EkTIwAAN';
    // const url = `/wizard/${INITIATIVE_ID}/introduction/${REPORT_ID}`;
    const url = `/wizard/${initiativeId}/introduction?context=report&id=${reportId}`;

    return (
        <div className="flex flex-col py-12 md:items-center md:justify-end md:flex-row bg-teal-20 page-px">
            <p className="mb-12 mr-12 lg:mr-24 t-small text-teal-60 md:flex md:mb-0 line-clamp-2">
                <span className="mr-4 font-bold">
                    {labelTodo('6 more sections')}
                </span>
                <span>{labelTodo('needed before you can submit')}</span>
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
                <Button theme="teal" action={url}>
                    {labelTodo('Run wizard')}
                </Button>
            </div>
        </div>
    );
};

WizardStatusComponent.propTypes = {};

WizardStatusComponent.defaultProps = {};

export default WizardStatusComponent;
