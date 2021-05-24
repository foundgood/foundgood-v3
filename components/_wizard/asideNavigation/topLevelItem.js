// React
import React from 'react';

// Packages
import cc from 'classcat';
import AnimateHeight from 'react-animate-height';
import t from 'prop-types';

// Utilities
import { useWizardNavigationStore } from 'utilities/store';
import { useMetadata } from 'utilities/hooks';

// Components
import { SubLevelItem } from 'components/_wizard/asideNavigation';

// Icons
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

const TopLevelItemComponent = ({ item }) => {
    const { title, items } = item;

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Store: wizardNavigation
    const { toggleSection, openSection } = useWizardNavigationStore();

    // Checking toggled section or not
    const sectionToggled = openSection === item.title;

    return (
        <li className="mt-32">
            <span
                className="flex t-caption-bold md:cursor-pointer"
                onClick={() => toggleSection(item)}>
                <i className="mr-16">
                    {sectionToggled && <FiChevronUp />}
                    {!sectionToggled && <FiChevronDown />}
                </i>
                {labelTodo(title)}
            </span>

            {/* Sub-level items */}
            <AnimateHeight
                duration={300}
                animateOpacity={true}
                height={sectionToggled ? 'auto' : 0}>
                <ul className="block">
                    {items.map((childItem, i) => (
                        <SubLevelItem key={`nav-${i}`} item={childItem} />
                    ))}
                </ul>
            </AnimateHeight>
        </li>
    );
};

TopLevelItemComponent.propTypes = {
    item: t.object,
};

TopLevelItemComponent.defaultProps = {};

export default TopLevelItemComponent;
