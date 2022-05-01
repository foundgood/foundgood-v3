// React
import React, { useEffect } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useWatch } from 'react-hook-form';
import AnimateHeight from 'react-animate-height';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components
import Button from 'components/button';
import ComponentSelectorWrapper from 'components/componentSelectorWrapper';
import { Reflection } from 'components/_inputs';

const ActivityCardComponent = ({
    defaultValue,
    controller,
    name,
    inputLabel,
    reflectAction,
    ...rest
}) => {
    const reflectSelected = controller
        ? useWatch({
              control: controller,
              name: `${name}-selector`,
              defaultValue: defaultValue.selected,
          })
        : false;

    // Effect: Run reflectAction on reflectSelected change in order to propagate event up
    useEffect(() => {
        reflectAction(reflectSelected);
    }, [reflectSelected]);

    return controller ? (
        <div>
            <ComponentSelectorWrapper
                controller={controller}
                name={`${name}-selector`}
                defaultValue={defaultValue.selected}>
                <ActivityCard {...rest} />
            </ComponentSelectorWrapper>
            <AnimateHeight
                duration={300}
                animateOpacity={true}
                height={reflectSelected ? 'auto' : 0}>
                <Reflection
                    controller={controller}
                    name={`${name}-reflection`}
                    label={inputLabel}
                    defaultValue={defaultValue.value}
                    required={reflectSelected}
                    maxLength={750}
                />
            </AnimateHeight>
        </div>
    ) : (
        <ActivityCard {...rest} />
    );
};

const ActivityCard = ({
    headline,
    tags,
    locations,
    goals,
    action,
    description,
    selected,
    onChange,
    reflectionMode,
}) => {
    // Hook: Metadata
    const { labelTodo, label, getValueLabel } = useLabels();

    return (
        <div
            className={cc([
                'p-16 max-w-[600px] border-4 border-teal-20 rounded-8 text-teal-100 transition-default',
                {
                    '!border-teal-40': selected,
                },
            ])}>
            <div className="flex items-start justify-between">
                <div className="w-full flex-start">
                    {headline && (
                        <div className="flex items-center">
                            <h4 className="t-sh4">{headline}</h4>
                        </div>
                    )}
                    {description && <p className="t-small">{description}</p>}

                    {tags && tags.length > 0 && (
                        <>
                            <div className="mt-8 t-caption-bold">
                                {label(
                                    'objects.Initiative_Activity__c.Activity_Tag__c'
                                )}
                            </div>
                            <div className="flex flex-col items-start">
                                {tags.map((tag, index) => (
                                    <p
                                        key={`t-${index}`}
                                        className="px-8 pt-3 pb-1 mt-8 t-sh7 bg-teal-20 rounded-4">
                                        {getValueLabel(
                                            'initiativeActivity.Activity_Tag__c',
                                            tag,
                                            true
                                        )}
                                    </p>
                                ))}
                            </div>
                        </>
                    )}
                    {locations && (
                        <>
                            <div className="mt-16 t-caption-bold">
                                {label(
                                    'objects.Initiative_Activity__c.Initiative_Location__c'
                                )}
                            </div>
                            <ul>
                                {locations.map((location, index) => (
                                    <li
                                        key={`l-${index}`}
                                        className="mt-4 mr-8 t-caption text-teal-60">
                                        {location}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {goals && goals.length > 0 && (
                        <>
                            <div className="mt-16 t-caption-bold">
                                {label('objects.Initiative_Goal__c.Goal__c')}
                            </div>
                            <div className="flex flex-col items-start">
                                {goals.map((goal, index) => (
                                    <p
                                        key={`t-${index}`}
                                        className="px-8 pt-3 pb-1 mt-8 t-sh7 bg-teal-20 rounded-4">
                                        {goal}
                                    </p>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-end mt-32 space-x-12">
                <Button
                    theme="teal"
                    variant={reflectionMode ? 'tertiary' : 'secondary'}
                    action={action}>
                    {label('ButtonEditDetails')}
                </Button>
                {reflectionMode && (
                    <Button
                        theme="teal"
                        variant="secondary"
                        action={() => onChange(!selected)}>
                        {label(
                            selected ? 'ButtonCancel' : 'ButtonProvideUpdate'
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};

ActivityCardComponent.propTypes = {
    headline: t.string,
    tags: t.arrayOf(t.string),
    locations: t.arrayOf(t.string),
    goals: t.arrayOf(t.string),
    action: t.func,
    // Add controller and functionality to reflect
    controller: t.oneOfType([t.object, t.bool]),
    // Name for the input form if using controller
    name: t.string,
    // Default value for reflection
    defaultValue: t.shape({ selected: t.bool, value: t.string }),
};

ActivityCardComponent.defaultProps = {
    controller: null,
    defaultValue: { selected: false, value: '' },
};

export default ActivityCardComponent;
