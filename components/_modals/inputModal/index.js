import dynamic from 'next/dynamic';
const InputModal = dynamic(() => import('./inputModal'), { ssr: false });
export default InputModal;
