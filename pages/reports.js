// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useForm, useWatch } from 'react-hook-form';

// Utilities
import { useSalesForce, useMetadata, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import SectionWrapper from 'components/sectionWrapper';
import Footer from 'components/_layout/footer';
import ReportRow from 'components/_report/reportRow';
import { SearchFilterMultiselect } from 'components/_inputs';

const ReportComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn, logout } = useAuth();
    verifyLoggedIn();

    // Reset initiative data
    const { CONSTANTS } = useInitiativeDataStore();

    // Hook: Metadata
    const { label, valueSet, log } = useMetadata();

    // Hook: Get sales force data methods
    const { sfGetInitiativeList, sfQuery, queries } = useSalesForce();
    const { data } = sfGetInitiativeList();

    // Get data for form
    const { data: accountFoundations } = sfQuery(
        queries.account.allFoundations()
    );

    // Hook: useForm setup
    const { control, register, getValues } = useForm({
        mode: 'onChange',
    });
    const filterText = useWatch({
        control,
        name: 'filter.text',
    });
    const filterCategory = useWatch({
        control,
        name: 'filter.category',
    });
    const filterStatus = useWatch({
        control,
        name: 'filter.status',
    });
    const filterType = useWatch({
        control,
        name: 'filter.type',
    });
    const filterFoundation = useWatch({
        control,
        name: 'filter.foundation',
    });

    // Search results data
    const [initial, setInitial] = useState(null);
    const [filtered, setFiltered] = useState(null);

    // Add data results to initial data set
    useEffect(() => {
        // Remap data so reports are the main item and initiative is the child
        const reportsData = data?.reduce((acc, item) => {
            const reports = item.Initiative_Reports__r?.records ?? [];
            acc = [
                ...acc,
                ...reports.map(reportItem => ({
                    ...reportItem,
                    initiative: item,
                    funders:
                        item.Initiative_Funders__r?.records?.map(
                            funder => funder
                        ) ?? [],
                })),
            ];
            return acc;
        }, []);

        setInitial(reportsData);
        setFiltered(reportsData);
    }, [data]);

    function onFilter(data) {
        if (initial) {
            const {
                filter: { text, category, status, type, foundation },
            } = data;

            let nextFiltered;

            // Optional text
            nextFiltered = text
                ? initial.filter(
                      item =>
                          item.initiative.Name.toLowerCase().includes(text) ||
                          item.initiative.Application_Id__c?.includes(text)
                  )
                : initial;

            // Optional category
            nextFiltered =
                category.length > 0
                    ? nextFiltered.filter(item =>
                          category.includes(item.initiative.Category__c)
                      )
                    : nextFiltered;

            // Optional status
            nextFiltered =
                status.length > 0
                    ? nextFiltered.filter(item =>
                          status.includes(item.Status__c)
                      )
                    : nextFiltered;

            // Optional type
            nextFiltered =
                type.length > 0
                    ? nextFiltered.filter(item =>
                          type.includes(item.Report_Type__c)
                      )
                    : nextFiltered;

            // Optional foundation
            nextFiltered =
                foundation.length > 0
                    ? nextFiltered.filter(item =>
                          item.funders.some(f =>
                              foundation.includes(f.Account__c)
                          )
                      )
                    : nextFiltered;

            setFiltered(nextFiltered);
        }
    }

    useEffect(() => {
        onFilter(getValues());
    }, [
        filterCategory,
        filterText,
        filterStatus,
        filterType,
        filterFoundation,
    ]);

    return (
        <div
            className={cc([
                'bg-amber-10 absolute min-h-full flex justify-center left-0 right-0',
            ])}>
            {/* Content */}
            <div className="w-full max-w-[900px] page-mx mt-80 md:mt-120 pb-64 lg:pb-96 rounded-8">
                <SectionWrapper>
                    <h2 className="t-h2">
                        {label('custom.FA_ReportManagerHeading')}
                    </h2>
                    <div className="flex flex-col">
                        <input
                            {...register('filter.text')}
                            type="text"
                            placeholder={label(
                                'custom.FA_InitiativeManagerSearchBoxText'
                            )}
                            className="input-search"
                        />
                        <div className="flex flex-wrap mt-16 -m-8">
                            <SearchFilterMultiselect
                                name="filter.category"
                                label={label(
                                    'custom.FA_ReportManagerFilterGrantGivingArea'
                                )}
                                controller={control}
                                options={valueSet('initiative.Category__c')}
                            />
                            <SearchFilterMultiselect
                                name="filter.status"
                                label={label(
                                    'custom.FA_ReportManagerFilterReportStatus'
                                )}
                                controller={control}
                                options={valueSet('initiativeReport.Status__c')}
                            />
                            <SearchFilterMultiselect
                                name="filter.type"
                                label={label(
                                    'custom.FA_ReportManagerFilterReportType'
                                )}
                                controller={control}
                                options={valueSet(
                                    'initiativeReport.Report_Type__c'
                                )}
                            />
                            <SearchFilterMultiselect
                                name="filter.foundation"
                                label={label(
                                    'custom.FA_ReportManagerFilterFoundation'
                                )}
                                controller={control}
                                options={
                                    accountFoundations?.records?.map(item => ({
                                        label: item.Name,
                                        value: item.Id,
                                    })) ?? []
                                }
                            />
                        </div>
                    </div>
                </SectionWrapper>

                <SectionWrapper>
                    {filtered?.map(item => (
                        <ReportRow
                            key={item.Id}
                            initiativeId={item.initiative.Id}
                            reportId={item.Id}
                            applicationId={item.initiative.Application_Id__c}
                            type={item.Report_Type__c}
                            grantee={item.initiative.Lead_Grantee__r?.Name}
                            headline={item.initiative.Name}
                            leadFunder={
                                item.funders?.filter(
                                    item =>
                                        item.Type__c ===
                                        CONSTANTS.TYPES.LEAD_FUNDER
                                )[0]?.Account__r.Name
                            }
                            dueDate={item.Due_Date__c}
                            status={item.Status__c}
                        />
                    ))}
                </SectionWrapper>

                <Footer />
            </div>
        </div>
    );
};

ReportComponent.propTypes = {
    pageProps: t.object,
};

ReportComponent.defaultProps = {
    pageProps: {},
};

export default ReportComponent;
