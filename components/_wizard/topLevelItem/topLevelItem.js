// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import AnimateHeight from 'react-animate-height';

// Utilities
import { useWizardNavigationStore } from 'utilities/store';

// Components
import SubLevelItem from 'components/_wizard/subLevelItem';

// Icons
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

const TopLevelItemComponent = ({ index, title, collapsed, items }) => {
    // Store: wizardNavigation
    const { onSetCollapsed } = useWizardNavigationStore();

    const onToggleItem = () => {
        // TODO - Only one open item, at a time?
        const bool = !collapsed;
        onSetCollapsed(index, bool);
    };

    return (
        <li
            className={cc([
                'mt-32',
                // { 'bg-blue-10': collapsed }
            ])}>
            <span
                className="flex t-caption-bold md:cursor-pointer"
                onClick={onToggleItem}>
                <i className="mr-16">
                    {!collapsed && <FiChevronUp />}
                    {collapsed && <FiChevronDown />}
                </i>
                {title}
            </span>

            {/* Sub-level items */}
            <AnimateHeight
                duration={300}
                animateOpacity={true}
                height={collapsed ? 0 : 'auto'}>
                <ul className="block">
                    {items.map((item, i) => (
                        <SubLevelItem
                            key={`nav-${i}`}
                            parentIndex={index}
                            index={i}
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
