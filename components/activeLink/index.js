import dynamic from 'next/dynamic';
const ActiveLink = dynamic(() => import('./activeLink.js'), { ssr: false });
export default ActiveLink;
