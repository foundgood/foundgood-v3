// Packages
import { useRouter } from 'next/router';
import _get from 'lodash.get';
import _uniqBy from 'lodash.uniqby';

// Data
import {
    labels,
    texts,
    objects,
    pickLists,
    controlledPickLists,
    staticData,
} from '_labels/labels';

const useLabels = () => {
    const { locale } = useRouter();

    // TODO FunderId logic
    const funderId = false;

    function missing(path, label = '') {
        return (
            <span className="px-6 pt-4 pb-2 font-bold text-white bg-error rounded-4 text-14">
                {path} {label}
            </span>
        );
    }

    function label(path, hideError = !process.env.NODE_ENV === 'development') {
        let label;
        // 1. Funder based
        if (funderId) {
            label = _get(labels, `${path}.${funderId}.${locale}`);
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
        label = hideError ? '' : missing(path, `(label [${locale}])`);
        return label;
    }

    function text(path, hideError = !process.env.NODE_ENV === 'development') {
        let text;
        // 1. Funder based
        if (funderId) {
            text = _get(texts, `${path}.${funderId}.${locale}`);
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
        text = hideError ? '' : missing(path, `(text [${locale}])`);
        return text;
    }

    const object = {
        label(path) {
            let label;
            // 1. Funder based
            if (funderId) {
                label = _get(objects, `${path}.${funderId}.${locale}.label`);
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
            label = missing(path, `(object label [${locale}])`);
            return label;
        },
        helpText(path) {
            let label;
            // 1. Funder based
            if (funderId) {
                label = _get(objects, `${path}.${funderId}.${locale}.helpText`);
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
            label = missing(path, `(object help text [${locale}])`);
            return label;
        },
    };

    function dataSet(path) {
        return _get(staticData, `${path}.${locale}`);
    }

    function pickList(path) {
        let foundationPickList = {};
        let pickList;
        // 1. Funder based
        if (funderId) {
            foundationPickList = _get(
                pickLists,
                `${path}.${funderId}.${locale}`
            );
        }
        // 2. Default
        pickList = _get(pickLists, `${path}.${locale}`);
        if (typeof pickList === 'object') {
            return Object.values({ ...pickList, ...foundationPickList });
        }
        // 3. Missing
        return [
            {
                label: `${path}, (pickList [${locale}])`,
                value: 'missing',
            },
        ];
    }

    function controlledPickList(path, controllerValue) {
        let foundationPickList = [];
        let pickList;
        // 1. Funder based
        if (funderId) {
            foundationPickList = _get(
                controlledPickLists,
                `${path}.${funderId}.${locale}.${controllerValue}`,
                []
            );
        }
        // 2. Default
        pickList = _get(
            controlledPickLists,
            `${path}.${locale}.${controllerValue}`
        );
        if (Array.isArray(pickList)) {
            return _uniqBy([...foundationPickList, ...pickList], 'value');
        }
        // 3. Missing
        return [
            {
                label: `${path}.${controllerValue}, (controlled pickList [${locale}])`,
                value: 'missing',
            },
        ];
    }

    function getValueLabel(path, value, controlled = false) {
        let valuesArray;

        // Controlled picklist (build values array of all controlled values)
        if (controlled) {
            let foundationPickList = [];
            let pickList;
            // 1. Funder based
            if (funderId) {
                foundationPickList = Object.values(
                    _get(
                        controlledPickLists,
                        `${path}.${funderId}.${locale}`,
                        {}
                    )
                ).reduce((acc, values) => [...acc, ...values], []);
            }

            // 2. Default
            pickList = Object.values(
                _get(controlledPickLists, `${path}.${locale}`, {})
            ).reduce((acc, values) => [...acc, ...values], []);

            // Combine
            valuesArray = _uniqBy(
                [...foundationPickList, ...pickList],
                'value'
            );
        } else {
            // PickList value
            valuesArray = pickList(path);
        }

        // Return value
        return valuesArray.find(v => v.value === value)?.label ?? 'N/A';
    }

    function labelTodo(path) {
        let label;
        label = missing(path, `(labelTodo)`);
        return label;
    }

    function log() {
        console.log({
            labels,
            texts,
            objects,
            pickLists,
            controlledPickLists,
            staticData,
        });
    }

    return {
        label,
        text,
        object,
        pickList,
        controlledPickList,
        getValueLabel,
        dataSet,
        labelTodo,
        log,
    };
};

export default useLabels;
