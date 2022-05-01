// Packages
import { useRouter } from 'next/router';
import _get from 'lodash.get';
import parse from 'html-react-parser';

import { useMetadata } from 'utilities/hooks';

// Data
import {
    labels,
    texts,
    objects,
    pickLists,
    controlledPickLists,
} from '_labels/labels';

const useLabels = () => {
    const { locale } = useRouter();
    const {
        labelTodo,
        valueSet,
        log: logMetadata,
        controlledValueSet,
        getValueLabel,
    } = useMetadata();

    // TODO FounderId logic
    const founderId = null;

    function label(path) {
        let label;
        // 1. Founder based
        if (founderId) {
            label = _get(labels, `${path}.${founderId}.${locale}`);
            if (typeof label === 'string') {
                return label;
            }
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
        let text;
        // 1. Founder based
        if (founderId) {
            text = _get(texts, `${path}.${founderId}.${locale}`);
            if (typeof text === 'string') {
                return parse(text);
            }
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

    const object = {
        label(path) {
            let label;
            // 1. Founder based
            if (founderId) {
                label = _get(objects, `${path}.${founderId}.${locale}.label`);
                if (typeof label === 'string') {
                    return label;
                }
            }
            // 2. Default
            label = _get(objects, `${path}.${locale}.label`);
            if (typeof label === 'string') {
                return label;
            }
            // 3. Missing
            label = `object ${path} label missing`;
            return label;
        },
        helpText(path) {
            let label;
            // 1. Founder based
            if (founderId) {
                label = _get(
                    objects,
                    `${path}.${founderId}.${locale}.helpText`
                );
                if (typeof label === 'string') {
                    return label;
                }
            }
            // 2. Default
            label = _get(objects, `${path}.${locale}.helpText`);
            if (typeof label === 'string') {
                return label;
            }
            // 3. Missing
            label = `object ${path} helpText missing`;
            return label;
        },
    };

    function log() {
        console.log({ labels, texts, objects, pickLists, controlledPickLists });
        logMetadata();
    }

    return {
        label,
        text,
        object,
        log,

        labelTodo,
        valueSet,
        controlledValueSet,
        getValueLabel,
    };
};

export default useLabels;
