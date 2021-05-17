// Packages
import { useRouter } from 'next/router';

const useContextMode = () => {
    const { query } = useRouter();

    return {
        CONTEXTS: {
            REPORT: 'report',
            INITIATIVE: 'initiative',
        },
        MODE:
            query?.context?.toLowerCase() === 'report'
                ? 'report'
                : 'initiative',
        UPDATE: query?.update?.toLowerCase() === 'true',
        REPORT_ID: query?.id,
    };
};

export default useContextMode;
