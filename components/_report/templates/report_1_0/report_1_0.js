// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';

// Utilities
import { useMetadata, useContext } from 'utilities/hooks';
import { useReportLayoutStore } from 'utilities/store';

// Components
import Preloader from 'components/preloader';
import Footer from 'components/_layout/footer';
import SectionWrapper from 'components/sectionWrapper';
import Button from 'components/button';
import TextCard from 'components/_initiative/textCard';
import DividerLine from 'components/_initiative/dividerLine';

// Icons
import { FiFileText } from 'react-icons/fi';

const Report_1_0Component = ({ initiative, report, CONSTANTS }) => {
    // Hook: Context
    const { INITIATIVE_ID } = useContext();

    // Hook: Metadata
    const { labelTodo, label } = useMetadata();

    // Store: ReportLayout
    const { toggleLeftMenu } = useReportLayoutStore();

    // Data maniipulation
    const [name, setName] = useState();
    const [status, setStatus] = useState();
    const [deadline, setDeadline] = useState();
    const [summary, setSummary] = useState();
    const [achievement, setAchievement] = useState();
    const [challenge, setChallenge] = useState();
    const [learning, setLearning] = useState();
    const [outcomes, setOutcomes] = useState();
    const [files, setFiles] = useState();

    useEffect(() => {
        // Hide naviagiton for old reports
        toggleLeftMenu(false);
    }, []);

    useEffect(() => {
        // Initial Load
        if (report?.Id && initiative?.Id) {
            // console.log('report: ', report);
            // console.log('initiative: ', initiative);

            setName(initiative.Name);
            setDeadline(report.Due_Date__c);
            setStatus(report.Status__c);

            setSummary(report.Executive_Summary__c);

            // Achievements
            const achievement = Object.values(initiative._reportDetails)
                .filter((item, index) => item.Type__c == 'Achievement')
                .map(item => item.Description__c)[0];
            setAchievement(achievement);

            // Challenges
            const challenge = Object.values(initiative._reportDetails)
                .filter((item, index) => item.Type__c == 'Challenge')
                .map(item => item.Description__c)[0];
            setChallenge(challenge);

            // Learnings
            const learning = Object.values(initiative._reportDetails)
                .filter((item, index) => item.Type__c == 'Learning')
                .map(item => item.Description__c)[0];
            setLearning(learning);

            // Outcomes
            const outcomes = Object.values(initiative._reportDetails)
                .filter(item => item.Type__c == 'Outcome')
                .map((item, index) => {
                    // TODO: item.Problem_Resolutions contains JSON of related goals - Todo find example json....
                    // console.log('outcome: ', item.Problem_Resolutions);

                    // OLD
                    // // // Get related goals
                    // // const goals = Object.values(initiative._goals)
                    // //     .find(goal => goal.Id == item.Initiative_Goal__c)
                    // //     ?.map(goal => {
                    // //         if (item.Type__c == CONSTANTS.TYPES.GOAL_CUSTOM) {
                    // //             return goal.Goal__c;
                    // //         } else {
                    // //             return goal.Funder_Objective__c;
                    // //         }
                    // //     });
                    // // console.log('goals: ', goals);

                    return {
                        description: item.Description__c,
                        goals: [], // goals
                    };
                });
            setOutcomes(outcomes);

            // Files
            const files = Object.values(initiative._reportDetails)
                .filter(item => item.URL__c)
                .map((item, index) => {
                    const fileName = item.URL__c.split('/').pop();
                    // console.log('fileName: ', fileName);
                    return {
                        filePath: item.URL__c,
                        fileName: fileName, // 'presentation.pdf',
                    };
                });
            setFiles(files);
        }
    }, [initiative]);

    return (
        <>
            {/* Preloading - Show loading */}
            {!initiative?.Id && <Preloader hasBg={true} />}

            {/* Data Loaded - Show initiative */}
            {initiative?.Id && (
                <div className="animate-fade-in">
                    <SectionWrapper>
                        <div className="flex justify-end">
                            <Button
                                variant="secondary"
                                className="self-start hidden xl:flex"
                                action={`/${INITIATIVE_ID}/reports`}>
                                {labelTodo('Back to reports')}
                            </Button>
                        </div>
                        <SectionWrapper>
                            <h1 className="mt-48 t-h1">{name}</h1>
                            <div className="mt-16 t-sh2">
                                {labelTodo('Deadline: ')} {deadline}
                            </div>
                            <div className="mt-16 t-sh6">{status}</div>
                        </SectionWrapper>
                    </SectionWrapper>

                    {/* Texts */}
                    <SectionWrapper>
                        {summary && (
                            <TextCard
                                // hasRounded={false}
                                className="mt-24"
                                hasBackground={true}
                                headline={label(
                                    'custom.FA_ReportViewHeadingSummary'
                                )}
                                body={summary}
                            />
                        )}
                        {achievement && (
                            <TextCard
                                className="mt-24"
                                hasBackground={true}
                                headline={labelTodo('Achievements')}
                                // headline={label(
                                //     'custom.FA_ReportViewHeadingSummary'
                                // )}
                                body={achievement}
                            />
                        )}
                        {challenge && (
                            <TextCard
                                className="mt-24"
                                hasBackground={true}
                                headline={labelTodo('Challenges')}
                                body={challenge}
                            />
                        )}
                        {learning && (
                            <TextCard
                                className="mt-24"
                                hasBackground={true}
                                headline={labelTodo('Learnings')}
                                body={learning}
                            />
                        )}

                        {outcomes && (
                            <SectionWrapper>
                                <h2 className="mt-48 t-h4">
                                    {labelTodo('Outcomes')}
                                </h2>
                                {outcomes.map((item, index) => (
                                    <div key={`o-${index}`}>
                                        <div className="mt-16">
                                            <p className="mt-16 t-small">
                                                {item.description}
                                            </p>
                                            {item.goals?.length > 0 &&
                                                item.goals?.map((goal, i) => (
                                                    <div
                                                        key={`g-${i}`}
                                                        className="p-12 mt-16 border-4 border-blue-10 rounded-4 t-sh6">
                                                        {goal}
                                                    </div>
                                                ))}
                                        </div>
                                        {index < outcomes.length - 1 && (
                                            <DividerLine />
                                        )}
                                    </div>
                                ))}
                            </SectionWrapper>
                        )}
                        {files && (
                            <SectionWrapper>
                                <h2 className="mt-48 t-h4">
                                    {label(
                                        'custom.FA_ReportViewSubHeadingLogAdditional'
                                    )}
                                </h2>
                                {files.map((item, index) => (
                                    <a
                                        key={`o-${index}`}
                                        className="flex w-full p-16 mt-16 cursor-pointer rounded-8 bg-blue-10"
                                        download={item.fileName} // Only work if same domain
                                        href={item.filePath}
                                        target="_blank">
                                        <div className="mr-16">
                                            <FiFileText className="w-48 h-48" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="t-h6">
                                                {item.fileName}
                                            </div>
                                            <div className="text-blue-200 t-sh5">
                                                {labelTodo('Download')}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </SectionWrapper>
                        )}
                    </SectionWrapper>

                    <Footer />
                </div>
            )}
        </>
    );
};

Report_1_0Component.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    CONSTANTS: t.object.isRequired,
};

Report_1_0Component.defaultProps = {
    report: {},
};

export default Report_1_0Component;
