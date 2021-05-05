import create from 'zustand';

const useInitiativeDataStore = create((set, get) => ({
    initiative: null,
    updateInitiative(data) {
        console.log(data);
        set(state => ({ initiative: { ...state.initiative, ...data } }));
    },
}));

export { useInitiativeDataStore };
