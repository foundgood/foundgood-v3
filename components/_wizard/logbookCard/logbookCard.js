// React
import React from 'react';

// Packages
import t from 'prop-types';
import dayjs from 'dayjs';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';

const LogbookCardsComponent = ({
    headline,
    items,
    actionCreate,
    actionUpdate,
    disableCreate,
}) => {
    // Hook: Metadata
    const { label } = useMetadata();

    return (
        <div className="p-16 max-w-[600px] rounded-8 bg-teal-10 text-teal-100">
            <div className="flex justify-between mb-32">
                {headline && (
                    <div className="flex items-center">
                        <h4 className="t-sh4">{headline}</h4>
                    </div>
                )}
                {!disableCreate && (
                    <Button
                        theme="teal"
                        variant="primary"
                        action={actionCreate}>
                        {label('custom.FA_ButtonAddLogEntry')}
                    </Button>
                )}
            </div>
            {items?.length > 0 && (
                <div className="inline-grid items-start w-full grid-cols-1 gap-24 md:grid-cols-2">
                    {items.map((item, index) => {
                        const content =
                            item?.Initiative_Update_Content__r?.records[0];

                        return (
                            <div
                                key={`i-${index}`}
                                className="flex flex-col items-start justify-between w-full p-16 bg-white rounded-8">
                                {(item?.Initiative_Activity__r
                                    ?.Things_To_Do__c ??
                                    null) && (
                                    <p className="mb-12 t-sh7">
                                        {
                                            item?.Initiative_Activity__r
                                                ?.Things_To_Do__c
                                        }
                                    </p>
                                )}
                                <div className="text-teal-100 t-small">
                                    {item.Description__c}
                                </div>
                                {/* Content for initiative update */}
                                {content && (
                                    <div className="mt-12">
                                        {content.Type__c === 'Picture' && (
                                            <img
                                                className="w-full rounded-4"
                                                src={content.URL__c}
                                            />
                                        )}
                                        {content.Type__c === 'Video' && (
                                            <video
                                                controls
                                                className="w-full rounded-4"
                                                src={content.URL__c}
                                            />
                                        )}
                                        {content.Type__c === 'Document' && (
                                            <a
                                                target="_blank"
                                                href={content.URL__c}>
                                                View document
                                            </a>
                                        )}
                                    </div>
                                )}
                                <div className="mt-12 text-teal-60 t-sh6">
                                    {dayjs(item.CreatedDate).format(
                                        'DD.MM.YYYY, HH:mm'
                                    )}
                                </div>
                                <div className="self-end mt-16">
                                    <Button
                                        theme="teal"
                                        variant="quaternary"
                                        action={() => actionUpdate(item)}>
                                        {label('custom.FA_Update')}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

LogbookCardsComponent.propTypes = {
    // Card title
    headline: t.string,
    items: t.array,
    disableCreate: t.bool,
};

LogbookCardsComponent.defaultProps = {
    disableCreate: false,
};

export default LogbookCardsComponent;
