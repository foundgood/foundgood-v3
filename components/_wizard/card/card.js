// React
import React from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';

const CardComponent = ({
    headline,
    subHeadline,
    body,
    image,
    label,
    footnote,
    tags,
    evaluator,
    goals,
    action,
}) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    return (
        <div className="p-16 max-w-[600px] border-4 border-teal-20 rounded-8 text-teal-100">
            <div className="flex items-start justify-between">
                {image && (
                    <div className="relative flex-none mr-16 h-96 w-96">
                        <Image src={image} layout="fill" objectFit="contain" />
                    </div>
                )}
                <div className="w-full flex-start">
                    {headline && (
                        <div className="flex items-center">
                            <h4 className="t-sh4">{labelTodo(headline)}</h4>
                            {label && (
                                <div className="ml-16 text-teal-60 t-caption">
                                    {label}
                                </div>
                            )}
                        </div>
                    )}
                    {subHeadline && (
                        <h4 className="mt-8 t-h6">{labelTodo(subHeadline)}</h4>
                    )}
                    {body && <p className="mt-8 mr-16">{labelTodo(body)}</p>}
                    {footnote && (
                        <p className="mt-8 t-footnote text-teal-60">
                            {labelTodo(footnote)}
                        </p>
                    )}
                    {tags && (
                        <div className="flex mt-8">
                            {tags.map((tag, index) => (
                                <p
                                    key={`t-${index}`}
                                    className="px-8 pt-3 pb-1 mr-8 t-sh7 bg-teal-20 rounded-4">
                                    {labelTodo(tag)}
                                </p>
                            ))}
                        </div>
                    )}
                    {evaluator && (
                        <p className="mt-8 t-sh4">{labelTodo(evaluator)}</p>
                    )}

                    {goals && (
                        <>
                            <div className="mt-8 t-caption-bold">
                                Related goals
                            </div>
                            <div className="flex flex-col items-start">
                                {goals.map((goal, index) => (
                                    <p
                                        key={`t-${index}`}
                                        className="px-8 pt-3 pb-1 mt-8 t-sh7 bg-teal-20 rounded-4">
                                        {labelTodo(goal)}
                                    </p>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="self-center">
                    <Button theme="teal" variant="secondary" action={action}>
                        {labelTodo('Update')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

CardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Additonal headline
    subHeadline: t.string,
    // Next to headline
    label: t.string,
    // Body text
    body: t.string,
    // Small text - after body text
    footnote: t.string,
    // Tags - shown in bottom
    tags: t.arrayOf(t.string),
    // Evaluator - shown in bottom
    evaluator: t.string,
    // Image url
    image: t.string,
    // Button action
    action: t.func,
};

CardComponent.defaultProps = {};

export default CardComponent;
