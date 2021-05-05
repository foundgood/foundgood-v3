// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';

const ActivityCardComponent = ({ headline, tags, locations, goals }) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    return (
        <div className="p-16 max-w-[600px] border-4 border-teal-20 rounded-8 text-teal-100">
            <div className="flex items-start justify-between">
                <div className="w-full flex-start">
                    {headline && (
                        <div className="flex items-center">
                            <h4 className="t-sh4">{labelTodo(headline)}</h4>
                        </div>
                    )}
                    {/* {tags && (
                        <div className="flex flex-col items-start mt-8">
                            {tags.map((tag, index) => (
                                <p
                                    key={`t-${index}`}
                                    className="px-8 pt-3 pb-1 mb-8 mr-8 t-sh7 bg-teal-20 rounded-4">
                                    {labelTodo(tag)}
                                </p>
                            ))}
                        </div>
                    )} */}
                    {tags && (
                        <>
                            <div className="mt-8 t-caption-bold">
                                {labelTodo('Success indicators')}
                            </div>
                            <div className="flex flex-col items-start">
                                {tags.map((tag, index) => (
                                    <p
                                        key={`t-${index}`}
                                        className="px-8 pt-3 pb-1 mt-8 t-sh7 bg-teal-20 rounded-4">
                                        {labelTodo(tag)}
                                    </p>
                                ))}
                            </div>
                        </>
                    )}

                    {locations && (
                        <>
                            <div className="mt-16 t-caption-bold">
                                {labelTodo('Locations')}
                            </div>
                            <ul>
                                {locations.map((location, index) => (
                                    <li
                                        key={`l-${index}`}
                                        className="mt-4 mr-8 t-caption text-teal-60">
                                        {labelTodo(location)}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {goals && (
                        <>
                            <div className="mt-16 t-caption-bold">
                                {labelTodo('Related goals')}
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
                    <Button theme="teal" variant="secondary">
                        {labelTodo('Update')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

ActivityCardComponent.propTypes = {
    headline: t.string,
    tags: t.arrayOf(t.string),
    locations: t.arrayOf(t.string),
    goals: t.arrayOf(t.string),
};

ActivityCardComponent.defaultProps = {};

export default ActivityCardComponent;
