// Packages
import { useRouter } from 'next/router';

const CONTEXTS = {
    REPORT: 'report',
    INITIATIVE: 'initiative',
    CREATE_INITIATIVE: 'create',
};

const useContext = () => {
    const { query, asPath, locale } = useRouter();

    return {
        // All contexts
        CONTEXTS,
        // Current context
        MODE: asPath.split('/')[1].toLowerCase(),
        // Various
        REPORT_ID: query?.reportId,
        INITIATIVE_ID: query?.initiativeId,
        LOCALE: locale,
    };
};

export default useContext;
export { CONTEXTS };
