import { useState, useEffect } from 'react';

import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';
import { useContext } from 'utilities/hooks';

// Method: Default Form error/validation handler
function error(error) {
    console.warn('Form invalid', error);
    throw error;
}

// Hook for handling which current submithandler that are set in Wizard Navigation Store
// The Submithandler is run when the "continue" button is clicked
// The submit will be context specific
const useWizardSubmit = (submitOptions = {}) => {
    const { setCurrentSubmitHandler } = useWizardNavigationStore();
    const { initiative } = useInitiativeDataStore();
    const { MODE, CONTEXTS } = useContext();

    // [form, submit, errorHandler]
    const defaultSubmitOptions = {
        [CONTEXTS.REPORT]: [null, null, null],
        [CONTEXTS.INITIATIVE]: [null, null, null],
        [CONTEXTS.INITIATIVE_CREATE]: [null, null, null],
    };

    const [mergedOptions] = useState({
        ...defaultSubmitOptions,
        ...submitOptions,
    });

    useEffect(() => {
        if (mergedOptions) {
            setTimeout(() => {
                if (mergedOptions[MODE]) {
                    const [form, submit, errorHandler] = mergedOptions[MODE];
                    setCurrentSubmitHandler(
                        form
                            ? form.handleSubmit(
                                  submit,
                                  errorHandler ? errorHandler : error
                              )
                            : null
                    );
                }
            }, 100);
        }
    }, [initiative]);

    return null;
};

export default useWizardSubmit;
