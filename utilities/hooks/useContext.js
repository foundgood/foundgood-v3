// Packages
import { useRouter } from 'next/router';

// Data
import { CONTEXTS } from 'utilities/configuration';

const useContext = () => {
    const { query, asPath, locale } = useRouter();
    const asPathArray = asPath.split('/');

    return {
        // All contexts
        CONTEXTS,
        // Current context
        MODE: asPathArray[1].toLowerCase(),
        // Update mode within context
        UPDATE: query.update,
        // Path (e.g. introduction)
        PATH: asPathArray[asPathArray.length - 1].toLowerCase(),
        // Various
        REPORT_ID: query?.reportId,
        INITIATIVE_ID: query?.initiativeId,
        LOCALE: locale,
    };
};

export default useContext;
export { CONTEXTS };
