import dynamic from 'next/dynamic';
const ConfirmModal = dynamic(() => import('./confirmModal'), { ssr: false });
export default ConfirmModal;
