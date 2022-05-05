// React
import { useEffect, useState } from 'react';

// Utilities
import initiativeGetters from 'utilities/initiativeGetters';
import { useInitiativeDataStore } from 'utilities/store';

// This hook allows for using the initiative getters (utility) in a non-store-based context lige reports based on JSON data e.g.
const useInitiativeGetters = initiativeData => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // STATE
    // ///////////////////

    const [initiative, setInitiative] = useState();
    const [utilities, setUtilities] = useState(null);

    // ///////////////////
    // METHODS
    // ///////////////////

    function get() {
        return { initiative };
    }

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        if (initiativeData?.Id) {
            setInitiative(initiativeData);
        }
    }, [initiativeData]);

    useEffect(() => {
        if (initiative?.Id) {
            setUtilities(initiativeGetters(get, CONSTANTS));
        }
    }, [initiative]);

    // ///////////////////
    // RETURN
    // ///////////////////

    return {
        utilities,
    };
};

export default useInitiativeGetters;
