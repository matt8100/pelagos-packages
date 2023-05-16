import {forwardRef} from 'react';
import PropTypes from 'prop-types';

import passSideNavActive from './passSideNavActive';
import './SideNav.less';

/** Side navigation component. */
const SideNav = forwardRef(({className, active, children, ...props}, ref) => (
	<nav {...props} className={`SideNav${className ? ` ${className}` : ''}`} aria-hidden={!active} ref={ref}>
		{passSideNavActive(active, children)}
	</nav>
));

SideNav.displayName = 'SideNav';

SideNav.propTypes = {
	/** The component class name(s). */
	className: PropTypes.string,
	/** Whether the side navigation is active. */
	active: PropTypes.bool,
	/** The child elements. */
	children: PropTypes.node,
};

export default SideNav;
