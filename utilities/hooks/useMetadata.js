// Packages
import { useRouter } from 'next/router';
import _get from 'lodash.get';

// Data
import metadata from '_metadata/metadata';

const useMetadata = () => {
    const { locale } = useRouter();

    function label(path) {
        // Locale based
        let label = _get(metadata.labels, `${locale}.${path}.label`);
        if (typeof label === 'string') {
            return label;
        }
        // Fallback
        label = _get(metadata.labels.en, `${path}.label`);
        if (typeof label === 'string') {
            return label;
        }
        return label;
    }

    function helpText(path) {
        // Locale based
        let label = _get(metadata.labels, `${locale}.${path}.helpText`);
        if (typeof label === 'string') {
            return label;
        }
        // Fallback
        label = _get(metadata.labels.en, `${path}.helpText`);
        if (typeof label === 'string') {
            return label;
        }
        return label;
    }

    function type(path) {
        return _get(metadata.types, `${path}`, null);
    }

    function valueSet(path, formattedAsSelect = true) {
        const valuesParent = _get(
            metadata.valueSets,
            `${locale}.${path}`,
            null
        );

        // Default values
        if (valuesParent) {
            return formattedAsSelect
                ? valuesParent.values
                      .filter(item => !(item.isActive ?? false))
                      .map(item => ({
                          label: item.label,
                          value: item.fullName,
                      }))
                : valuesParent.values.filter(item => !(item.isActive ?? false));
        }

        return [];
    }

    function controlledValueSet(
        path,
        key,
        complete = false,
        formattedAsSelect = true
    ) {
        const valuesObject = _get(
            metadata.valueSets,
            `${locale}.${path}.controlledValues`,
            null
        );

        // Compile all values if they are there
        if (!valuesObject[key] || complete) {
            return formattedAsSelect
                ? Object.values(valuesObject)
                      .flat()
                      .filter(item => !(item.isActive ?? false))
                      .map(item => ({
                          label: item.label,
                          value: item.fullName,
                      }))
                : Object.values(valuesObject)
                      .flat()
                      .filter(item => !(item.isActive ?? false));
        }

        if (valuesObject[key]) {
            return formattedAsSelect
                ? valuesObject[key]
                      .filter(item => !(item.isActive ?? false))
                      .map(item => ({
                          label: item.label,
                          value: item.fullName,
                      }))
                : valuesObject[key].filter(item => !(item.isActive ?? false));
        }

        return [];
    }

    function getValueLabel(path, value, controlled = false) {
        log();
        let valuesArray;
        if (controlled) {
            valuesArray = Object.values(
                _get(
                    metadata.valueSets,
                    `${locale}.${path}.controlledValues`,
                    {}
                )
            ).reduce((acc, values) => [...acc, ...values], []);
        } else {
            valuesArray = _get(metadata.valueSets, `${locale}.${path}`, {
                values: [],
            }).values;
        }

        return valuesArray.filter(v => v.fullName === value)[0]?.label ?? 'N/A';
    }

    function labelTodo(label) {
        return label;
    }

    function log() {
        console.log(metadata);
    }

    return {
        label,
        labelTodo,
        type,
        valueSet,
        helpText,
        log,
        controlledValueSet,
        getValueLabel,
    };
};

export default useMetadata;
