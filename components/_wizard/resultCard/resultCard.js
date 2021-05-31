// React
import React from 'react';

// Packages
import t from 'prop-types';
import { useWatch } from 'react-hook-form';
import AnimateHeight from 'react-animate-height';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Card from 'components/_wizard/card';
import ComponentSelectorWrapper from 'components/componentSelectorWrapper';
import { Reflection } from 'components/_inputs';

const ResultCardComponent = ({
    defaultValue,
    controller,
    name,
    inputLabel,
    journalPublication,
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
                <Card {...rest}>
                    {journalPublication && (
                        <JournalPublication {...journalPublication} />
                    )}
                </Card>
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
        <Card {...rest}>
            {journalPublication && (
                <JournalPublication {...journalPublication} />
            )}
        </Card>
    );
};

const JournalPublication = ({ type, year, title, publisher, author, doi }) => {
    // Hook: Metadata
    const { labelTodo, label } = useMetadata();
    return (
        <div className="p-16 my-16 space-y-8 rounded t-sh7 bg-teal-10">
            {title && (
                <div className="flex flex-col md:flex-row">
                    <span className="w-4/12 text-teal-60">
                        {label(
                            'objects.initiativeActivity.Publication_Title__c'
                        )}
                    </span>
                    <span className="text-teal-100">{title}</span>
                </div>
            )}

            {type && (
                <div className="flex flex-col md:flex-row">
                    <span className="w-4/12 text-teal-60">
                        {label(
                            'objects.initiativeActivity.Publication_Type__c'
                        )}
                    </span>
                    <span className="text-teal-100">{type}</span>
                </div>
            )}

            {year && (
                <div className="flex flex-col md:flex-row">
                    <span className="w-4/12 text-teal-60">
                        {label(
                            'objects.initiativeActivity.Publication_Year__c'
                        )}
                    </span>
                    <span className="text-teal-100">{year}</span>
                </div>
            )}

            {publisher && (
                <div className="flex flex-col md:flex-row">
                    <span className="w-4/12 text-teal-60">
                        {label(
                            'objects.initiativeActivity.Publication_Publisher__c'
                        )}
                    </span>
                    <span className="text-teal-100">{publisher}</span>
                </div>
            )}

            {author && (
                <div className="flex flex-col md:flex-row">
                    <span className="w-4/12 text-teal-60">
                        {label(
                            'objects.initiativeActivity.Publication_Author__c'
                        )}
                    </span>
                    <span className="text-teal-100">{author}</span>
                </div>
            )}

            {doi && (
                <div className="flex flex-col md:flex-row">
                    <span className="w-4/12 text-teal-60">
                        {label('objects.initiativeActivity.Publication_DOI__c')}
                    </span>
                    <span className="text-teal-100">{doi}</span>
                </div>
            )}
        </div>
    );
};

ResultCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Text after body text
    footnote: t.string,
    // Tags shown in bottom
    tags: t.arrayOf(t.string),
    // Button action
    action: t.func,
    // Add controller and functionality to reflect
    controller: t.oneOfType([t.object, t.bool]),
    // Name for the input form if using controller
    name: t.string,
    // Default value for reflection
    defaultValue: t.shape({ selected: t.bool, value: t.string }),
    // Show weird extra fields
    journalPublication: t.object,
};

ResultCardComponent.defaultProps = {
    controller: null,
    defaultValue: { selected: false, value: '' },
    journalPublication: null,
};

export default ResultCardComponent;
