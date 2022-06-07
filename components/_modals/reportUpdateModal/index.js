import dynamic from 'next/dynamic';
const ReportUpdateModal = dynamic(() => import('./reportUpdateModal'), {
    ssr: false,
});
export default ReportUpdateModal;
