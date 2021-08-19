// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import dayjs from 'dayjs';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import Preloader from 'components/preloader';
import SectionEmpty from 'components/sectionEmpty';
import Footer from 'components/_layout/footer';
import UpdateButton from 'components/updateButton';
import TextCard from 'components/_logbook/textCard';
import ImageCard from 'components/_logbook/imageCard';
import VideoCard from 'components/_logbook/videoCard';
import FileCard from 'components/_logbook/fileCard';
import SectionWrapper from 'components/sectionWrapper';

const LogbookComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Fetch initiative data
    const { initiative, CONSTANTS } = useInitiativeDataStore();
    const [logs, setLogs] = useState([]);
    // const [results, setResults] = useState();

    // Hook: Metadata
    const { labelTodo, label } = useMetadata();

    useEffect(() => {
        // Make sure data it loaded
        if (
            initiative?._initiativeUpdates &&
            Object.keys(initiative?._initiativeUpdates).length !== 0
        ) {
            const logs = Object.values(initiative._initiativeUpdates)
                .filter(
                    item =>
                        item.Type__c !== CONSTANTS.TYPES.LOGBOOK_TYPE_METRICS // Ignore metrics updates
                )
                .map(item => {
                    // Media Types: Picture || Video || Document
                    const type = item.Initiative_Update_Content__r
                        ? item.Initiative_Update_Content__r?.records[0]?.Type__c
                        : 'Text';
                    const summary =
                        initiative._activities[item.Initiative_Activity__c]
                            ?.Things_To_Do__c;
                    // Wrap links in <a> tag
                    const description = item.Description__c?.replace(
                        /\bhttps?:\/\/\S+/gi,
                        '<a href="$&" target="_blank" class="color: text-blue-200">$&</a>'
                    );
                    // Get clean filenames from URL
                    const fileName = decodeURIComponent(
                        item.Initiative_Update_Content__r?.records[0]?.URL__c?.split(
                            '/'
                        ).pop()
                    );

                    return {
                        type: type,
                        url:
                            item.Initiative_Update_Content__r?.records[0]
                                ?.URL__c,
                        fileName: fileName,
                        description: description,
                        summary: summary,
                        date: dayjs(item.LastModifiedDate).format('DD/MM/YYYY'),
                        time: dayjs(item.LastModifiedDate).format('HH:mm'),
                    };
                });

            setLogs(logs);
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
                        <div className="flex justify-between mr-48 md:mr-0">
                            <h1 className="pointer-events-none t-h1">
                                {label('custom.FA_MenuLogbook')}
                            </h1>
                            <UpdateButton
                                mode="initiative"
                                baseUrl="logbook-entry"
                                variant="primary"
                            />
                        </div>
                    </SectionWrapper>
                    {logs.map((item, index) => {
                        if (item.type == 'Text') {
                            return (
                                <TextCard
                                    key={index}
                                    hasBackground={true}
                                    summary={item.summary}
                                    body={item.description}
                                    date={`${item.date} - ${item.time}`}
                                />
                            );
                        } else if (item.type == 'Picture') {
                            return (
                                <ImageCard
                                    key={index}
                                    hasBackground={true}
                                    summary={item.summary}
                                    body={item.description}
                                    date={`${item.date} - ${item.time}`}
                                    image={item.url}
                                />
                            );
                        } else if (item.type == 'Video') {
                            return (
                                <VideoCard
                                    key={index}
                                    hasBackground={true}
                                    summary={item.summary}
                                    body={item.description}
                                    date={`${item.date} - ${item.time}`}
                                    video={item.url}
                                />
                            );
                        } else if (item.type == 'Document') {
                            return (
                                <FileCard
                                    key={index}
                                    hasBackground={true}
                                    summary={item.summary}
                                    body={item.description}
                                    date={`${item.date} - ${item.time}`}
                                    fileName={item.fileName}
                                    filePath={item.url}
                                />
                            );
                        } else {
                            <p>Missing card</p>;
                        }
                    })}

                    {logs.length < 1 && <SectionEmpty type="initiative" />}
                    <Footer />
                </div>
            )}
        </>
    );
};

LogbookComponent.propTypes = {
    pageProps: t.object,
};

LogbookComponent.defaultProps = {
    pageProps: {},
};

LogbookComponent.layout = 'initiative';

export default LogbookComponent;
