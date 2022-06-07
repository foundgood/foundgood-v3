// React
import { useState } from 'react';

const useModalState = () => {
    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);

    // ///////////////////
    // METHODS
    // ///////////////////

    function modalOpen() {
        setModalIsOpen(true);
    }

    function modalClose() {
        setModalIsOpen(false);
    }

    function modalSaving() {
        setModalIsSaving(true);
    }

    function modalNotSaving() {
        setModalIsSaving(false);
    }

    // ///////////////////
    // RETURN
    // ///////////////////

    return {
        modalOpen,
        modalClose,
        modalSaving,
        modalNotSaving,
        modalState: {
            isOpen: modalIsOpen,
            isSaving: modalIsSaving,
        },
    };
};

export default useModalState;
