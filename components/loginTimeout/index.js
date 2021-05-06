import dynamic from 'next/dynamic';
const LoginTimeout = dynamic(() => import('./loginTimeout.js'), { ssr: false });
export default LoginTimeout;