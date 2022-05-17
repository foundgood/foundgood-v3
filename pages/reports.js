// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useForm, useWatch } from 'react-hook-form';

// Utilities
import { useLabels, useElseware, useUser } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import Preloader from 'components/preloader';
import SectionWrapper from 'components/sectionWrapper';
import Footer from 'components/_layout/footer';
import ReportRow from 'components/_report/reportRow';
import { SearchFilterMultiselect } from 'components/_inputs';

const ReportComponent = ({ pageProps }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { getUserAccountId, getUserAccountType } = useUser();
    const { label, labelTodo, pickList } = useLabels();
    const { CONSTANTS } = useInitiativeDataStore();
    const { ewGet } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    const [initial, setInitial] = useState(null);
    const [filtered, setFiltered] = useState(null);
    const [
        controlledAccountFoundations,
        setControlledAccountFoundations,
    ] = useState([]);

    // ///////////////////
    // FORMS
    // ///////////////////

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

    // ///////////////////
    // METHODS
    // ///////////////////

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
                          item.Initiative__r?.Name?.toLowerCase().includes(
                              text.toLowerCase()
                          ) ||
                          item.Funder_Report__r?.Application_Id__c?.toLowerCase().includes(
                              text.toLowerCase()
                          ) ||
                          item.Initiative__r?.Lead_Grantee__r?.Name?.toLowerCase().includes(
                              text.toLowerCase()
                          )
                  )
                : initial;

            // Optional category
            nextFiltered =
                category.length > 0
                    ? nextFiltered.filter(item =>
                          category.includes(item.Initiative__r.Category__c)
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

            // Optional foundation (hidden if user type is 'Foundation')
            nextFiltered =
                foundation?.length > 0
                    ? nextFiltered.filter(item =>
                          foundation.includes(
                              item.Funder_Report__r?.Account__r?.Id
                          )
                      )
                    : nextFiltered;

            setFiltered(nextFiltered);
        }
    }

    // ///////////////////
    // DATA
    // ///////////////////

    const { data: reportsData } = ewGet(
        'initiative-report/initiative-reports-overview'
    );
    const { data: accountFoundations } = ewGet('account/account', {
        type: 'foundation',
    });

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        if (reportsData && accountFoundations) {
            const reportsDataFunders = new Set([
                ...Object.values(reportsData.data)
                    .map(item => item.Funder_Report__r?.Account__r?.Id)
                    .filter(item => item),
            ]);

            const accountFoundationsData = Object.values(
                accountFoundations.data
            ).filter(item => [...reportsDataFunders].includes(item.Id));

            setControlledAccountFoundations(accountFoundationsData);
        }
    }, [accountFoundations, reportsData]);

    useEffect(() => {
        if (reportsData) {
            const reports = Object.values(reportsData.data).filter(item => {
                // If User type is Foundation
                // Only show reports with same Id as users AccountId
                if (
                    getUserAccountType() ===
                    CONSTANTS.ACCOUNT.ACCOUNT_TYPE_FOUNDATION
                ) {
                    return (
                        item.Initiative__c !== null &&
                        item.Report_Type__c !== null &&
                        item.Funder_Report__r?.Account__r?.Id ===
                            getUserAccountId()
                    );
                } else {
                    return (
                        item.Initiative__c !== null &&
                        item.Report_Type__c !== null
                    );
                }
            });

            setInitial(reports);
            setFiltered(reports);
        }
    }, [reportsData]);

    useEffect(() => {
        onFilter(getValues());
    }, [
        filterCategory,
        filterText,
        filterStatus,
        filterType,
        filterFoundation,
    ]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div
            className={cc([
                'bg-amber-10 absolute min-h-full flex justify-center left-0 right-0',
            ])}>
            {/* Content */}
            <div className="w-full max-w-[900px] page-mx mt-80 md:mt-120 pb-64 lg:pb-96 rounded-8">
                <SectionWrapper>
                    <h2 className="t-h2">{label('ReportManagerHeading')}</h2>
                    <div className="flex flex-col">
                        <input
                            {...register('filter.text')}
                            type="text"
                            placeholder={label(
                                'InitiativeManagerSearchBoxText'
                            )}
                            className="input-search"
                        />
                        <div className="flex flex-wrap mt-16 -m-8">
                            <SearchFilterMultiselect
                                name="filter.category"
                                label={label(
                                    'ReportManagerFilterGrantGivingArea'
                                )}
                                controller={control}
                                options={pickList('Initiative__c.Category__c')}
                            />
                            <SearchFilterMultiselect
                                name="filter.status"
                                label={labelTodo(
                                    'ReportManagerFilterReportStatus is missing'
                                )}
                                controller={control}
                                options={pickList(
                                    'Initiative_Report__c.Status__c'
                                )}
                            />
                            <SearchFilterMultiselect
                                name="filter.type"
                                label={label('ReportManagerFilterReportType')}
                                controller={control}
                                options={pickList(
                                    'Initiative_Report__c.Report_Type__c'
                                )}
                            />
                            {getUserAccountType() !==
                                CONSTANTS.ACCOUNT.ACCOUNT_TYPE_FOUNDATION && (
                                <SearchFilterMultiselect
                                    name="filter.foundation"
                                    label={label(
                                        'ReportManagerFilterFoundation'
                                    )}
                                    controller={control}
                                    options={
                                        controlledAccountFoundations?.map(
                                            item => ({
                                                label: item.Name,
                                                value: item.Id,
                                            })
                                        ) ?? []
                                    }
                                />
                            )}
                        </div>
                    </div>
                </SectionWrapper>

                {reportsData ? (
                    <>
                        <SectionWrapper>
                            {filtered?.map(item => (
                                <ReportRow
                                    key={item.Id}
                                    initiativeId={item.Initiative__c}
                                    reportId={item.Id}
                                    funderId={
                                        item.Funder_Report__r?.Application_Id__c
                                    }
                                    funderName={
                                        item.Funder_Report__r?.Account__r?.Name
                                    }
                                    type={item.Report_Type__c}
                                    grantee={
                                        item.Initiative__r?.Lead_Grantee__r
                                            ?.Name
                                    }
                                    headline={item.Initiative__r?.Name}
                                    dueDate={item.Due_Date__c}
                                    status={item.Status__c}
                                />
                            ))}
                        </SectionWrapper>

                        <Footer />
                    </>
                ) : (
                    <Preloader />
                )}
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

export default WithAuth(ReportComponent);
