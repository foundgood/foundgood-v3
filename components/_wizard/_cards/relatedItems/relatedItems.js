// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities

// Components

const RelatedItemsComponent = ({ title, collection }) => {
    // ///////////////////
    // RENDER
    // ///////////////////

    return collection?.items.length > 0 ? (
        <div className="flex flex-col p-16 space-y-16 bg-teal-20 rounded-8">
            <h5 className="t-h6">{title}</h5>
            {collection?.items.map(item => (
                <div
                    key={item.Id}
                    className="flex flex-col p-16 bg-white rounded-8">
                    <span className="mb-4 t-sh6 text-teal-60">
                        {collection?.type(item)}
                    </span>
                    <h5 className="t-h5">{collection?.title(item)}</h5>
                </div>
            ))}
        </div>
    ) : null;
};

RelatedItemsComponent.propTypes = {
    title: t.string.isRequired,
    collection: t.shape({
        title: t.func.isRequired,
        type: t.func.isRequired,
        items: t.array.isRequired,
    }),
};

RelatedItemsComponent.defaultProps = {
    title: '',
    collection: {
        title: null,
        type: null,
        items: [],
    },
};

export default RelatedItemsComponent;
