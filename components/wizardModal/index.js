import dynamic from 'next/dynamic';
const WizardModal = dynamic(() => import('./wizardModal'), { ssr: false });
export default WizardModal;
