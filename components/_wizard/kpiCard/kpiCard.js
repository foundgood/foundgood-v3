// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';

const KpiCardComponent = ({
    headline,
    peopleItems,
    metricItems,
    actionCreatePeople,
    actionCreateMetric,
    actionUpdate,
}) => {
    // Hook: Metadata
    const { label } = useLabels();

    // Store: Initiative data
    const { CONSTANTS } = useInitiativeDataStore();

    return (
        <div className="p-16 max-w-[600px] rounded-8 bg-teal-10 text-teal-100 space-y-32">
            <div>
                {headline && (
                    <div className="flex flex-col">
                        <h4 className="mb-8 t-sh4">
                            {label('WizardTitleActivity')}
                        </h4>
                        <h2 className="t-h4">{headline}</h2>
                    </div>
                )}
            </div>
            <div>
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <h4 className="t-sh4">
                            {label('InitiativeViewIndicatorsPeopleReached')}
                        </h4>
                    </div>

                    <Button
                        theme="teal"
                        variant="quaternary"
                        action={actionCreatePeople}>
                        {label('ButtonAddPeople')}
                    </Button>
                </div>

                {peopleItems?.length > 0 && (
                    <div className="flex flex-col">
                        {peopleItems.map((item, index) => (
                            <div
                                key={`i-${index}`}
                                className="flex justify-between p-16 mt-16 bg-white rounded-8">
                                <div>
                                    <div className="text-teal-60 t-sh6">
                                        {item.label}
                                    </div>
                                    <div className="text-teal-100 t-h5">
                                        {item.headline}
                                    </div>
                                </div>
                                <Button
                                    theme="teal"
                                    variant="secondary"
                                    action={() =>
                                        actionUpdate(
                                            item,
                                            CONSTANTS.TYPES.INDICATOR_PREDEFINED
                                        )
                                    }>
                                    {label('Update')}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <h4 className="t-sh4">
                            {label('InitiativeViewIndicatorsMetrics')}
                        </h4>
                    </div>

                    <Button
                        theme="teal"
                        variant="quaternary"
                        action={actionCreateMetric}>
                        {label('ButtonAddIndicator')}
                    </Button>
                </div>
                {metricItems?.length > 0 && (
                    <div className="flex flex-col">
                        {metricItems.map((item, index) => (
                            <div
                                key={`i-${index}`}
                                className="flex justify-between p-16 mt-16 bg-white rounded-8">
                                <div>
                                    <div className="text-teal-60 t-sh6">
                                        {item.label}
                                    </div>
                                    <div className="text-teal-100 t-h5">
                                        {item.headline}
                                    </div>
                                </div>
                                <Button
                                    theme="teal"
                                    variant="secondary"
                                    action={() =>
                                        actionUpdate(
                                            item,
                                            CONSTANTS.TYPES.INDICATOR_CUSTOM
                                        )
                                    }>
                                    {label('Update')}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

KpiCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // KPI Cards
    items: t.arrayOf(
        t.shape({
            label: t.string,
            headline: t.string,
        })
    ),
};

KpiCardComponent.defaultProps = {};

export default KpiCardComponent;
