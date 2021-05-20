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
                ? valuesParent.values.map(item => ({
                      label: item.label,
                      value: item.fullName,
                  }))
                : valuesParent.values;
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
                      .map(item => ({
                          label: item.label,
                          value: item.fullName,
                      }))
                : Object.values(valuesObject).flat();
        }

        if (valuesObject[key]) {
            return formattedAsSelect
                ? valuesObject[key].map(item => ({
                      label: item.label,
                      value: item.fullName,
                  }))
                : valuesObject[key];
        }

        return [];
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
    };
};

export default useMetadata;
