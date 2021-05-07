// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Image from 'next/image';

// Components
import SectionWrapper from 'components/_report/sectionWrapper';

const CardComponent = ({
    hasBackground,
    summary,
    body,
    date,
    image,
    video,
    className,
}) => {
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
            {body && <p className="mt-16 t-preamble">{body}</p>}
            {image && (
                <div className="relative w-full mt-16 bg-blue-10 imageContainer w-100">
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
};

CardComponent.defaultProps = {};

export default CardComponent;
