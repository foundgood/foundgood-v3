// Packages
import { useRouter } from 'next/router';

const useContext = () => {
    const { query } = useRouter();

    return {
        CONTEXTS: {
            REPORT: 'report',
            INITIATIVE: 'initiative',
        },
        MODE: query?.reportId ?? false === 'report' ? 'report' : 'initiative',
        REPORT_ID: query?.reportId,
        INITIATIVE_ID: query?.initiativeId,
    };
};

export default useContext;
