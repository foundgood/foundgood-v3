// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import AnimateHeight from 'react-animate-height';

// Utilities

// Components
import SubLevelItem from 'components/_asideNavigation/subLevelItem';

// Icons
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

const TopLevelItemComponent = ({ title, items }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const onToggleItem = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <li
            className={cc([
                'mt-32',
                // { 'bg-blue-10': isExpanded }
            ])}>
            <span
                className="flex t-caption-bold md:cursor-pointer"
                onClick={onToggleItem}>
                <i className="mr-16">
                    {isExpanded && <FiChevronUp />}
                    {!isExpanded && <FiChevronDown />}
                </i>
                {title}
            </span>

            {/* Sub-level items */}
            <AnimateHeight
                duration={300}
                animateOpacity={true}
                height={isExpanded ? 'auto' : 0}>
                <ul className="block">
                    {items.map((item, index) => (
                        <SubLevelItem
                            key={`nav-${index}`}
                            title={item.title}
                            inProgress={item.inProgress}
                            completed={item.completed}
                        />
                    ))}
                </ul>
            </AnimateHeight>
        </li>
    );
};

TopLevelItemComponent.propTypes = {};

TopLevelItemComponent.defaultProps = {};

export default TopLevelItemComponent;
