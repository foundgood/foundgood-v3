// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useForm, useWatch } from 'react-hook-form';
import dayjs from 'dayjs';

// Utilities
import { getPermissionRules } from 'utilities';
import { useElseware, useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import Permission from 'components/permission';
import Preloader from 'components/preloader';
import Button from 'components/button';
import SectionWrapper from 'components/sectionWrapper';
import Footer from 'components/_layout/footer';
import InitiativeRow from 'components/_initiative/initiativeRow';
import { SearchFilterMultiselect, SearchFilterDate } from 'components/_inputs';

const HomeComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////
    const { label, pickList } = useLabels();
    const { ewGet } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    const [initial, setInitial] = useState(null);
    const [filtered, setFiltered] = useState(null);

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
    const filterStartDate = useWatch({
        control,
        name: 'filter.startDate',
    });
    const filterEndDate = useWatch({
        control,
        name: 'filter.endDate',
    });

    // ///////////////////
    // METHODS
    // ///////////////////

    function onFilter(data) {
        if (initial) {
            const {
                filter: { text, category, startDate, endDate },
            } = data;
            let nextFiltered;

            // Optional text
            nextFiltered = text
                ? initial.filter(
                      item =>
                          item.Name?.toLowerCase().includes(
                              text.toLowerCase()
                          ) ||
                          item.Lead_Grantee__r?.Name?.toLowerCase().includes(
                              text.toLowerCase()
                          ) ||
                          item._applicationIds.filter(id =>
                              id.includes(text.toLowerCase())
                          ).length > 0
                  )
                : initial;

            // Optional category
            nextFiltered =
                category.length > 0
                    ? nextFiltered.filter(item =>
                          category.includes(item.Category__c)
                      )
                    : nextFiltered;

            // Optional start date
            nextFiltered = startDate
                ? nextFiltered.filter(item => {
                      // Check if grantStart happens AFTER filterStart
                      const grantStart = dayjs(item.Grant_Start_Date__c);
                      const filterStart = dayjs(startDate).format('YYYY-MM-DD');
                      return grantStart.diff(filterStart) >= 0;
                  })
                : nextFiltered;

            // Optional end date
            nextFiltered = endDate
                ? nextFiltered.filter(item => {
                      // Check if grantEnd happens BEFORE filterEnd
                      const grantEnd = dayjs(item.Grant_End_Date__c);
                      const filterEnd = dayjs(endDate).format('YYYY-MM-DD');
                      return grantEnd.diff(filterEnd) <= 0;
                  })
                : nextFiltered;

            setFiltered(nextFiltered);
        }
    }

    // ///////////////////
    // DATA
    // ///////////////////

    const { data: initiativesData } = ewGet('initiative/initiatives-overview');

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Add data results to initial data set
    useEffect(() => {
        if (initiativesData?.data) {
            setInitial(initiativesData.data);
            setFiltered(initiativesData.data);
        }
    }, [initiativesData]);

    useEffect(() => {
        onFilter(getValues());
    }, [filterCategory, filterText, filterStartDate, filterEndDate]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div
            className={cc([
                'bg-amber-10 absolute flex min-h-full justify-center left-0 right-0',
            ])}>
            {/* Content */}
            <div className="w-full max-w-[900px] page-mx mt-80 md:mt-120 pb-64 lg:pb-96 rounded-8">
                <SectionWrapper>
                    <div className="flex justify-between">
                        <h2 className="t-h2">
                            {label('InitiativeManagerHeading')}
                        </h2>
                        <Permission
                            {...{
                                rules: getPermissionRules(
                                    'create',
                                    'introduction',
                                    'add'
                                ),
                            }}>
                            <Button theme="teal" action="/create/introduction">
                                {label('InitiativeManagerCreate')}
                            </Button>
                        </Permission>
                    </div>
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
                                    'InitiativeManagerFilterFilterGrantGivingArea'
                                )}
                                controller={control}
                                options={pickList('Initiative__c.Category__c')}
                            />
                            <SearchFilterDate
                                name="filter.startDate"
                                label={label(
                                    'InitiativeManagerFilterGrantStartDate'
                                )}
                                controller={control}
                            />
                            <SearchFilterDate
                                name="filter.endDate"
                                label={label(
                                    'InitiativeManagerFilterGrantEndDate'
                                )}
                                controller={control}
                            />
                        </div>
                    </div>
                </SectionWrapper>
                {initiativesData ? (
                    <>
                        <SectionWrapper>
                            {filtered?.map(item => (
                                <InitiativeRow
                                    key={item.Id}
                                    initiativeId={item.Id}
                                    type={item.Category__c}
                                    grantee={item.Lead_Grantee__r?.Name}
                                    headline={item.Name}
                                    leadFunder={
                                        item._funders?.filter(
                                            item =>
                                                item.Type__c ===
                                                CONSTANTS.FUNDERS.LEAD_FUNDER
                                        )[0]?.Account__r?.Name
                                    }
                                    otherFunders={
                                        item._funders?.filter(
                                            item =>
                                                item.Type__c !==
                                                CONSTANTS.FUNDERS.LEAD_FUNDER
                                        ).length
                                    }
                                    reports={item._reports}
                                    startDate={item.Grant_Start_Date__c}
                                    endDate={item.Grant_End_Date__c}
                                    image={item.Hero_Image_URL__c}
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

HomeComponent.propTypes = {
    pageProps: t.object,
};

HomeComponent.defaultProps = {
    pageProps: {},
};

export default WithAuth(HomeComponent);
