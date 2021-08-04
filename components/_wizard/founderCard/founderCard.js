// React
import React, { useEffect } from 'react';

// Packages
import t from 'prop-types';
import { useWatch } from 'react-hook-form';
import AnimateHeight from 'react-animate-height';

// Components
import Card from 'components/_wizard/card';
import ComponentSelectorWrapper from 'components/componentSelectorWrapper';
import { Reflection } from 'components/_inputs';

const FounderCardComponent = ({
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
                <Card {...rest} />
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
        <Card {...rest} />
    );
};

FounderCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Additonal headline
    subHeadline: t.string,
    // Next to headline
    label: t.string,
    // Image url
    image: t.string,
    // Text after body text
    footnote: t.string,
    // Button action
    action: t.func,
    // Add controller and functionality to reflect
    controller: t.oneOfType([t.object, t.bool]),
    // Name for the input form if using controller
    name: t.string,
    // Default value for reflection
    defaultValue: t.shape({ selected: t.bool, value: t.string }),
};

FounderCardComponent.defaultProps = {
    controller: null,
    defaultValue: { selected: false, value: '' },
};

export default FounderCardComponent;
