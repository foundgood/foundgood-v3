// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import AnimateHeight from 'react-animate-height';

// Utilities
import { useContext, useLabels } from 'utilities/hooks';

// Components
import Button from 'components/button';

// Icons
import { FiTrash2, FiEdit2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const BaseCardComponent = ({ title, type, components, methods }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { CONTEXTS, MODE } = useContext();
    const { label } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [expandedContent, setExpandedContent] = useState(false);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <div
                className={cc([
                    'p-16 max-w-[600px] border-4 border-teal-20 rounded-8 text-teal-100 transition-default',
                ])}>
                {/* Content wrapper */}
                <div className="flex flex-col space-y-16">
                    {/* Top row wrapper */}
                    <div className="flex justify-between">
                        {/* Card type */}
                        <div className="t-caption-bold text-teal-60">
                            {type}
                        </div>
                        {/* Card controls */}
                        <div className="flex h-40 space-x-4">
                            {/* Delete */}
                            {methods?.delete && (
                                <Button
                                    title={label('ButtonDelete')}
                                    variant="tertiary"
                                    theme="teal"
                                    icon={FiTrash2}
                                    iconPosition="center"
                                    iconType="stroke"
                                    className="!px-8"
                                    action={methods?.delete.action}
                                />
                            )}
                            {/* Edit */}
                            {methods?.edit && (
                                <Button
                                    title={label('ButtonEdit')}
                                    variant="tertiary"
                                    theme="teal"
                                    icon={FiEdit2}
                                    iconPosition="center"
                                    iconType="stroke"
                                    className="!px-8"
                                    action={methods?.edit.action}
                                />
                            )}
                            {/* Expand */}
                            {components?.cardContent && (
                                <Button
                                    title={label('ButtonExpandCollapse')}
                                    variant="tertiary"
                                    theme="teal"
                                    icon={
                                        expandedContent
                                            ? FiChevronUp
                                            : FiChevronDown
                                    }
                                    iconPosition="center"
                                    iconType="stroke"
                                    className="!px-8"
                                    action={() =>
                                        setExpandedContent(!expandedContent)
                                    }
                                />
                            )}
                        </div>
                    </div>

                    {/* Title wrapper */}
                    <div className="flex text-teal-100 !-mt-16 t-h5 md:mr-144">
                        {title}
                    </div>

                    {/* Card type content wrapper */}
                    {components?.cardContent && (
                        <AnimateHeight
                            className="!mt-0"
                            duration={300}
                            animateOpacity={true}
                            height={expandedContent ? 'auto' : 0}>
                            {components?.cardContent}
                        </AnimateHeight>
                    )}

                    {/* Card related items wrapper */}
                    {components?.relatedItems}

                    {/* Card child items wrapper */}
                    {components?.childCollection}

                    {/* Card provide report update wrapper */}
                    {MODE === CONTEXTS.REPORT && components?.reportUpdate}
                </div>
            </div>
        </>
    );
};

BaseCardComponent.propTypes = {
    title: t.string.isRequired,
    type: t.string.isRequired,
    components: t.shape({
        cardContent: t.element,
        relatedItems: t.element,
        childCollection: t.element,
        reportUpdate: t.element,
    }),
    methods: t.shape({
        delete: t.shape({
            action: t.func.isRequired,
        }),
        edit: t.shape({
            action: t.func.isRequired,
        }),
    }),
};

BaseCardComponent.defaultProps = {
    title: '',
    type: '',
    components: {
        cardContent: null,
        relatedItems: null,
        childCollection: null,
        reportUpdate: null,
    },
    methods: {
        delete: null,
        edit: null,
    },
};

export default BaseCardComponent;
