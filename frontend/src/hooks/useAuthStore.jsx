import { create } from 'zustand';
import { persist } from 'zustand/middleware';


// Encrypted storage to be implemented here
const useAuthStore = create(persist(
    (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        assignUser: (user) => set({ user }),
        assignTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
        clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
        name: 'auth-storage', // unique name
    })
);

export default useAuthStore;