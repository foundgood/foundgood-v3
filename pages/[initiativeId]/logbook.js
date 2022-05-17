// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import dayjs from 'dayjs';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
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
    // Fetch initiative data
    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();

    const [logs, setLogs] = useState([]);

    // Hook: Metadata
    const { label } = useLabels();

    useEffect(() => {
        // Make sure data it loaded
        if (
            initiative?._updates &&
            Object.keys(initiative?._updates).length !== 0
        ) {
            const logs = Object.values(initiative._updates)
                .filter(
                    item =>
                        item.Type__c !== CONSTANTS.UPDATES.LOGBOOK_TYPE_METRICS // Ignore metrics updates
                )
                .map(item => {
                    const updateContent = utilities.updateContents.getFromUpdateId(
                        item.Id
                    );

                    // Media Types: Picture || Video || Document
                    const type = updateContent ? updateContent.Type__c : 'Text';
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
                        updateContent?.URL__c?.split('/').pop()
                    );

                    return {
                        type: type,
                        CreatedDate: item.CreatedDate,
                        url: updateContent?.URL__c,
                        fileName: fileName,
                        description: description,
                        summary: summary,
                        date: dayjs(item.LastModifiedDate).format('DD/MM/YYYY'),
                        time: dayjs(item.LastModifiedDate).format('HH:mm'),
                    };
                })
                .sort(
                    (a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate)
                );
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
                                {label('MenuLogbook')}
                            </h1>
                            <UpdateButton
                                mode="initiative"
                                baseUrl="logbook-entry"
                                variant="primary"
                            />
                        </div>
                    </SectionWrapper>
                    {logs.map((item, index) => {
                        if (item.type == 'Picture') {
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
                        } else if (item.type == 'Video' && item.url) {
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
                            return (
                                <TextCard
                                    key={index}
                                    hasBackground={true}
                                    summary={item.summary}
                                    body={item.description}
                                    date={`${item.date} - ${item.time}`}
                                />
                            );
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

export default WithAuth(LogbookComponent);
