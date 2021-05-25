// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Image from 'next/image';

// Utilities
import { isJson } from 'utilities';

const ReportDetailCardComponent = ({ headline, image, description, items }) => {
    return (
        <div
            className={cc([
                'flex',
                {
                    'justify-between flex-col md:flex-row': description,
                    'flex-col': !description,
                },
            ])}>
            <div className={cc([{ 'mr-24': description }])}>
                <div className="flex">
                    {image && (
                        <div className="h-24 mr-8 overflow-hidden rounded-4">
                            <Image src={image} width="24" height="24" />
                        </div>
                    )}
                    <div className="t-h6">{headline}</div>
                </div>
                {description &&
                    isJson(description) &&
                    JSON.parse(description).map(item => (
                        <p key={item.id} className="mt-16">
                            {item.text}
                        </p>
                    ))}
                {description && !isJson(description) && (
                    <p className="mt-16">{description}</p>
                )}
            </div>
            {items && (
                <div
                    className={cc([
                        'flex',
                        { 'flex-col flex-none md:w-1/3': description },
                    ])}>
                    {items.map((item, index) => (
                        <div
                            key={`i-${index}`}
                            className={cc([
                                'p-16 mt-8 border-4 border-blue-10 rounded-4',
                                { 'mr-8': !description },
                            ])}>
                            <div className="t-sh7">{item.label}</div>
                            <div className="t-caption-bold">{item.text}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    // return (
    //     <>
    //         {/*
    //         Two different layouts depending on if description exists
    //         */}
    //         {description && (
    //             <div className="flex justify-between">
    //                 <div className="mr-24">
    //                     <div className="flex">
    //                         {image && (
    //                             <div className="h-24 mr-8 overflow-hidden rounded-4">
    //                                 <Image src={image} width="24" height="24" />
    //                             </div>
    //                         )}
    //                         <div className="t-h6">{headline}</div>
    //                     </div>
    //                     {description &&
    //                         isJson(description) &&
    //                         JSON.parse(description).map(item => (
    //                             <p key={item.id} className="mt-16">
    //                                 {item.text}
    //                             </p>
    //                         ))}
    //                     {description && !isJson(description) && (
    //                         <p className="mt-16">{description}</p>
    //                     )}
    //                 </div>
    //                 {items && (
    //                     <div className="flex flex-col flex-none w-1/3">
    //                         {items.map((item, index) => (
    //                             <div
    //                                 key={`i-${index}`}
    //                                 className="p-16 mt-8 border-4 border-blue-10 rounded-4">
    //                                 <div className="t-sh7">{item.label}</div>
    //                                 <div className="t-caption-bold">
    //                                     {item.text}
    //                                 </div>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )}
    //             </div>
    //         )}
    //         {/* No description - Left align items under the headline */}
    //         {!description && (
    //             <div className="flex flex-col">
    //                 <div className="flex">
    //                     {image && (
    //                         <div className="h-24 mr-8 overflow-hidden rounded-4">
    //                             <Image src={image} width="24" height="24" />
    //                         </div>
    //                     )}
    //                     <div className="t-h6">{headline}</div>
    //                 </div>
    //                 {items && (
    //                     <div className="flex">
    //                         {items.map((item, index) => (
    //                             <div
    //                                 key={`i-${index}`}
    //                                 className="p-16 mt-8 mr-8 border-4 border-blue-10 rounded-4">
    //                                 <div className="t-sh7">{item.label}</div>
    //                                 <div className="mt-2 t-caption-bold">
    //                                     {item.text}
    //                                 </div>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )}
    //             </div>
    //         )}
    //     </>
    // );
};

ReportDetailCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Card description
    description: t.string,
    // Image url
    image: t.string,
    // Items
    items: t.arrayOf(
        t.shape({
            label: t.string,
            text: t.string,
        })
    ),
};

ReportDetailCardComponent.defaultProps = {};

export default ReportDetailCardComponent;

// All in one html
// return (
//     <div
//         className={cc([
//             'flex ',
//             {
//                 'bg-teal-20 justify-between': description,
//                 'bg-amber-20 flex-col': !description,
//             },
//         ])}>
//         <div
//             className={cc([
//                 {
//                     'mr-24 bg-teal-60': description,
//                     'bg-amber-60': !description,
//                 },
//             ])}>
//             <div className="flex">
//                 {image && (
//                     <div className="h-24 mr-8 overflow-hidden rounded-4">
//                         <Image src={image} width="24" height="24" />
//                     </div>
//                 )}
//                 <div className="t-h6">{headline}</div>
//             </div>

//             {description &&
//                 isJson(description) &&
//                 JSON.parse(description).map(item => (
//                     <p key={item.id} className="mt-16">
//                         {item.text}
//                     </p>
//                 ))}
//             {description && !isJson(description) && (
//                 <p className="mt-16">{description}</p>
//             )}
//         </div>

//         {items && (
//             <div
//                 className={cc([
//                     'flex flex-none w-1/3',
//                     {
//                         'flex-col bg-teal-100': description,
//                         'bg-amber-100': !description,
//                     },
//                 ])}>
//                 {items.map((item, index) => (
//                     <div
//                         key={`i-${index}`}
//                         className="p-16 mt-8 border-4 border-blue-10 rounded-4">
//                         <div className="t-sh7">{item.label}</div>
//                         <div className="t-caption-bold">{item.text}</div>
//                     </div>
//                 ))}
//             </div>
//         )}
//     </div>
// );
