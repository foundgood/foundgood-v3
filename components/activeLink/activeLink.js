// React
import React, { Children } from 'react';

// Packages
import Link from 'next/link';
import t from 'prop-types';
import { useRouter } from 'next/router';

const ActiveLinkComponent = ({ children, active, ...props }) => {
    const { asPath } = useRouter();
    const child = Children.only(children);
    const childClassName = child.props.className || '';

    const className =
        asPath === props.href || asPath.indexOf(props.href) > -1
            ? `${childClassName} ${active}`.trim()
            : childClassName;

    return (
        <Link {...props}>
            {React.cloneElement(child, {
                className: className || null,
            })}
        </Link>
    );
};

ActiveLinkComponent.propTypes = {
    active: t.string.isRequired,
};

ActiveLinkComponent.defaultProps = {
    active: '',
};

export default ActiveLinkComponent;
