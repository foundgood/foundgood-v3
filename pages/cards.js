// React
import React, { useEffect } from 'react';

// Packages
import t from 'prop-types';
import Link from 'next/link';

// Utilities
import { useAuth } from 'utilities/hooks';

// Components
import ListCard from 'components/_wizard/listCard';
import CollaboratorCard from 'components/_wizard/collaboratorCard';
import ResultCard from 'components/_wizard/resultCard';
import FounderCard from 'components/_wizard/founderCard';
import ProjectMemberCard from 'components/_wizard/projectMemberCard';
import GoalCard from 'components/_wizard/goalCard';
import EvaluationCard from 'components/_wizard/evaluationCard';
import OutcomeCard from 'components/_wizard/outcomeCard';
import ActivityCard from 'components/_wizard/activityCard';
import AlertMessage from 'components/_wizard/alertMessage';
import KpiCard from 'components/_wizard/kpiCard';
import ProgressCard from 'components/_wizard/progressCard';
import ReportCard from 'components/_wizard/reportCard';

const CardsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn, logout } = useAuth();
    verifyLoggedIn();

    return (
        <div className="ml-24 pt-[124px]">
            <h1 className="t-h1">Cards</h1>
            <br></br>
            <p>Alert message</p>
            <AlertMessage description="Check that these details are up to date" />
            <br></br>

            <br></br>
            <p>List card</p>
            <ListCard
                headline="Reporting"
                body="Desription Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus scelerisque elit eros, sed sodales quam pellentesque sit amet."
            />
            <br></br>
            <p>Collaborator card</p>
            <CollaboratorCard
                headline="Collaborator #1"
                label="Co-applicant"
                body="Desription Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus scelerisque elit eros, sed sodales quam pellentesque sit amet."
                image="/images/fg-landscape-1.jpg"
            />

            <br></br>
            <p>Result card</p>
            <ResultCard
                headline="Result name"
                footnote="Sharing method • Type of sharing"
                tags={['Children (5-15 years)', 'Adults (over 24 years)']}
            />
            <br></br>
            <p>Founder card</p>
            <FounderCard
                headline="Funder #1"
                label="Co-funder"
                subHeadline="Reporting"
                footnote="May 1st 2021 – April 30th 2022"
                image="/images/fg-portrait-1.jpg"
            />
            <br></br>
            <p>Project member card</p>
            <ProjectMemberCard
                headline="Job title"
                subHeadline="Role"
                footnote="Gender • 100%"
            />
            <br></br>
            <p>Goal card</p>
            <GoalCard
                headline="Improving life prospects through healthy weight"
                footnote="Predefined"
            />
            <br></br>
            <p>Influence card (Same as ListCard!?)</p>
            <ListCard
                headline="Influence on policy name"
                body="Desription Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus scelerisque elit eros, sed sodales quam pellentesque sit amet."
            />
            <br></br>
            <p>Evaluation card</p>
            <EvaluationCard
                body="Desription Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus scelerisque elit eros, sed sodales quam pellentesque sit amet."
                evaluator="Evaluator name"
            />

            <br></br>
            <p>Outcome card</p>
            <OutcomeCard
                body="Desription Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus scelerisque elit eros, sed sodales quam pellentesque sit amet."
                goals={['Related goals #1', 'Related goals #2']}
            />

            <br></br>
            <p>Activity card</p>
            <ActivityCard
                headline="Activity #1 name"
                tags={['Success indicator #1', 'Success indicator #2']}
                locations={['Uganda', 'Copenhagen, Denmark']}
                goals={['Goal name 1', 'Goal name 2']}
            />
            <br></br>

            <br></br>
            <p>KPI Cards</p>
            <KpiCard
                headline="Activity #1 name"
                items={[
                    { label: 'People', headline: 'Made adults (24+)' },
                    { label: 'Custom', headline: 'Well build wells' },
                ]}
            />

            <br></br>
            <p>Progress Cards</p>
            <ProgressCard
                headline="Activity #1 name"
                items={[
                    {
                        label: 'People',
                        headline: 'Made adults (24+)',
                        value: '10',
                    },
                    {
                        label: 'Custom',
                        headline: 'Well build wells',
                        value: '5',
                    },
                    {
                        label: 'Hello',
                        headline: 'Does it work',
                        value: 99,
                    },
                ]}
            />

            <br></br>
            <p>Report Cards</p>
            <ReportCard
                headline="Reports for Novo Nordisk Foundation"
                items={[
                    {
                        headline: 'Status report',
                        date: 'April 28th 2021',
                        status: 'review', // TODO - update to salesforece format
                    },
                    {
                        headline: 'Well build wells',
                        date: 'April 28th 2021',
                        status: 'not-started', // TODO - update to salesforece format
                    },
                    {
                        headline: 'Does it work',
                        date: 'April 28th 2021',
                        status: 'in-progress', // TODO - update to salesforece format
                    },
                    {
                        headline: 'Status report',
                        date: 'April 28th 2021',
                        status: 'review', // TODO - update to salesforece format
                    },
                ]}
                actionCreate={() => {
                    console.log('action create');
                    // setModalIsOpen(true);
                    // setFunder(funder);
                }}
                actionUpdate={item => {
                    console.log('action Update ', item);
                    // setModalIsOpen(true);
                    // setUpdateId(item.id);
                    // setFunder(funder);
                }}
            />

            <br></br>
            <br></br>
            <br></br>
        </div>
    );
};

CardsComponent.propTypes = {
    pageProps: t.object,
};

CardsComponent.defaultProps = {
    pageProps: {},
};

export default CardsComponent;
