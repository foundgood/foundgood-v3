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

    function valueSet(path) {
        const valuesParent = _get(
            metadata.valueSets,
            `${locale}.${path}`,
            null
        );

        // Check for controlled values
        if (valuesParent && valuesParent.controlledBy) {
            return valuesParent.controlledValues;
        }

        // Default values
        if (valuesParent) {
            return valuesParent.values;
        }

        return [];
    }

    function log() {
        console.log(metadata);
    }

    return { label, type, valueSet, helpText, log };
};

export default useMetadata;
