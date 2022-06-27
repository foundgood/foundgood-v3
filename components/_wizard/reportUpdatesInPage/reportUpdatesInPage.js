// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useContext, useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components

// Icons
import {
    FiActivity,
    FiTrendingUp,
    FiMessageCircle,
    FiTag,
} from 'react-icons/fi';

const ReportUpdatesInPageComponent = ({ items, itemRelationKey }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { CONTEXTS, MODE, REPORT_ID } = useContext();
    const { label } = useLabels();

    // ///////////////////
    // DATA
    // ///////////////////

    // Current report details
    const currentReportDetails = utilities.reportDetails
        .getFromReportId(REPORT_ID)
        .filter(detail =>
            items.map(x => x.Id).includes(detail[itemRelationKey])
        );

    // Get reflections
    const reflections = currentReportDetails.filter(
        detail => detail?.Description__c
    );

    // Get tags
    const tags = items
        .map(x => utilities.tags.getFromRelationKeyId(itemRelationKey, x.Id))
        .flat();

    // TODO Get Metrics
    const metrics = [];

    // Get metrics tags
    const metricTags = items
        .map(x => utilities.activitySuccessMetrics.getFromActivityId(x.Id))
        .flat()
        .map(metric =>
            utilities.tags.getFromRelationKeyId(
                'Initiative_Activity_Success_Metric__c',
                metric.Id
            )
        )
        .flat();

    // Get Status
    const statusesBulk = currentReportDetails.filter(detail =>
        items.map(x => x.Id).includes(detail[itemRelationKey])
    );

    let statuses = 0;
    for (const status of statusesBulk) {
        const count = [
            'Status__c',
            'Completion_Date__c',
            'Status_Comments__c',
        ].reduce((acc, key) => (acc = status[key] ? acc + 1 : acc), 0);
        statuses = statuses + count;
    }

    // Any updates?
    const hasUpdate = [
        tags.length > 0,
        reflections.length > 0,
        metrics.length > 0,
        metricTags.length > 0,
        statuses > 0,
    ].some(x => x);

    // ///////////////////
    // RENDER
    // ///////////////////

    return MODE === CONTEXTS.REPORT && hasUpdate ? (
        <div className="flex items-center justify-between w-full p-16 mb-32 rounded-8 bg-blue-20">
            <p className="-mb-2 t-sh4">
                {label('WizardReportUpdatesInPageHasUpdates')}
            </p>
            <div className="flex items-center space-x-12 text-blue-300">
                {/* Metrics */}
                {metrics.length > 0 && (
                    <div className="flex items-center space-x-8">
                        <FiTrendingUp className="w-24 h-24" />
                        <span className="relative top-2">{metrics.length}</span>
                    </div>
                )}
                {/* Status */}
                {statuses > 0 && (
                    <div className="flex items-center space-x-8">
                        <FiActivity className="w-24 h-24" />
                        <span className="relative top-2">{statuses}</span>
                    </div>
                )}
                {/* Tags */}
                {(tags.length > 0 || metricTags.length > 0) && (
                    <div className="flex items-center space-x-8">
                        <FiTag className="w-24 h-24" />
                        <span className="relative top-2">
                            {tags.length + metricTags.length}
                        </span>
                    </div>
                )}

                {/* Reflections */}
                {reflections.length > 0 && (
                    <div className="flex items-center space-x-8">
                        <FiMessageCircle className="w-24 h-24" />
                        <span className="relative top-2">
                            {reflections.length}
                        </span>
                    </div>
                )}
            </div>
        </div>
    ) : null;
};

ReportUpdatesInPageComponent.propTypes = {
    items: t.array.isRequired,
    itemRelationKey: t.string.isRequired,
};

ReportUpdatesInPageComponent.defaultProps = {
    items: null,
    itemRelationKey: '',
};

export default ReportUpdatesInPageComponent;
