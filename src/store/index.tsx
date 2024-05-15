import { create } from 'zustand';

export interface State {
    uid: string | null;
    setUid: (uid: string) => void;
}

const useStore = create<State>((set) => ({
    uid: null,
    setUid: (uid: string) => set(() => ({ uid })),
}));

export default useStore;
