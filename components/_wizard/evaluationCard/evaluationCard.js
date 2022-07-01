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

const EvaluationCardComponent = ({
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

EvaluationCardComponent.propTypes = {
    body: t.string,
    evaluator: t.string,
    action: t.func,
};

EvaluationCardComponent.defaultProps = {};

export default EvaluationCardComponent;
