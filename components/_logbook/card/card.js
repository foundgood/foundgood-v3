// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Image from 'next/image';

// Components
import SectionWrapper from 'components/sectionWrapper';

// Icons
import { FiFileText } from 'react-icons/fi';

const CardComponent = ({
    hasBackground,
    summary,
    body,
    date,
    image,
    video,
    filePath,
    fileName,
    className,
}) => {
    // const downloadFile = () => {
    //     window.location.href = filePath;
    // };

    const createMarkup = text => {
        return {
            __html: text,
        };
    };
    return (
        <SectionWrapper
            className={cc([
                'rounded-8 mt-24',
                className,
                {
                    'bg-white': hasBackground,
                    'border-4 border-blue-10': !hasBackground,
                },
            ])}>
            <p className="t-sh6 text-blue-60">{summary}</p>
            {/* {body && <p className="mt-16 t-preamble">{body}</p>} */}
            {body && (
                <div
                    className="mt-16 t-preamble"
                    dangerouslySetInnerHTML={createMarkup(body)}
                />
            )}

            {image && (
                <div className="relative mt-16 bg-blue-10 imageContainer">
                    {/* 
                    TODO? Get image width/height and set layout to 'responsive' 
                    https://github.com/vercel/next.js/discussions/18739#discussioncomment-344932
                    */}
                    <Image className="image" src={image} layout="fill" />
                </div>
            )}
            {video && (
                <div className="w-full mt-16 bg-blue-10">
                    {/* 
                    Use video player library for UI?
                    What video formats are supported?
                    
                    type="video/mp4"
                    type="video/webm"
                    */}
                    <video controls src={video} className="w-full" />
                </div>
            )}
            {filePath && fileName && (
                <a
                    className="flex w-full p-16 mt-16 cursor-pointer rounded-8 bg-blue-10"
                    download={fileName} // Only work if same domain
                    href={filePath}
                    target="_blank">
                    <div className="mr-16">
                        <FiFileText className="w-48 h-48" />
                    </div>
                    <div className="flex flex-col">
                        <div className="t-h6">{fileName}</div>
                        <div className="text-blue-200 t-sh5">Download</div>
                    </div>
                </a>
            )}
            {date && <p className="mt-16 t-sh6 text-blue-60">{date}</p>}
        </SectionWrapper>
    );
};

CardComponent.propTypes = {
    // Date - last in each card
    date: t.string.isRequired,
    // Either white background - Or transparent with grey border
    hasBackground: t.bool,
    // Card summary (in the top)
    summary: t.string,
    // Card body text
    body: t.string,
    // Image url
    image: t.string,
    // Video url - TODO: Supported foramts?
    video: t.string,
    // Name of file to download
    fileName: t.string,
    // Url to file
    filePath: t.string,
};

CardComponent.defaultProps = {};

export default CardComponent;
