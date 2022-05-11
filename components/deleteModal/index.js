import dynamic from 'next/dynamic';
const DeleteModal = dynamic(() => import('./deleteModal'), { ssr: false });
export default DeleteModal;
