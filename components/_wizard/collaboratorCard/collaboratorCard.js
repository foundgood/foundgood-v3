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

const CollaboratorCardComponent = ({
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
        console.log(reflectSelected);
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
                <div className="mt-16">
                    <Reflection
                        controller={controller}
                        name={`${name}-reflection`}
                        label={inputLabel}
                        defaultValue={defaultValue.value}
                        required={reflectSelected}
                        maxLength={750}
                    />
                </div>
            </AnimateHeight>
        </div>
    ) : (
        <Card {...rest} />
    );
};

CollaboratorCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Next to headline
    label: t.string,
    // Body text
    body: t.string,
    // Image url
    image: t.string,
    // Action for button
    action: t.func,
    // Name for the input form if using controller
    name: t.string,
    // Default value for reflection
    defaultValue: t.shape({ selected: t.bool, value: t.string }),
};

CollaboratorCardComponent.defaultProps = {
    controller: null,
    defaultValue: { selected: false, value: '' },
};

export default CollaboratorCardComponent;
