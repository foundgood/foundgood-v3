// Packages
import { useRouter } from 'next/router';
import _get from 'lodash.get';

// Data
import metadata from '_metadata/metadata';

const useMetadata = () => {
    const { locale } = useRouter();

    function label(path) {
        return _get(
            metadata.labels,
            `${locale}.${path}.label`,
            _get(metadata.labels.en, `${path}.label`, '')
        );
    }

    function helpText(path) {
        return _get(
            metadata.labels,
            `${locale}.${path}.helpText`,
            _get(metadata.labels.en, `${path}.helpText`, '')
        );
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

        // Check for controlled values
        if (valuesParent && valuesParent.controlledBy) {
            return formattedAsSelect
                ? valuesParent.controlledValues.map(item => ({
                      label: item.label,
                      value: item.fullName,
                  }))
                : valuesParent.controlledValues;
        }

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

    function labelTodo(label) {
        return label;
    }

    function log() {
        console.log(metadata);
    }

    return { label, labelTodo, type, valueSet, helpText, log };
};

export default useMetadata;
