// React
import { useState } from 'react';

// Utiities
import useElseware from './useElseware';
import useContext from './useContext';
import { useInitiativeDataStore } from 'utilities/store';

const useReflections = ({ dataSet, parentKey, reflectionKey, type }) => {
    const { ewCreate, ewCreateUpdateWrapper } = useElseware();
    const { REPORT_ID } = useContext();
    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // Construct state
    const [rDataSet] = useState(dataSet);
    const [rParentKey] = useState(parentKey);
    const [rReflectionKey] = useState(reflectionKey);
    const [rType] = useState(type);

    async function submitReflection(formData) {
        const currentReflection =
            utilities.reportDetails
                .getFromReportId(REPORT_ID)
                .find(item => item.Type__c === rType) || {};

        const reflectionData = formData[rReflectionKey];

        if (reflectionData) {
            ewCreateUpdateWrapper(
                'initiative-report-detail/initiative-report-detail',
                currentReflection?.Id,
                {
                    Description__c: reflectionData,
                },
                {
                    Type__c: rType,
                    Initiative_Report__c: REPORT_ID,
                },
                '_reportDetails'
            );
        }
    }

    async function submitMultipleReflections(formData) {
        rDataSet()
            .reduce((acc, key) => {
                const currentReflection = utilities.reportDetails
                    .getFromReportId(REPORT_ID)
                    .filter(item => item[parentKey] === key);
                return [
                    ...acc,
                    {
                        reportDetailId: currentReflection[0]?.Id ?? false,
                        relationId: key,
                        value: formData[`${key}-reflection`],
                        selected: formData[`${key}-selector`],
                    },
                ];
            }, [])
            .filter(item => item.selected);

        await Promise.all(
            reportDetails.map(item =>
                ewCreateUpdateWrapper(
                    'initiative-report-detail/initiative-report-detail',
                    item.reportDetailId,
                    {
                        Description__c: item.value,
                    },
                    {
                        Type__c: rType,
                        [parentKey]: item.relationId,
                        Initiative_Report__c: REPORT_ID,
                    },
                    '_reportDetails'
                )
            )
        );
    }

    async function submitNoReflection() {
        const { data } = await ewCreate(
            'initiative-report-detail/initiative-report-detail',
            {
                Type__c: rType,
                Description__c: CONSTANTS.CUSTOM.NO_REFLECTIONS,
                Initiative_Report__c: REPORT_ID,
            }
        );
        utilities.updateInitiativeData('_reportDetails', data);
    }

    async function submitMultipleNoReflections() {
        await Promise.all(
            rDataSet().map(async item => {
                const { data } = await ewCreate(
                    'initiative-report-detail/initiative-report-detail',
                    {
                        Type__c: rType,
                        [rParentKey]: item.Id,
                        Description__c: CONSTANTS.CUSTOM.NO_REFLECTIONS,
                        Initiative_Report__c: REPORT_ID,
                    }
                );
                utilities.updateInitiativeData('_reportDetails', data);
            })
        );
    }

    return {
        submitReflection,
        submitMultipleReflections,
        submitNoReflection,
        submitMultipleNoReflections,
    };
};

export default useReflections;
