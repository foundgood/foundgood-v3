// React
import React from 'react';

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
    ...rest
}) => {
    const selected = controller
        ? useWatch({
              control: controller,
              name: `${name}-selector`,
              defaultValue: defaultValue.selected,
          })
        : false;

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
                height={selected ? 'auto' : 0}>
                <Reflection
                    controller={controller}
                    name={`${name}-reflection`}
                    label={inputLabel}
                    defaultValue={defaultValue.value}
                    required={selected}
                    maxLength={750}
                />
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
