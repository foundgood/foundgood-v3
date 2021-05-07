import dynamic from 'next/dynamic';
const AsideNavigation = dynamic(() => import('./asideNavigation.js'), {
    ssr: false,
});
import TopLevelItem from './topLevelItem.js';
import SubLevelItem from './subLevelItem.js';
export { AsideNavigation, TopLevelItem, SubLevelItem };
