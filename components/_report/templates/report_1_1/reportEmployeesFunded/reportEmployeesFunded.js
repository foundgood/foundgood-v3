// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { asId, getPermissionRules } from 'utilities';
import { useLabels } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import UpdateButton from 'components/updateButton';
import NumberCard from 'components/_initiative/numberCard';
import TextCard from 'components/_initiative/textCard';

const ReportEmployeesFundedComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label } = useLabels();

    const [employeeGroups, setEmployeeGroups] = useState([]);
    const [
        employeesFundedReflection,
        setEmployeesFundedReflection,
    ] = useState();

    useEffect(() => {
        // Make sure we have Report Details
        if (Object.values(initiative._reportDetails).length > 0) {
            // Get reflection for employees funded
            const employeesReflection = Object.values(
                initiative._reportDetails
            ).filter(item => {
                return item.Type__c ==
                    constants.REPORT_DETAILS.EMPLOYEES_FUNDED_OVERVIEW
                    ? true
                    : false;
            });
            setEmployeesFundedReflection(
                employeesReflection[0]?.Description__c
            );

            // Employee funded - Data for Number cards
            // Group empoyees per role
            // EX Data:
            // {
            //     { role: 'Project manager', total: 2, male: 1, female: 1 },
            //     { role: 'Scientists', total: 4, male: 1, female: 3 },
            // };
            let employeeGroups = Object.values(
                initiative._employeesFunded
            ).reduce((result, employee) => {
                result[employee.Role_Type__c] =
                    result[employee.Role_Type__c] || {};
                // Ref
                const group = result[employee.Role_Type__c];

                // Role
                group.role = employee.Role_Type__c;

                // Total employees
                group.total = group.total ? group.total + 1 : 1;

                // Calculate how many are male/female/other in each group
                if (
                    employee.Gender__c == constants.EMPLOYEES_FUNDED.GENDER_MALE
                ) {
                    group.male = group.male ? group.male + 1 : 1;
                } else if (
                    employee.Gender__c ==
                    constants.EMPLOYEES_FUNDED.GENDER_FEMALE
                ) {
                    group.female = group.female ? group.female + 1 : 1;
                } else if (
                    employee.Gender__c ==
                    constants.EMPLOYEES_FUNDED.GENDER_OTHER
                ) {
                    group.other = group.other ? group.other + 1 : 1;
                }
                return result;
            }, {});
            setEmployeeGroups(employeeGroups);
        } else {
            setEmployeeGroups([]);
            setEmployeesFundedReflection(null);
        }
    }, [initiative, report.Id]);

    return (
        <SectionWrapper id={asId(label('ReportWizardMenuEmployees'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label('ReportViewSubHeadingEmployeesOverall')}
                    </h3>
                    <UpdateButton
                        {...{
                            context: 'report',
                            baseUrl: 'employees-funded',
                            rules: getPermissionRules(
                                'report',
                                'employeesFunded',
                                'update'
                            ),
                        }}
                    />
                </div>
            </SectionWrapper>
            {/*
                1. Items but no reflections
                2. Items with reflection
                3. No Items
            */}
            {employeesFundedReflection ? (
                employeesFundedReflection ===
                constants.CUSTOM.NO_REFLECTIONS ? (
                    <SectionEmpty type="noReflections" />
                ) : (
                    <>
                        <div className="inline-grid w-full grid-cols-2 gap-16 mt-16 md:grid-cols-4 xl:grid-cols-4">
                            {Object.values(employeeGroups).map(
                                (group, index) => {
                                    const males = group.male
                                        ? `${group.male} Male`
                                        : null;
                                    const females = group.female
                                        ? `${group.female} Female`
                                        : null;
                                    const other = group.other
                                        ? `${group.other} Other`
                                        : null;
                                    const description = [males, females, other]
                                        .filter(item => item)
                                        .join(', ');
                                    return (
                                        <NumberCard
                                            key={`e-${index}`}
                                            number={group.total}
                                            headline={group.role}
                                            description={description}
                                        />
                                    );
                                }
                            )}
                        </div>

                        <TextCard
                            className="mt-32"
                            hasBackground={true}
                            headline={label(
                                'ReportViewSubHeadingEmployeesReflections'
                            )}
                            body={employeesFundedReflection}
                        />
                    </>
                )
            ) : (
                <SectionEmpty type="report" />
            )}
        </SectionWrapper>
    );
};

ReportEmployeesFundedComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportEmployeesFundedComponent.defaultProps = {};

export default ReportEmployeesFundedComponent;
