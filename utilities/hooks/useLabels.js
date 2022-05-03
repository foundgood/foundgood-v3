// Packages
import { useRouter } from 'next/router';
import _get from 'lodash.get';

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
        controlledValueSet,
        getValueLabel,
    } = useMetadata();

    // TODO FounderId logic
    const founderId = null;

    function missing(path, label = '') {
        return (
            <span className="px-6 pt-4 pb-2 font-bold text-white bg-error rounded-4 text-14">
                {path} {label}
            </span>
        );
    }

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
        label = missing(path, '(label)');
        return label;
    }

    function text(path) {
        let text;
        // 1. Founder based
        if (founderId) {
            text = _get(texts, `${path}.${founderId}.${locale}`);
            if (typeof text === 'string') {
                return text;
            }
        }
        // 2. Default
        text = _get(texts, `${path}.${locale}`);
        if (typeof text === 'string') {
            return text;
        }
        // 3. Missing
        text = `${path} missing`;
        return text;
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
            label = missing(path, '(object label)');
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
            label = missing(path, '(object help text)');
            return label;
        },
    };

    function log() {
        console.log({ labels, texts, objects, pickLists, controlledPickLists });
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
