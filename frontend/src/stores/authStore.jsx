import { create } from 'zustand';
import { persist } from 'zustand/middleware';


// Encrypted storage to be implemented here
const authStore = create(persist(
    (set) => ({
        user: null,
        accessToken: null,
        assignUser: (user) => set({ user }),
        assignAccessToken: (accessToken) => set({ accessToken }),
        clearAuth: () => set({ user: null, accessToken: null }),
        clearAccessToken: () => set({ accessToken: null }),
    }),
    {
        name: 'auth-storage', // unique name
    })
);

export default authStore;