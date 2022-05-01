// Packages
import { useRouter } from 'next/router';
import _get from 'lodash.get';
import parse from 'html-react-parser';

// Data
import { labels, texts } from '_labels/labels';

const useMetadata = () => {
    const { locale } = useRouter();

    // TODO FounderId logic
    const founderId = 'TBD';

    function label(path) {
        // 1. Founder based
        let label = _get(labels, `${path}.${founderId}.${locale}`);
        if (typeof label === 'string') {
            return label;
        }
        // 2. Default
        label = _get(labels, `${path}.${locale}`);
        if (typeof label === 'string') {
            return label;
        }
        // 3. Missing
        label = `${path} missing`;
        return label;
    }

    function text(path) {
        // 1. Founder based
        let text = _get(texts, `${path}.${founderId}.${locale}`);
        if (typeof text === 'string') {
            return parse(text);
        }
        // 2. Default
        text = _get(texts, `${path}.${locale}`);
        if (typeof text === 'string') {
            return parse(text);
        }
        // 3. Missing
        text = `${path} missing`;
        return parse(text);
    }

    function log() {
        console.log({ labels, texts });
    }

    return {
        label,
        text,
        log,
    };
};

export default useMetadata;
